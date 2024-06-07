import { v4 } from 'uuid';

type LevelName = 'error' | 'warn' | 'info' | 'debug';

const correlationId = v4();

export const report = (level: LevelName, message: string) => (payload: Record<string, unknown>): void => {
  const thingToLog = {
    timestamp: new Date(),
    level,
    correlationId,
    message,
    payload,
  };
  process.stdout.write(`${JSON.stringify(thingToLog)}\n`);
};
