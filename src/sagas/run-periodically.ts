import { Logger } from '../logger';

export type Saga = () => Promise<void>;

export const runPeriodically = (logger: Logger, saga: Saga, seconds: number): void => {
  setInterval(saga, seconds * 1000);
};
