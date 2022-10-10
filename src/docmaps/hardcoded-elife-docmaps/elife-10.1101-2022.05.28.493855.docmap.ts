import { Docmap } from '../docmap/docmap-type';

// ts-unused-exports:disable-next-line
export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.05.28.493855/elife.docmap.json',
  type: 'docmap',
  created: '2022-09-15T12:51:19.265Z',
  updated: '2022-09-15T12:51:20.649Z',
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
          doi: '10.1101/2022.05.28.493855',
          url: 'https://doi.org/10.1101/2022.05.28.493855',
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
              published: '2022-09-15T12:46:53.442Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/eZC6yDT0Ee2Fpt-5nN-oyw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.05.28.493855#hypothesis:eZC6yDT0Ee2Fpt-5nN-oyw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:eZC6yDT0Ee2Fpt-5nN-oyw/content',
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
              published: '2022-09-15T12:46:54.487Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/ejizLDT0Ee2GNXt5PPpGXQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.05.28.493855#hypothesis:ejizLDT0Ee2GNXt5PPpGXQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:ejizLDT0Ee2GNXt5PPpGXQ/content',
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
              published: '2022-09-15T12:46:55.962Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/exJFQjT0Ee2UOZ8C1s0q3Q',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.05.28.493855#hypothesis:exJFQjT0Ee2UOZ8C1s0q3Q',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:exJFQjT0Ee2UOZ8C1s0q3Q/content',
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
              published: '2022-09-15T12:46:57.084Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/e70k0DT0Ee21YEuL1gYRHQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.05.28.493855#hypothesis:e70k0DT0Ee21YEuL1gYRHQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:e70k0DT0Ee21YEuL1gYRHQ/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
