import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2021.05.10.443380/elife.docmap.json',
  type: 'docmap',
  created: '2021-07-07T14:55:39.000Z',
  updated: '2021-08-24T09:12:49.000Z',
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
          doi: '10.1101/2021.05.10.443380',
          url: 'https://doi.org/10.1101/2021.05.10.443380',
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
              type: 'evaluation-summary',
              published: '2021-07-06T16:39:49.085Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/x5gx1N54Eeu_iu-vbOlr9A',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.05.10.443380#hypothesis:x5gx1N54Eeu_iu-vbOlr9A',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/static/docmaps/elife-10.1101-2021.05.10.443380/evaluation-summary.html',
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
              published: '2021-07-06T16:39:47.602Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/xrhmnt54Eeu-NjulzcQ95w',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.05.10.443380#hypothesis:xrhmnt54Eeu-NjulzcQ95w',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/static/docmaps/elife-10.1101-2021.05.10.443380/review-two.html',
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
              published: '2021-07-06T16:39:48.082Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/xv86nN54EeuK_b84VxyU7w',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.05.10.443380#hypothesis:xv86nN54EeuK_b84VxyU7w',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/static/docmaps/elife-10.1101-2021.05.10.443380/review-one.html',
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
              type: 'reply',
              published: '2021-08-23T10:50:57.035Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/_wgndgP_Eeyv0ssINx0nsw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.05.10.443380#hypothesis:_wgndgP_Eeyv0ssINx0nsw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/static/docmaps/elife-10.1101-2021.05.10.443380/reply.html',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
