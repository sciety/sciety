import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.12.01.518662/elife.docmap.json',
  type: 'docmap',
  created: '2023-02-01T13:40:09.028Z',
  updated: '2023-02-01T13:40:09.644Z',
  publisher: {
    id: 'https://elifesciences.org/',
    name: 'eLife',
    logo: 'https://sciety.org/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png',
    homepage: 'https://elifesciences.org/',
    account: {
      id: 'https://sciety.org/groups/elife',
      service: 'https://sciety.org',
    },
  },
  'first-step': '_:b0',
  steps: {
    '_:b0': {
      assertions: [],
      inputs: [
        {
          doi: '10.1101/2022.12.01.518662',
          url: 'https://doi.org/10.1101/2022.12.01.518662',
        },
      ],
      actions: [
        {
          participants: [
            {
              actor: { name: 'anonymous', type: 'person' },
              role: 'peer-reviewer',
            },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2023-02-01T13:35:58.061Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/XCKQZqI1Ee2YKHcLqyLrxg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.12.01.518662#hypothesis:XCKQZqI1Ee2YKHcLqyLrxg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:XCKQZqI1Ee2YKHcLqyLrxg/content',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: { name: 'anonymous', type: 'person' },
              role: 'peer-reviewer',
            },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2023-02-01T13:35:58.947Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/XKQjTKI1Ee2fbHNVvquCoA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.12.01.518662#hypothesis:XKQjTKI1Ee2fbHNVvquCoA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:XKQjTKI1Ee2fbHNVvquCoA/content',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: { name: ' Michael B Eisen', type: 'person', _relatesToOrganization: ' University of California, Berkeley, United States' },
              role: 'editor',
            },
            {
              actor: { name: ' Michael B Eisen', type: 'person', _relatesToOrganization: ' University of California, Berkeley, United States' },
              role: 'senior-editor',
            },
          ],
          outputs: [
            {
              type: 'evaluation-summary',
              published: '2023-02-01T13:35:59.941Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/XTxUHqI1Ee2J70v3unDbBA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.12.01.518662#hypothesis:XTxUHqI1Ee2J70v3unDbBA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:XTxUHqI1Ee2J70v3unDbBA/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
