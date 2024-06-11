export enum LogLevelRanking {
  verbose,
  debug,
  info,
  warn,
  error,
}

export type LogLevel = keyof typeof LogLevelRanking;

export const defaultLogLevel: LogLevel = 'verbose';
