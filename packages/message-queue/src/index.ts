import {
  type Connection,
  type Channel,
  connect as mqConnect,
} from 'amqplib';

export { Connection, Channel } from 'amqplib';

export type MessageQueue = {
  host: string;
  port: string | number;
  user: string;
  password: string;
};

export type Options = {
  retryInterval?: number; // Interval to make another retry
  maxRetry?: number; // How many retry will perforam
  singleTone?: boolean; // Use only one connection for all

  onConnect: any;
  onRetry?: any;
  onClose?: any;
};

let singletonConn: Connection;

/**
 * Get the connection string from configruation
 * @param {MessageQueue} connection - The message queue connection
 * @param props
 * @return string - String to Message Queue
 */
const getConnectionString = (connection: MessageQueue): string => {
  const {
    host,
    port,
    user,
    password,
  } = connection;
  return `amqp://${user}:${password}@${host}:${port}`;
};

/**
 * Connect to message queue
 * @param {MessageQueue} props
 * @param {Options} options
 * @return Connection
 */
function connectToMQ(props: MessageQueue, options: Options) {
  const strCon: string = getConnectionString(props);
  return mqConnect(strCon)
    .then((conn: Connection) => {
      singletonConn = conn;
      singletonConn.on('error', onError.bind(null, { props, options }));
      singletonConn.on('close', onClose.bind(null, { props, options }));
      const { onConnect } = options;
      return onConnect(singletonConn);
    });
}

/**
 * Retries connect to rabbitmq again and again untill a specific max retry.
 * The interval of retrying is defined in the options parameter,
 * @param {MessageQueue} props
 * @param {Options} options
 */
const retry = (props: MessageQueue, options: Options, count: number = 1) => {
  const { maxRetry = 0 } = options;
  if (maxRetry > 0 && count >= maxRetry) {
    console.log('- Give up connection retrying...');
    return false;
  }

  const { retryInterval = 5000 } = options;
  const timer = setTimeout(() => {
    clearTimeout(timer);
    console.log('- MQ retrying connect to server...');
    return connectToMQ(props, options).catch(() => {
      retry(props, options, count + 1);
    });
  }, retryInterval);
};

type BindedProps = {
  props: MessageQueue,
  options: Options,
};

/**
 * Handle event on the error event
 * @param {BindedProps } bindedProps
 * @param {Error} error
 */
const onError = (pProps: BindedProps, error: any) => {
  const { props, options } = pProps;
  console.error('- MQ: Connect error...');
  console.error({ error });
  return retry(props, options);
};

const onClose = (bindedProps: BindedProps, error: any) => {
  const { props, options } = bindedProps;
  console.error('- MQ: Connection closed unexpectedly.');
  console.error({ error });

  return retry(props, options);
};

export default function connect(props: MessageQueue, options: Options): any {
  if (singletonConn || false) return Promise.resolve(singletonConn);
  return connectToMQ(props, options);
}
