import { arbitraryDate, arbitraryString } from '../../../helpers';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const arbitraryDocmapReviewAction = () => ({
  participants: [{
    actor: {
      type: 'person',
      name: arbitraryString(),
    },
    role: 'author',
  }],
  outputs: [{
    doi: arbitraryString(),
    published: arbitraryDate().toISOString(),
    type: 'editorial-decision',
  }],
  inputs: [{
    doi: arbitraryString(),
    published: arbitraryDate().toISOString(),
    type: 'preprint',
  }],
});

type DocmapReviewAction = ReturnType<typeof arbitraryDocmapReviewAction>;

export const constructDocmapArrayWithReviewActions = (
  docmapReviewActions: ReadonlyArray<DocmapReviewAction>,
): JSON => ([
  {
    type: 'docmap',
    id: 'https://neuro.peercommunityin.org/metadata/recommendation?article_id=217',
    publisher: {
      name: 'Peer Community in Neuroscience',
      url: 'https://neuro.peercommunityin.org/about/',
    },
    created: '2025-09-09T15:54:13',
    updated: '2025-09-09T15:54:13',
    'first-step': '_:b0',
    steps: {
      '_:b0': {
        inputs: [],
        actions: [
          {
            participants: [
              {
                actor: {
                  type: 'person',
                  name: 'Theo Desachy',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Marc Thevenet',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Samuel Garcia',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Anistasha Lightning',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Anne Didier',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Nathalie Mandairon',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Nicola Kuczewski',
                },
                role: 'author',
              },
            ],
            outputs: [
              {
                published: '2024-07-30T11:52:23',
                doi: 'https://doi.org/10.1101/2024.07.25.605060',
                type: 'preprint',
              },
            ],
            inputs: [],
          },
        ],
        assertions: [
          {
            status: 'catalogued',
            item: 'https://doi.org/10.1101/2024.07.25.605060',
          },
        ],
        'next-step': '_:b1',
      },
      '_:b1': {
        actions: docmapReviewActions,
        assertions: [
          {
            status: 'reviewed',
            item: 'https://doi.org/10.1101/2024.07.25.605060',
          },
        ],
        inputs: [],
        'previous-step': '_:b0',
        'next-step': '_:b2',
      },
      '_:b10': {
        inputs: [
          {
            published: '2025-08-28T09:30:49',
            doi: 'https://doi.org/10.1101/2024.07.25.605060',
            type: 'preprint',
          },
        ],
        actions: [
          {
            participants: [
              {
                actor: {
                  type: 'person',
                  name: 'Theo Desachy',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Marc Thevenet',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Samuel Garcia',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Anistasha Lightning',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Anne Didier',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Nathalie Mandairon',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Nicola Kuczewski',
                },
                role: 'author',
              },
            ],
            outputs: [
              {
                published: '2025-10-23T00:00:00',
                doi: 'https://doi.org/10.24072/pcjournal.636',
                type: 'journal-article',
              },
            ],
            inputs: [],
          },
        ],
        assertions: [
          {
            status: 'published',
            item: 'https://doi.org/10.24072/pcjournal.636',
          },
        ],
        'previous-step': '_:b9',
      },
    },
    '@context': 'https://w3id.org/docmaps/context.jsonld',
  },
] as unknown) as JSON;

export const constructDocmapArrayWithTwoReviewActions = (
  [
    {
      actionOutputDoi,
      actionOutputDate,
      actionInputDoi,
    },
    secondReviewAction,
  ]: ReadonlyArray<{ actionOutputDoi: string, actionOutputDate: string, actionInputDoi: string }>,
): JSON => ([
  {
    type: 'docmap',
    id: 'https://neuro.peercommunityin.org/metadata/recommendation?article_id=217',
    publisher: {
      name: 'Peer Community in Neuroscience',
      url: 'https://neuro.peercommunityin.org/about/',
    },
    created: '2025-09-09T15:54:13',
    updated: '2025-09-09T15:54:13',
    'first-step': '_:b0',
    steps: {
      '_:b0': {
        inputs: [],
        actions: [
          {
            participants: [
              {
                actor: {
                  type: 'person',
                  name: 'Theo Desachy',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Marc Thevenet',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Samuel Garcia',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Anistasha Lightning',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Anne Didier',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Nathalie Mandairon',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Nicola Kuczewski',
                },
                role: 'author',
              },
            ],
            outputs: [
              {
                published: '2024-07-30T11:52:23',
                doi: 'https://doi.org/10.1101/2024.07.25.605060',
                type: 'preprint',
              },
            ],
            inputs: [],
          },
        ],
        assertions: [
          {
            status: 'catalogued',
            item: 'https://doi.org/10.1101/2024.07.25.605060',
          },
        ],
        'next-step': '_:b1',
      },
      '_:b1': {
        actions: [
          {
            participants: [
              {
                actor: {
                  type: 'person',
                  name: 'Amanda Almacellas Barbanoj',
                },
                role: 'author',
              },
            ],
            outputs: [
              {
                published: actionOutputDate,
                doi: actionOutputDoi,
                type: 'editorial-decision',
              },
            ],
            inputs: [
              {
                published: '2024-07-30T11:52:23',
                doi: actionInputDoi,
                type: 'preprint',
              },
            ],
          },
          {
            participants: [
              {
                actor: {
                  type: 'person',
                  name: 'Georgie Mills',
                },
                role: 'author',
              },
            ],
            outputs: [
              {
                published: secondReviewAction.actionOutputDate,
                doi: secondReviewAction.actionOutputDoi,
                type: 'review',
              },
            ],
            inputs: [
              {
                published: '2024-07-30T11:52:23',
                doi: secondReviewAction.actionInputDoi,
                type: 'preprint',
              },
            ],
          },
        ],
        assertions: [
          {
            status: 'reviewed',
            item: 'https://doi.org/10.1101/2024.07.25.605060',
          },
        ],
        inputs: [],
        'previous-step': '_:b0',
        'next-step': '_:b2',
      },
    },
    '@context': 'https://w3id.org/docmaps/context.jsonld',
  },
] as unknown) as JSON;

export const constructDocmapArrayWithoutReviewAction = (): JSON => ([
  {
    type: 'docmap',
    id: 'https://neuro.peercommunityin.org/metadata/recommendation?article_id=217',
    publisher: {
      name: 'Peer Community in Neuroscience',
      url: 'https://neuro.peercommunityin.org/about/',
    },
    created: '2025-09-09T15:54:13',
    updated: '2025-09-09T15:54:13',
    'first-step': '_:b0',
    steps: {
      '_:b0': {
        inputs: [],
        actions: [
          {
            participants: [
              {
                actor: {
                  type: 'person',
                  name: 'Theo Desachy',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Marc Thevenet',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Samuel Garcia',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Anistasha Lightning',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Anne Didier',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Nathalie Mandairon',
                },
                role: 'author',
              },
              {
                actor: {
                  type: 'person',
                  name: 'Nicola Kuczewski',
                },
                role: 'author',
              },
            ],
            outputs: [
              {
                published: '2024-07-30T11:52:23',
                doi: 'https://doi.org/10.1101/2024.07.25.605060',
                type: 'preprint',
              },
            ],
            inputs: [],
          },
        ],
        assertions: [
          {
            status: 'catalogued',
            item: 'https://doi.org/10.1101/2024.07.25.605060',
          },
        ],
      },
    },
    '@context': 'https://w3id.org/docmaps/context.jsonld',
  },
] as unknown) as JSON;
