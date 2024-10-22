export type Saga = () => Promise<void>;

export const runPeriodically = (saga: Saga, seconds: number): void => {
  setInterval(saga, seconds * 1000);
};
