import { Serializer } from './serializer';
import { Logger, LoggerLevelName, LoggerLevel } from '../../shared-ports';

export const streamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
  logLevelName: string,
): Logger => {
  const configuredLevel = LoggerLevel[logLevelName as LoggerLevelName] ?? LoggerLevel.debug;
  return (level, message, payload = {}, date = new Date()) => {
    if (LoggerLevel[level] > configuredLevel) {
      return;
    }
    const entry = {
      timestamp: date,
      level,
      message,
      payload,
    };

    stream.write(`${serializer(entry)}\n`);
  };
};
