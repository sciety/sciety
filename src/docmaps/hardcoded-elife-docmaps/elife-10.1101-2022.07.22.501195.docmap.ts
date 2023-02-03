import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.07.22.501195/elife.docmap.json',
  type: 'docmap',
  created: '2023-02-02T18:50:05.886Z',
  updated: '2023-02-02T18:50:06.571Z',
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
          doi: '10.1101/2022.07.22.501195',
          url: 'https://doi.org/10.1101/2022.07.22.501195',
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
              published: '2023-02-02T18:48:24.643Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/LFyoxqMqEe2Vlytcptfabg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.22.501195#hypothesis:LFyoxqMqEe2Vlytcptfabg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:LFyoxqMqEe2Vlytcptfabg/content',
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
              published: '2023-02-02T18:48:25.639Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/LPRhtqMqEe2Cyz-uOr_Dcg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.22.501195#hypothesis:LPRhtqMqEe2Cyz-uOr_Dcg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:LPRhtqMqEe2Cyz-uOr_Dcg/content',
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
              published: '2023-02-02T18:48:26.639Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/LYx26qMqEe2KCstepCRuHA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.07.22.501195#hypothesis:LYx26qMqEe2KCstepCRuHA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:LYx26qMqEe2KCstepCRuHA/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
