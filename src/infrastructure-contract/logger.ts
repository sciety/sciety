import { LogLevel } from './log-level';

type Payload = Record<string, unknown>;

export type Logger = (level: LogLevel, message: string, payload?: Payload, timestamp?: Date) => void;
