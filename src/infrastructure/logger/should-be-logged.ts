import { LogLevel, LogLevelRanking } from '../../shared-ports/log-level';

export const shouldBeLogged = (
  requestedLevel: LogLevel,
  configuredLevel: string,
): boolean => {
  const configuredLevelRank = LogLevelRanking[configuredLevel as LogLevel] ?? LogLevelRanking.debug;
  const requestedLevelRank = LogLevelRanking[requestedLevel];
  return requestedLevelRank >= configuredLevelRank;
};
