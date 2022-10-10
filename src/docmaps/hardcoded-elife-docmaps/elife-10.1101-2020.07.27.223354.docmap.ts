import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2020.07.27.223354/elife.docmap.json',
  type: 'docmap',
  created: '2022-09-09T12:50:17.890Z',
  updated: '2022-09-09T12:50:19.511Z',
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
          doi: '10.1101/2020.07.27.223354',
          url: 'https://doi.org/10.1101/2020.07.27.223354',
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
              published: '2022-09-09T12:43:53.377Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/D8Wu8jA9Ee24O7uTEeMHhQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2020.07.27.223354#hypothesis:D8Wu8jA9Ee24O7uTEeMHhQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:D8Wu8jA9Ee24O7uTEeMHhQ/content',
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
              published: '2022-09-09T12:43:54.228Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/EESPGjA9Ee2o1AsLhHFANg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2020.07.27.223354#hypothesis:EESPGjA9Ee2o1AsLhHFANg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:EESPGjA9Ee2o1AsLhHFANg/content',
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
              published: '2022-09-09T12:43:55.315Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/EOvO4jA9Ee20C084ZADXGA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2020.07.27.223354#hypothesis:EOvO4jA9Ee20C084ZADXGA',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:EOvO4jA9Ee20C084ZADXGA/content',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: {
                name: 'Tadatsugu Taniguchi',
                type: 'person',
                _relatesToOrganization: 'University of Tokyo, Japan',
              },
              role: 'senior-editor',
            },
            {
              actor: {
                name: 'Urszula Krzych',
                type: 'person',
                _relatesToOrganization: 'Walter Reed Army Institute of Research, United States',
              },
              role: 'editor',
            },
          ],
          outputs: [
            {
              type: 'evaluation-summary',
              published: '2022-09-09T12:43:56.556Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/EaiC5DA9Ee2RGoeL2j0vGg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2020.07.27.223354#hypothesis:EaiC5DA9Ee2RGoeL2j0vGg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:EaiC5DA9Ee2RGoeL2j0vGg/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
