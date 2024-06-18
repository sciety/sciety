import { Serializer } from './serializer';
import { shouldBeLogged } from './should-be-logged';
import { Logger } from '../../logger';

export const streamLogger = (
  stream: NodeJS.WritableStream,
  serializer: Serializer,
  configuredLogLevelName: string,
): Logger => (requestedLogLevelName, message, payload = {}, date = new Date()) => {
  if (shouldBeLogged(requestedLogLevelName, configuredLogLevelName)) {
    const entry = {
      timestamp: date,
      level: requestedLogLevelName,
      message,
      payload,
    };

    stream.write(`${serializer(entry)}\n`);
  }
};
