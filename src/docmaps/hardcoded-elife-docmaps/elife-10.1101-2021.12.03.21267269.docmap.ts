import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2021.12.03.21267269/elife.docmap.json',
  type: 'docmap',
  created: '2022-06-20T15:30:18.982Z',
  updated: '2022-06-20T15:40:23.561Z',
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
          doi: '10.1101/2021.12.03.21267269',
          url: 'https://doi.org/10.1101/2021.12.03.21267269',
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
              published: '2022-06-20T15:25:36.506Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/O9KQwPCtEeykWX8BPwm_SQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.12.03.21267269#hypothesis:O9KQwPCtEeykWX8BPwm_SQ',
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
              published: '2022-06-20T15:25:37.642Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/PIAx5PCtEeyjAkdL08MHkQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.12.03.21267269#hypothesis:PIAx5PCtEeyjAkdL08MHkQ',
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
              published: '2022-06-20T15:25:38.732Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/PSY5DvCtEey2J6dW5Rjw8g',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.12.03.21267269#hypothesis:PSY5DvCtEey2J6dW5Rjw8g',
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
              published: '2022-06-20T15:25:39.193Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/PWs9zvCtEey5pK8lYi4vsg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.12.03.21267269#hypothesis:PWs9zvCtEey5pK8lYi4vsg',
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
              published: '2022-06-20T15:40:07.973Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/Q1-tJvCvEey5qo8BsZPR2Q',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.12.03.21267269#hypothesis:Q1-tJvCvEey5qo8BsZPR2Q',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
