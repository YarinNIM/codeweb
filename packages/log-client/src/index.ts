type Env = 'development' | 'testing' | 'stagging' | 'production' | string;

export type LogClient = {
  connection: any;
  logExchange: string;
  appName: string;
  env: Env;
};

type Emit = (message: string | any) => void;

export type Logger = {
  info: Emit;
  warn: Emit;
  error: Emit;
};

const emit = (props: any, content: any) => {
  const {
    channel,
    logExchange,
    appName,
    env,
  } = props;
  const { message, severity } = content;
  const timestamp = new Date();
  const data = JSON.stringify({
    timestamp,
    message,
    appName,
    env,
  });

  return channel.publish(logExchange, severity, Buffer.from(data));
};

export default function initLogClient(props: LogClient): Promise<Logger> {
  const {
    connection,
    logExchange,
    appName,
    env,
  } = props;

  return connection.createChannel().then((channel: any) => {
    channel.assertExchange(logExchange, 'direct', { durable: false });
    return channel;
  }).then((channel: any) => {
    const emitProps = {
      channel,
      logExchange,
      appName,
      env,
    };
    return {
      info: (message: any) => emit(emitProps, { message, severity: 'info' }),
      warn: (message: any) => emit(emitProps, { message, severity: 'warn' }),
      error: (message: any) => emit(emitProps, { message, severity: 'error' }),
    };
  });
}
