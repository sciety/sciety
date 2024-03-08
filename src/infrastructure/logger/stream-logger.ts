import { Serializer } from './serializer';
import { Logger, LoggerLevelName, LoggerLevel } from '../../shared-ports';
import { LevelName } from '../../shared-ports/logger';

const shouldLogLineBeIgnored = (
  requestedLogLevelName: LevelName,
  configuredLogLevel: LoggerLevel,
) => LoggerLevel[requestedLogLevelName] > configuredLogLevel;

export const streamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
  configuredLogLevelName: string,
): Logger => {
  const configuredLogLevel = LoggerLevel[configuredLogLevelName as LoggerLevelName] ?? LoggerLevel.debug;
  return (requestedLogLevelName, message, payload = {}, date = new Date()) => {
    if (shouldLogLineBeIgnored(requestedLogLevelName, configuredLogLevel)) {
      return;
    }
    const entry = {
      timestamp: date,
      level: requestedLogLevelName,
      message,
      payload,
    };

    stream.write(`${serializer(entry)}\n`);
  };
};
