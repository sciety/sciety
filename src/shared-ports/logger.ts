enum Level {
  error,
  warn,
  info,
  debug,
}
export type LevelName = keyof typeof Level;

type Payload = Record<string, unknown>;

export type Logger = (level: LevelName, message: string, payload?: Payload, timestamp?: Date) => void;
