enum LogLevelRanking {
  error,
  warn,
  info,
  debug,
  verbose,
}

export type LogLevel = keyof typeof LogLevelRanking;

export const shouldLogLineBeIgnored = (
  requestedLevel: LogLevel,
  configuredLevel: string,
): boolean => {
  const configuredLevelRank = LogLevelRanking[configuredLevel as LogLevel] ?? LogLevelRanking.debug;
  const requestedLevelRank = LogLevelRanking[requestedLevel];
  return requestedLevelRank > configuredLevelRank;
};

type Payload = Record<string, unknown>;

export type Logger = (level: LogLevel, message: string, payload?: Payload, timestamp?: Date) => void;
