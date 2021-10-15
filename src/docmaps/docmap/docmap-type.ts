type Output = {
  type: 'review-article',
  published: string,
  content: ReadonlyArray<unknown>,
};

type Action = {
  participants: ReadonlyArray<unknown>,
  outputs: ReadonlyArray<Output>,
};

type Input = {
  doi: string,
  url: string,
  published?: string,
};

type Step = {
  assertions: [],
  inputs: ReadonlyArray<Input>,
  actions: ReadonlyArray<Action>,
};

type Publisher = {
  id: string,
  name: string,
  logo: string,
  homepage: string,
  account: {
    id: string,
    service: 'https://sciety.org',
  },
};

export type Docmap = {
  '@context': string,
  id: string,
  type: 'docmap',
  created: string,
  updated: string,
  publisher: Publisher,
  'first-step': '_:b0',
  steps: Record<string, Step>,
};
