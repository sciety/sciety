type Output = {
  type: 'review-article',
  published: string,
  content: ReadonlyArray<unknown>,
};

type Action = {
  participants: ReadonlyArray<unknown>,
  outputs: ReadonlyArray<Output>,
};

type Step = {
  assertions: [],
  inputs: ReadonlyArray<unknown>,
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
  '@context': Record<string, unknown>,
  id: string,
  type: 'docmap',
  created: string,
  updated: string,
  publisher: Publisher,
  'first-step': '_:b0',
  steps: Record<string, Step>,
};
