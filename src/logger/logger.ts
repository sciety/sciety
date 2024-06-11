import { LogLevel } from '../shared-ports/log-level';

type Payload = Record<string, unknown>;

export type Logger = (level: LogLevel, message: string, payload?: Payload, timestamp?: Date) => void;
