import { randomUUID } from 'crypto';
import type { Connection, Channel } from './types';

const decodeResult = (content: any) => {
  const { result } = JSON.parse(content);
  return result;
};

const consume = (props: any, procedure: string, ...params: any[]) => {
  const { channel, queue, service } = props;
  const correlationId = randomUUID();
  let hasReceived = false;

  return new Promise((resolve, reject) => {
    channel.consume(queue.queue, (message: any) => {
      if (message.properties.correlationId === correlationId) {
        hasReceived = true;
        const result = decodeResult(message.content.toString());
        try {
          if (!(result || false)) return resolve(result);
          const { error = false } = result;
          if (error) return reject(result);
          return resolve(result);
        } catch {
          return resolve(result);
        } finally {
          channel.close();
        }
      }
    }, { noAck: true });

    setTimeout(() => {
      if (!hasReceived) {
        if (channel || false) channel.close();
        reject(new Error(`- [rpc-client] Request to ${service} timeout`));
      }
    }, 1000 * 5);

    const data = JSON.stringify({ procedure, params });
    channel.sendToQueue(service, Buffer.from(data), {
      correlationId,
      replyTo: queue.queue,
    });
  });
};

const initRequest = (props: any, procedure: string, ...params: any[]) => {
  const { connection, service }: { connection: Connection, service: string } = props;
  return connection.createChannel()
    .then((channel: Channel) => {
      return channel
        .assertQueue('', {
          exclusive: true,
          autoDelete: true,
        })
        .then((queue: any) => {
          const consumeProps = { channel, service, queue };
          return consume(consumeProps, procedure, ...params);
        });
    });
};

/**
 * Initialize the rpc client and ready to be called to call
 * server procedure
 * @param {string} service - rpc server name to call to
 * @param {MessageQueue} props - The Message Queue connection configuration
 * @return {makeRequest} callback - The make request callback
 */
export default function initRpcClient(service: string, props: any) {
  const { connection }: { connection: Connection } = props;
  return (procedure: string, ...params: any[]) => {
    const reqProps = { connection, service };
    return initRequest(reqProps, procedure, ...params);
  };
}
