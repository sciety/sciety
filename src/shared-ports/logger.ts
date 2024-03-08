enum Level {
  error,
  warn,
  info,
  debug,
  verbose,
}

export type LevelName = keyof typeof Level;

export const shouldLogLineBeIgnored = (
  requestedLogLevelName: LevelName,
  configuredLogLevelName: string,
): boolean => {
  const configuredLogLevel = Level[configuredLogLevelName as LevelName] ?? Level.debug;
  return Level[requestedLogLevelName] > configuredLogLevel;
};

type Payload = Record<string, unknown>;

export type Logger = (level: LevelName, message: string, payload?: Payload, timestamp?: Date) => void;
