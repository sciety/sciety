import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2021.06.21.449261/elife.docmap.json',
  type: 'docmap',
  created: '2023-02-02T18:50:04.909Z',
  updated: '2023-02-02T18:50:05.560Z',
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
          doi: '10.1101/2021.06.21.449261',
          url: 'https://doi.org/10.1101/2021.06.21.449261',
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
              published: '2023-02-02T18:41:20.975Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/L9hJrKMpEe2jRKfv_TBezA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.06.21.449261#hypothesis:L9hJrKMpEe2jRKfv_TBezA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:L9hJrKMpEe2jRKfv_TBezA/content',
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
              published: '2023-02-02T18:41:21.967Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/MG76yKMpEe23zSMk_GMVjQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.06.21.449261#hypothesis:MG76yKMpEe23zSMk_GMVjQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:MG76yKMpEe23zSMk_GMVjQ/content',
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
              published: '2023-02-02T18:41:22.966Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/MQYzmKMpEe2MWKfCq02Spw',
                },
                {
                  type: 'web-page',

                  url: 'https://sciety.org/articles/activity/10.1101/2021.06.21.449261#hypothesis:MQYzmKMpEe2MWKfCq02Spw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:MQYzmKMpEe2MWKfCq02Spw/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
