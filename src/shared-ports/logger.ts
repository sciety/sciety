export enum Level {
  error,
  warn,
  info,
  debug,
  verbose,
}
export type LevelName = keyof typeof Level;

type Payload = Record<string, unknown>;

export type Logger = (level: LevelName, message: string, payload?: Payload, timestamp?: Date) => void;
