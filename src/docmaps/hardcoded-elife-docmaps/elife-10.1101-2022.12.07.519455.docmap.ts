import { Docmap } from '../docmap/docmap-type';

export const hardcodedElifeArticle: Docmap = {
  '@context': 'https://w3id.org/docmaps/context.jsonld',
  id: 'https://sciety.org/docmaps/v1/articles/10.1101/2022.12.07.519455/elife.docmap.json',
  type: 'docmap',
  created: '2023-02-10T11:50:07.942Z',
  updated: '2023-02-12T09:30:07.568Z',
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
          doi: '10.1101/2022.12.07.519455',
          url: 'https://doi.org/10.1101/2022.12.07.519455',
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
              published: '2023-02-10T11:42:27.096Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/_jFY6Kk3Ee2xoOtRQrEDrw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.12.07.519455#hypothesis:_jFY6Kk3Ee2xoOtRQrEDrw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:_jFY6Kk3Ee2xoOtRQrEDrw/content',
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
              published: '2023-02-10T11:42:28.097Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/_siAJKk3Ee2J2h_SFSe9Rw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.12.07.519455#hypothesis:_siAJKk3Ee2J2h_SFSe9Rw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:_siAJKk3Ee2J2h_SFSe9Rw/content',
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
              published: '2023-02-10T11:42:28.419Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/_vh3Fqk3Ee2jlcs2iz4DxQ',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.12.07.519455#hypothesis:_vh3Fqk3Ee2jlcs2iz4DxQ',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:_vh3Fqk3Ee2jlcs2iz4DxQ/content',
                },
              ],
            },
          ],
        },
        {
          participants: [
            {
              actor: { name: 'Laura Colgin', type: 'person', _relatesToOrganization: 'University of Texas at Austin, United States' },
              role: 'editor',
            },
            {
              actor: { name: 'Laura Colgin', type: 'person', _relatesToOrganization: 'University of Texas at Austin, United States' },
              role: 'senior-editor',
            },
          ],
          outputs: [
            {
              type: 'evaluation-summary',
              published: '2023-02-10T11:42:29.410Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/_49Ppqk3Ee2tA3NDOvemrg',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.12.07.519455#hypothesis:_49Ppqk3Ee2tA3NDOvemrg',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:_49Ppqk3Ee2tA3NDOvemrg/content',
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
              type: 'reply',
              published: '2023-02-12T09:20:16.079Z',
              content: [
                {
                  type: 'web-page',
                  url: 'https://hypothes.is/a/diFO2Kq2Ee2jHTOTF0-Dkw',
                },
                {
                  type: 'web-page',
                  url: 'https://sciety.org/articles/activity/10.1101/2022.12.07.519455#hypothesis:diFO2Kq2Ee2jHTOTF0-Dkw',
                },
                {
                  type: 'web-content',
                  url: 'https://sciety.org/evaluations/hypothesis:diFO2Kq2Ee2jHTOTF0-Dkw/content',
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
