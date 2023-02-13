import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.11.25.517922/elife.docmap.json',
  type: 'docmap',
  created: '2023-02-10T11:40:10.967Z',
  updated: '2023-02-10T11:40:11.353Z',
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
          doi: '10.1101/2022.11.25.517922',
          url: 'https://doi.org/10.1101/2022.11.25.517922',
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
              published: '2023-02-10T11:38:32.922Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/cpt6XKk3Ee2E41vSKhaQ3Q',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.25.517922#hypothesis:cpt6XKk3Ee2E41vSKhaQ3Q',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:cpt6XKk3Ee2E41vSKhaQ3Q/content',
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
              published: '2023-02-10T11:38:33.718Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/cxPRZKk3Ee28lmeLUBLxLg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.25.517922#hypothesis:cxPRZKk3Ee28lmeLUBLxLg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:cxPRZKk3Ee28lmeLUBLxLg/content',
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
              published: '2023-02-10T11:38:34.008Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/c0E6ZKk3Ee2q9Csl15dC0Q',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.25.517922#hypothesis:c0E6ZKk3Ee2q9Csl15dC0Q',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:c0E6ZKk3Ee2q9Csl15dC0Q/content',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: {
                name: 'Dominique C Bergmann',
                type: 'person',
                _relatesToOrganization: 'Stanford University, United States',
              },
              role: 'editor',
            },
            {
              actor: {
                name: 'Jürgen Kleine-Vehn',
                type: 'person',
                _relatesToOrganization: 'University of Freiburg, Germany',
              },
              role: 'senior-editor',
            }],
          outputs: [
            {
              type: 'evaluation-summary',
              published: '2023-02-10T11:38:34.788Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/c7bbFqk3Ee2s_-9AE1xA1g',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.11.25.517922#hypothesis:c7bbFqk3Ee2s_-9AE1xA1g',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:c7bbFqk3Ee2s_-9AE1xA1g/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
