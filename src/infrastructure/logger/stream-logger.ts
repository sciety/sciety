import { Serializer } from './serializer';
import { Logger, LoggerLevelName, LoggerLevel } from '../../shared-ports';

export const streamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
  configuredLogLevelName: string,
): Logger => {
  const configuredLogLevel = LoggerLevel[configuredLogLevelName as LoggerLevelName] ?? LoggerLevel.debug;
  return (requestedLogLevel, message, payload = {}, date = new Date()) => {
    if (LoggerLevel[requestedLogLevel] > configuredLogLevel) {
      return;
    }
    const entry = {
      timestamp: date,
      level: requestedLogLevel,
      message,
      payload,
    };

    stream.write(`${serializer(entry)}\n`);
  };
};
