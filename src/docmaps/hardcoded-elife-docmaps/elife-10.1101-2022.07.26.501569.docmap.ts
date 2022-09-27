import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.07.26.501569/elife.docmap.json',
  type: 'docmap',
  created: '2022-09-05T11:50:28.318Z',
  updated: '2022-09-05T11:50:30.796Z',
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
          doi: '10.1101/2022.07.26.501569',
          url: 'https://doi.org/10.1101/2022.07.26.501569',
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
              published: '2022-09-05T11:41:57.630Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/v1peZi0PEe29S8NgoiFIuQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.26.501569#hypothesis:v1peZi0PEe29S8NgoiFIuQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/static/docmaps/elife-10.1101-2022.07.26.501569/review-two.html',
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
              published: '2022-09-05T11:41:58.635Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/v_N3wi0PEe2NQGss06cygw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.26.501569#hypothesis:v_N3wi0PEe2NQGss06cygw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/static/docmaps/elife-10.1101-2022.07.26.501569/review-one.html',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: {
                name: 'Peter Tontonoz',
                type: 'person',
                _relatesToOrganization: 'University of California, Los Angeles, United States',
              },
              role: 'editor',
            },
            {
              actor: {
                name: 'Carlos Isales',
                type: 'person',
                _relatesToOrganization: 'Medical College of Georgia at Augusta University, United States',
              },
              role: 'senior-editor',
            },
          ],
          outputs: [
            {
              type: 'evaluation-summary',
              published: '2022-09-05T11:41:59.635Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/wIvOvi0PEe29TMvGGAp6Jw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.26.501569#hypothesis:wIvOvi0PEe29TMvGGAp6Jw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/static/docmaps/elife-10.1101-2022.07.26.501569/evaluation-summary.html',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
