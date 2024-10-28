import { Logger } from '../logger';

export type Saga = () => Promise<void>;

export const runPeriodically = (logger: Logger, saga: Saga, seconds: number): void => {
  setTimeout(
    async () => saga()
      .then(() => runPeriodically(logger, saga, seconds))
      .catch((reason) => {
        logger('error', 'Saga execution failed catastrophically and will not be scheduled to run again', { reason });
      }),
    seconds * 1000,
  );
};
