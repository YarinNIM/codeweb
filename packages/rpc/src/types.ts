export type MessageQueue = {
  host: string;
  port: string | number;
  user: string;
  password: string;
  retryInterval?: number;
};

export {
  Connection,
  Channel,
} from 'amqplib';
