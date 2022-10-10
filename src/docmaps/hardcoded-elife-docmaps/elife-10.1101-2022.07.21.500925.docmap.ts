import { Docmap } from '../docmap/docmap-type';

// ts-unused-exports:disable-next-line
export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.07.21.500925/elife.docmap.json',
  type: 'docmap',
  created: '2022-09-26T09:00:26.475Z',
  updated: '2022-09-26T09:00:29.848Z',
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
          doi: '10.1101/2022.07.21.500925',
          url: 'https://doi.org/10.1101/2022.07.21.500925',
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
              published: '2022-09-26T08:58:25.105Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/YU3UkD15Ee2PhG9WwCzvnA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.21.500925#hypothesis:YU3UkD15Ee2PhG9WwCzvnA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:YU3UkD15Ee2PhG9WwCzvnA/content',
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
              published: '2022-09-26T08:58:25.869Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/YcMyHD15Ee2jFm_XCdlfNw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.21.500925#hypothesis:YcMyHD15Ee2jFm_XCdlfNw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:YcMyHD15Ee2jFm_XCdlfNw/content',
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
              published: '2022-09-26T08:58:26.701Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/YkDJ8j15Ee2m73eUKskgsg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.21.500925#hypothesis:YkDJ8j15Ee2m73eUKskgsg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:YkDJ8j15Ee2m73eUKskgsg/content',
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
              type: 'evaluation-summary',
              published: '2022-09-26T08:58:27.701Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/YtlgGD15Ee2PhdPPZt3hVQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.21.500925#hypothesis:YtlgGD15Ee2PhdPPZt3hVQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:YtlgGD15Ee2PhdPPZt3hVQ/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
