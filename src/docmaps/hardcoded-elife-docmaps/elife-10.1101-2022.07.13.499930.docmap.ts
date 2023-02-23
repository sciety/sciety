import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.07.13.499930/elife.docmap.json',
  type: 'docmap',
  created: '2023-02-10T11:00:09.897Z',
  updated: '2023-02-10T11:00:10.182Z',
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
          doi: '10.1101/2022.07.13.499930',
          url: 'https://doi.org/10.1101/2022.07.13.499930',
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
              type: 'reply',
              published: '2023-02-10T10:57:35.340Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/ucWbjqkxEe2_dU90gXJHiQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.13.499930#hypothesis:ucWbjqkxEe2_dU90gXJHiQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:ucWbjqkxEe2_dU90gXJHiQ/content',
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
              published: '2023-02-10T10:57:36.144Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/ukDDIqkxEe2u3pOiYV2OSQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.13.499930#hypothesis:ukDDIqkxEe2u3pOiYV2OSQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:ukDDIqkxEe2u3pOiYV2OSQ/content',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: { name: 'Michael B Eisen', type: 'person', _relatesToOrganization: 'University of California, Berkeley, United States' },
              role: 'senior-editor',
            },
            {
              actor: { name: 'Michael B Eisen', type: 'person', _relatesToOrganization: 'University of California, Berkeley, United States' },
              role: 'editor',
            },
          ],
          outputs: [
            {
              type: 'evaluation-summary',
              published: '2023-02-10T10:57:36.451Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/um8T2qkxEe2djlfl3gmTIw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.13.499930#hypothesis:um8T2qkxEe2djlfl3gmTIw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:um8T2qkxEe2djlfl3gmTIw/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
