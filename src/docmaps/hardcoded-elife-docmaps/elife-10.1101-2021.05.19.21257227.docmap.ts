import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2021.05.19.21257227/elife.docmap.json',
  type: 'docmap',
  created: '2021-11-19T09:18:06.000Z',
  updated: '2021-11-19T09:18:06.000Z',
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
          doi: '10.1101/2021.05.19.21257227',
          url: 'https://doi.org/10.1101/2021.05.19.21257227',
        },
      ],
      actions: [
        {
          participants: [
            {
              actor: {
                name: 'anonymous',
                type: 'person',
              },
              role: 'peer-reviewer',
            },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2021-11-18T17:19:50.666Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/vPCd6kiTEeyqf48M8Cq4kg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.05.19.21257227#hypothesis:vPCd6kiTEeyqf48M8Cq4kg',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: {
                name: 'anonymous',
                type: 'person',
              },
              role: 'peer-reviewer',
            },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2021-11-18T16:46:40.242Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/Gm0NHkiPEeyvu98D8OEzHg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.05.19.21257227#hypothesis:Gm0NHkiPEeyvu98D8OEzHg',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: {
                name: 'anonymous',
                type: 'person',
              },
              role: 'peer-reviewer',
            },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2021-11-18T16:46:39.465Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/GfqkNkiPEey-Gz-ai7bPaA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.05.19.21257227#hypothesis:GfqkNkiPEey-Gz-ai7bPaA',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: {
                name: 'anonymous',
                type: 'person',
              },
              role: 'peer-reviewer',
            },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2021-11-18T16:46:41.238Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/GwVEqEiPEeyzwSuNMvy3qQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.05.19.21257227#hypothesis:GwVEqEiPEeyzwSuNMvy3qQ',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
