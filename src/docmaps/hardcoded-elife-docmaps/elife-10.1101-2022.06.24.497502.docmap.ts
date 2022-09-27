import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.06.24.497502/elife.docmap.json',
  type: 'docmap',
  created: '2022-09-06T09:10:16.834Z',
  updated: '2022-09-06T09:10:20.344Z',
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
          doi: '10.1101/2022.06.24.497502',
          url: 'https://doi.org/10.1101/2022.06.24.497502',
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
              published: '2022-09-06T09:08:49.725Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/hVq6MC3DEe2ERdPL5ARqAA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.06.24.497502#hypothesis:hVq6MC3DEe2ERdPL5ARqAA',
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
              published: '2022-09-06T09:08:50.896Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/hgzitC3DEe2SBN9NIUxw5A',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.06.24.497502#hypothesis:hgzitC3DEe2SBN9NIUxw5A',
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
              published: '2022-09-06T09:08:51.479Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/hmP-bi3DEe2C9QtcFZcxmQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.06.24.497502#hypothesis:hmP-bi3DEe2C9QtcFZcxmQ',
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
              published: '2022-09-06T09:08:52.030Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/hrlVWC3DEe2hhdsGW6wNvg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.06.24.497502#hypothesis:hrlVWC3DEe2hhdsGW6wNvg',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
