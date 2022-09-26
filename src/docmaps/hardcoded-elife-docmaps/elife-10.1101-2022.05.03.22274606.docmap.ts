import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.05.03.22274606/elife.docmap.json',
  type: 'docmap',
  created: '2022-06-16T10:00:19.771Z',
  updated: '2022-06-16T10:00:39.754Z',
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
          doi: '10.1101/2022.05.03.22274606',
          url: 'https://doi.org/10.1101/2022.05.03.22274606',
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
              published: '2022-06-16T09:54:34.419Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/U3Fozu1aEeyw5AvPqvUo4A',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.05.03.22274606#hypothesis:U3Fozu1aEeyw5AvPqvUo4A',
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
              published: '2022-06-16T09:54:35.419Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/VAkb4u1aEeyVx6dnBdrXbw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.05.03.22274606#hypothesis:VAkb4u1aEeyVx6dnBdrXbw',
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
              published: '2022-06-16T09:54:36.426Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/VKIm8u1aEey_BRspTFsU-Q',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.05.03.22274606#hypothesis:VKIm8u1aEey_BRspTFsU-Q',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
