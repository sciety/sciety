import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.03.04.482974/elife.docmap.json',
  type: 'docmap',
  created: '2022-04-07T21:40:24.743Z',
  updated: '2022-04-07T21:40:29.547Z',
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
          doi: '10.1101/2022.03.04.482974',
          url: 'https://doi.org/10.1101/2022.03.04.482974',
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
              published: '2022-04-07T21:30:27.195Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/8R4Qcra5EeyhOScbIo__uA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.03.04.482974#hypothesis:8R4Qcra5EeyhOScbIo__uA',
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
              published: '2022-04-07T21:30:27.961Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/8ZN75ra5Eey4cpOEMlBsJA',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.03.04.482974#hypothesis:8ZN75ra5Eey4cpOEMlBsJA',
                },
              ],
            },
          ],
        }, {
          participants: [
            { actor: { name: 'anonymous', type: 'person' }, role: 'peer-reviewer' },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2022-04-07T21:30:28.728Z',
              content: [
                { type: 'web-page', url: 'https://hypothes.is/a/8gbVlra5EeyDXKsbmydacQ' }, { type: 'web-page', url: 'https://sciety.org/articles/activity/10.1101/2022.03.04.482974#hypothesis:8gbVlra5EeyDXKsbmydacQ' },
              ],
            },
          ],
        }, {
          participants: [
            { actor: { name: 'anonymous', type: 'person' }, role: 'peer-reviewer' },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2022-04-07T21:30:29.418Z',
              content: [
                { type: 'web-page', url: 'https://hypothes.is/a/8nGtdra5Eey9SDOugQFaWg' }, { type: 'web-page', url: 'https://sciety.org/articles/activity/10.1101/2022.03.04.482974#hypothesis:8nGtdra5Eey9SDOugQFaWg' },
              ],
            },
          ],
        }, {
          participants: [
            { actor: { name: 'anonymous', type: 'person' }, role: 'peer-reviewer' },
          ],
          outputs: [
            {
              type: 'review-article',
              published: '2022-04-07T21:35:05.987Z',
              content: [
                { type: 'web-page', url: 'https://hypothes.is/a/l3KKjra6Eey4dVtpowAVAg' }, { type: 'web-page', url: 'https://sciety.org/articles/activity/10.1101/2022.03.04.482974#hypothesis:l3KKjra6Eey4dVtpowAVAg' },
              ],
            },
          ],
        },
      ],
    },
  },
};
