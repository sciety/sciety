import { Serializer } from './serializer';
import { Logger, LoggerLevelName, LoggerLevel } from '../../shared-ports';

export const streamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
  desiredLogLevelName: string,
): Logger => {
  const desiredLogLevel = LoggerLevel[desiredLogLevelName as LoggerLevelName] ?? LoggerLevel.debug;
  return (level, message, payload = {}, date = new Date()) => {
    if (LoggerLevel[level] > desiredLogLevel) {
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
