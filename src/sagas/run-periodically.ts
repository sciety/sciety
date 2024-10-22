export type Saga = () => Promise<void>;

type SagaTimer = {
  cancel: () => void,
};

export const runPeriodically = (saga: Saga, seconds: number): SagaTimer => {
  setInterval(saga, seconds * 1000);
  return {
    cancel: () => {},
  };
};
