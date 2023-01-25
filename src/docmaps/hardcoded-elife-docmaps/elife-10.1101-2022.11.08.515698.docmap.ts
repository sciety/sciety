import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.11.08.515698/elife.docmap.json',
  type: 'docmap',
  created: '2023-01-23T14:40:09.934Z',
  updated: '2023-01-23T14:40:10.876Z',
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
          doi: '10.1101/2022.11.08.515698',
          url: 'https://doi.org/10.1101/2022.11.08.515698',
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
              published: '2023-01-23T14:34:42.571Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/EzFzxJsrEe28DyfQK4aPhg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.08.515698#hypothesis:EzFzxJsrEe28DyfQK4aPhg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:EzFzxJsrEe28DyfQK4aPhg/content',
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
              published: '2023-01-23T14:34:43.676Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/E9MOvpsrEe2w6nds1t6xxQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.08.515698#hypothesis:E9MOvpsrEe2w6nds1t6xxQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:E9MOvpsrEe2w6nds1t6xxQ/content',
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
              published: '2023-01-23T14:34:44.369Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/FD5EmpsrEe28RaOWOszMEw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.08.515698#hypothesis:FD5EmpsrEe28RaOWOszMEw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:FD5EmpsrEe28RaOWOszMEw/content',
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
              published: '2023-01-23T14:34:45.299Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/FMwbnpsrEe2mVPtbQf2X2w',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.08.515698#hypothesis:FMwbnpsrEe2mVPtbQf2X2w',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:FMwbnpsrEe2mVPtbQf2X2w/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
