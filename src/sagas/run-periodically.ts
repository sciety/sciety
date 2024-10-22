export type Saga = () => Promise<void>;

export const runPeriodically = (saga: Saga, seconds: number): void => {
  console.log(new Error());
  setTimeout(async () => saga()
    .then(() => runPeriodically(saga, seconds))
    .catch(() => console.log('Saga promise rejected')), seconds * 1000);
};
