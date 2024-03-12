import { type Channel } from './types';

/**
 * Tries to execute the requested function
 * and returns the value back to the client.
 * @param {callback} handler - Callback function of the called function
 * @param {any[]} params - Function parameters
 * @return any | error
 */
const execute = (handler: any, params: any[]): any => {
  try {
    return handler(...params);
  } catch (error: any) {
    if (error instanceof Error) {
      const { message } = error;
      return { error: true, message, code: 'ERROR' };
    }

    return {
      error: true,
      message: error,
      code: 'CUSTOME_ERROR',
    };
  }
};

type ConsumeProps = {
  channel: Channel,
  queueName: string,
  handlers: any,
};

/**
 * Starts consuming the message queue. This just
 * consumes on specific queueue (queueName)
 * @param {ConsumeProps} props - Consuming properties
 * @return Proise
 */
export const startConsuming = ({
  channel,
  queueName,
  handlers,
}: ConsumeProps) => channel.consume(queueName, async (message: any) => {
  const { procedure, params } = JSON.parse(message.content.toString());
  const handler = handlers[procedure] || false;
  const { properties } = message;

  try {
    const result = handler
      ? await execute(handler, params)
      : { error: true, message: `Function/Procedure [${procedure}] does not exist` };

    channel.sendToQueue(
      properties.replyTo,
      Buffer.from(JSON.stringify({ result })),
      { correlationId: properties.correlationId },
    );
  } catch (error: any) {
    channel.sendToQueue(
      properties.replyTo,
      Buffer.from(JSON.stringify({
        result: {
          error: true,
          message: error.message,
          code: error.code,
        },
      })),
      { correlationId: properties.correlationId },
    );
  } finally {
    channel.ack(message);
  }
});

/**
 * Starts the Consumer of RabbitMQ
 * @param {string} service - String to rpc server name
 * @param {Record<string, unknown>} exposedServices - The exposed functions to be called
 * @param {MessageQueue} config - The message queue connection configuration
 */
export default function startRpcServer(
  service: string,
  exposedServices: Record<string, any>,
  props: any,
) {
  const { connection } = props;
  return connection.createChannel()
    .then((channel: Channel) => {
      channel.assertQueue(service, { durable: false });
      channel.prefetch(1);
      return startConsuming({
        channel,
        queueName: service,
        handlers: exposedServices,
      });
    });
}
