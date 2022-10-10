import { Docmap } from '../docmap/docmap-type';

// ts-unused-exports:disable-next-line
export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.06.30.498369/elife.docmap.json',
  type: 'docmap',
  created: '2022-09-20T09:50:14.522Z',
  updated: '2022-09-20T09:50:15.074Z',
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
          doi: '10.1101/2022.06.30.498369',
          url: 'https://doi.org/10.1101/2022.06.30.498369',
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
              published: '2022-09-20T09:40:32.116Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/RQwETDjIEe2ne9s7CnzPmA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.06.30.498369#hypothesis:RQwETDjIEe2ne9s7CnzPmA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:RQwETDjIEe2ne9s7CnzPmA/content',
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
              published: '2022-09-20T09:40:33.119Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/RaRhYDjIEe2YJx-YyylD6A',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.06.30.498369#hypothesis:RaRhYDjIEe2YJx-YyylD6A',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:RaRhYDjIEe2YJx-YyylD6A/content',
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
              published: '2022-09-20T09:40:34.220Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/RksWLDjIEe2x-GujLxJUMg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.06.30.498369#hypothesis:RksWLDjIEe2x-GujLxJUMg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:RksWLDjIEe2x-GujLxJUMg/content',
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
              published: '2022-09-20T09:40:35.261Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/Ruti5DjIEe2VBOuQDx9FSg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.06.30.498369#hypothesis:Ruti5DjIEe2VBOuQDx9FSg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:Ruti5DjIEe2VBOuQDx9FSg/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
