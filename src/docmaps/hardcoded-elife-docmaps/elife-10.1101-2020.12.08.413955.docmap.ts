import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2020.12.08.413955/elife.docmap.json',
  type: 'docmap',
  created: '2021-03-29T14:58:22.000Z',
  updated: '2021-09-01T14:54:46.000Z',
  publisher: {
    id: 'https://elifesciences.org/',
    name: 'eLife',
    logo: 'https://sciety.org/static/groups/elife--b560187e-f2fb-4ff9-a861-a204f3fc0fb0.png',
    homepage: 'https://elifesciences.org/',
    account: { id: 'https://sciety.org/groups/elife', service: 'https://sciety.org' },
  },
  'first-step': '_:b0',
  steps: {
    '_:b0': {
      assertions: [],
      inputs: [{ doi: '10.1101/2020.12.08.413955', url: 'https://doi.org/10.1101/2020.12.08.413955' }],
      actions: [{
        participants: [
          {
            actor: {
              name: 'Ronald L Calabrese',
              type: 'person',
              _relatesToOrganization: 'Emory University, United States',
            },
            role: 'senior-editor',
          },
          {
            actor: {
              name: 'Stanley Heinze',
              type: 'person',
              _relatesToOrganization: 'Lund University, Sweden',
            },
            role: 'peer-reviewer',
          },
          {
            actor: {
              name: 'Jason Pipkin',
              type: 'person',
              _relatesToOrganization: 'Brandeis University, United States',
            },
            role: 'peer-reviewer',
          },
        ],
        outputs: [{
          type: 'evaluation-summary',
          published: '2021-03-26T16:45:35.930Z',
          content: [
            {
              type: 'web-page',
              url: 'https://hypothes.is/a/sE8-RI5SEeuN_pfRKWMobg',
            },
            {
              type: 'web-page',
              url: 'https://sciety.org/articles/activity/10.1101/2020.12.08.413955#hypothesis:sE8-RI5SEeuN_pfRKWMobg',
            },
            {
              type: 'web-content',
              url: 'https://sciety.org/evaluations/hypothesis:sE8-RI5SEeuN_pfRKWMobg/content',
            },
          ],
        }],
      }, {
        participants: [{
          actor: { name: 'anonymous', type: 'person' },
          role: 'peer-reviewer',
        }],
        outputs: [
          {
            type: 'review-article',
            published: '2021-03-26T16:45:41.694Z',
            content: [
              {
                type: 'web-page',
                url: 'https://hypothes.is/a/s7pNso5SEeuN_zcG1nqDVw',
              },
              {
                type: 'web-page',
                url: 'https://sciety.org/articles/activity/10.1101/2020.12.08.413955#hypothesis:s7pNso5SEeuN_zcG1nqDVw',
              },
              {
                type: 'web-content',
                url: 'https://sciety.org/evaluations/hypothesis:s7pNso5SEeuN_zcG1nqDVw/content',
              },
            ],
          }],

      }, {
        participants: [{
          actor: { name: 'anonymous', type: 'person' },
          role: 'peer-reviewer',
        }],
        outputs: [
          {
            type: 'review-article',
            published: '2021-03-26T16:45:45.058Z',
            content: [
              {
                type: 'web-page',
                url: 'https://hypothes.is/a/tc8Y0I5SEeuOQgflHqczuA',
              },
              {
                type: 'web-page',
                url: 'https://sciety.org/articles/activity/10.1101/2020.12.08.413955#hypothesis:tc8Y0I5SEeuOQgflHqczuA',
              },
              {
                type: 'web-content',
                url: 'https://sciety.org/evaluations/hypothesis:tc8Y0I5SEeuOQgflHqczuA/content',
              },
            ],
          }],

      }, {
        participants: [{
          actor: { name: 'anonymous', type: 'person' },
          role: 'peer-reviewer',
        }],
        outputs: [
          {
            type: 'reply',
            published: '2021-09-01T12:49:02.822Z',
            content: [
              {
                type: 'web-page',
                url: 'https://hypothes.is/a/_EcT2AsiEeynBsvN2IqmAQ',
              },
              {
                type: 'web-page',
                url: 'https://sciety.org/articles/activity/10.1101/2020.12.08.413955#hypothesis:_EcT2AsiEeynBsvN2IqmAQ',
              },
              {
                type: 'web-content',
                url: 'https://sciety.org/evaluations/hypothesis:_EcT2AsiEeynBsvN2IqmAQ/content',
              },
            ],
          }],
      }],
    },
  },
};
