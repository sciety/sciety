import { Serializer } from './serializer';
import { Level } from './types';
import { Logger, LoggerLevelName } from '../../shared-ports';

export const streamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
  logLevelName: string,
): Logger => {
  const configuredLevel = Level[logLevelName as LoggerLevelName] ?? Level.debug;
  return (level, message, payload = {}, date = new Date()) => {
    if (Level[level] > configuredLevel) {
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
