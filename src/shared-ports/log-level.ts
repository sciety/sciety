enum LogLevelRanking {
  verbose,
  debug,
  info,
  warn,
  error,
}

export type LogLevel = keyof typeof LogLevelRanking;

export const defaultLogLevel: LogLevel = 'verbose';

export const shouldBeLogged = (
  requestedLevel: LogLevel,
  configuredLevel: string,
): boolean => {
  const configuredLevelRank = LogLevelRanking[configuredLevel as LogLevel] ?? LogLevelRanking.debug;
  const requestedLevelRank = LogLevelRanking[requestedLevel];
  return requestedLevelRank >= configuredLevelRank;
};
