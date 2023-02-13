import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.10.17.512253/elife.docmap.json',
  type: 'docmap',
  created: '2023-02-09T16:40:08.152Z',
  updated: '2023-02-09T16:40:08.555Z',
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
          doi: '10.1101/2022.10.17.512253',
          url: 'https://doi.org/10.1101/2022.10.17.512253',
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
              published: '2023-02-09T16:36:07.240Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/2jRPwqiXEe2WiaPpkX9z0A',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.10.17.512253#hypothesis:2jRPwqiXEe2WiaPpkX9z0A',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:2jRPwqiXEe2WiaPpkX9z0A/content',
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
              published: '2023-02-09T16:36:08.237Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/2ssR5qiXEe2eBA-GlPB-OA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.10.17.512253#hypothesis:2ssR5qiXEe2eBA-GlPB-OA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:2ssR5qiXEe2eBA-GlPB-OA/content',
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
              published: '2023-02-09T16:36:09.046Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/20aozqiXEe2cFHOdrUiwoQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.10.17.512253#hypothesis:20aozqiXEe2cFHOdrUiwoQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:20aozqiXEe2cFHOdrUiwoQ/content',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: {
                name: 'Michael B Eisen',
                type: 'person',
                _relatesToOrganization: 'University of California, Berkeley, United States',
              },
              role: 'editor',
            },
            {
              actor: {
                name: 'Michael B Eisen',
                type: 'person',
                _relatesToOrganization: 'University of California, Berkeley, United States',
              },
              role: 'senior-editor',
            },
          ],
          outputs: [
            {
              type: 'evaluation-summary',
              published: '2023-02-09T16:36:09.857Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/28TBAKiXEe2gLa-4_Zmg3Q',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.10.17.512253#hypothesis:28TBAKiXEe2gLa-4_Zmg3Q',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:28TBAKiXEe2gLa-4_Zmg3Q/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
