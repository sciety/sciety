import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.11.01.514717/elife.docmap.json',
  type: 'docmap',
  created: '2023-02-09T17:00:08.670Z',
  updated: '2023-02-09T17:00:09.012Z',
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
          doi: '10.1101/2022.11.01.514717',
          url: 'https://doi.org/10.1101/2022.11.01.514717',
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
              published: '2023-02-09T16:54:45.564Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/dMYJtqiaEe2DswMh1rJ0jA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.01.514717#hypothesis:dMYJtqiaEe2DswMh1rJ0jA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:dMYJtqiaEe2DswMh1rJ0jA/content',
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
              published: '2023-02-09T16:54:46.572Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/dV-XcKiaEe2gfqNKBNYjVw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.01.514717#hypothesis:dV-XcKiaEe2gfqNKBNYjVw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:dV-XcKiaEe2gfqNKBNYjVw/content',
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
              published: '2023-02-09T16:54:47.425Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/deH_vKiaEe2d1PPdDlLdsw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.01.514717#hypothesis:deH_vKiaEe2d1PPdDlLdsw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:deH_vKiaEe2d1PPdDlLdsw/content',
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
            }],
          outputs: [
            {
              type: 'evaluation-summary',
              published: '2023-02-09T16:54:48.413Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/dnpp0qiaEe2Wqwdhmh-liA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.01.514717#hypothesis:dnpp0qiaEe2Wqwdhmh-liA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:dnpp0qiaEe2Wqwdhmh-liA/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },

};
