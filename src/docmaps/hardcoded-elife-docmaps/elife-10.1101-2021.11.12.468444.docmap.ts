import { Docmap } from '../docmap/docmap-type';

// ts-unused-exports:disable-next-line
export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2021.11.12.468444/elife.docmap.json',
  type: 'docmap',
  created: '2022-09-29T11:40:59.249Z',
  updated: '2022-09-29T11:41:10.519Z',
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
          doi: '10.1101/2021.11.12.468444',
          url: 'https://doi.org/10.1101/2021.11.12.468444',
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
              published: '2022-09-29T11:33:10.713Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/fzURij_qEe2ObBvd9_JLSw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.11.12.468444#hypothesis:fzURij_qEe2ObBvd9_JLSw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:fzURij_qEe2ObBvd9_JLSw/content',
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
              published: '2022-09-29T11:33:11.561Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/f7OOrD_qEe2U-xNuBaMFFA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.11.12.468444#hypothesis:f7OOrD_qEe2U-xNuBaMFFA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:f7OOrD_qEe2U-xNuBaMFFA/content',
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
              published: '2022-09-29T11:33:12.325Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/gClS_j_qEe2oDNegBZSFpQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.11.12.468444#hypothesis:gClS_j_qEe2oDNegBZSFpQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:gClS_j_qEe2oDNegBZSFpQ/content',
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
              type: 'evaluation-summary',
              published: '2022-09-29T11:33:13.330Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/gMUfzD_qEe2QfFOGj8C7rw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2021.11.12.468444#hypothesis:gMUfzD_qEe2QfFOGj8C7rw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:gMUfzD_qEe2QfFOGj8C7rw/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
