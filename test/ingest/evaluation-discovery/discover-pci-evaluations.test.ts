import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { discoverPciEvaluations } from '../../../src/ingest/evaluation-discovery/discover-pci-evaluations';
import { ingestionWindowStartDate } from '../../../src/ingest/evaluation-discovery/ingestion-window-start-date';
import { DiscoveredPublishedEvaluations } from '../../../src/ingest/types/discovered-published-evaluations';
import { constructPublishedEvaluation } from '../../../src/ingest/types/published-evaluation';
import { arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';

const ingestDays = 10;

const discover = (xml: string) => pipe(
  {
    fetchData: <D>() => TE.right(xml as unknown as D),
    fetchGoogleSheet: shouldNotBeCalled,
  },
  discoverPciEvaluations(arbitraryUri())(ingestDays),
  TE.getOrElse(shouldNotBeCalled),
);

describe('discover-pci-evaluations', () => {
  let result: DiscoveredPublishedEvaluations;

  describe('when there are no evaluations', () => {
    const pciXmlResponse = `
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <links>
      </links>
    `;

    beforeEach(async () => {
      result = await discover(pciXmlResponse)();
    });

    it('returns no evaluations and no skipped items', () => {
      expect(result).toStrictEqual({
        understood: [],
        skipped: [],
      });
    });
  });

  describe('when there is an evaluation that falls into the ingestion window', () => {
    const evaluationDoi = arbitraryArticleId().value;
    const publishedDateThatFallsIntoIngestionWindow = ingestionWindowStartDate(ingestDays - 2);

    describe('and the paper being evaluated is expressed with a DOI', () => {
      describe('and is a biorxiv paper', () => {
        const biorxivPaperDoi = arbitraryArticleId().value;
        const pciXmlResponse = `
          <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <links>
            <link providerId="PCIArchaeology">
              <resource>
                <doi>${evaluationDoi}</doi>
                <date>${publishedDateThatFallsIntoIngestionWindow.toISOString()}</date>
              </resource>
              <doi>${biorxivPaperDoi}</doi>
            </link>
          </links>
        `;

        beforeEach(async () => {
          result = await discover(pciXmlResponse)();
        });

        it('returns 1 published evaluation and no skipped items', async () => {
          const expectedEvaluation = constructPublishedEvaluation({
            paperExpressionDoi: biorxivPaperDoi,
            publishedOn: publishedDateThatFallsIntoIngestionWindow,
            evaluationLocator: `doi:${evaluationDoi}`,
          });

          expect(result).toStrictEqual({
            understood: [
              expectedEvaluation,
            ],
            skipped: [],
          });
        });
      });

      describe('but is not a biorxiv paper', () => {
        const nonBiorxivPaperDoi = '10.5281/zenodo.5118675';
        const pciXmlResponse = `
          <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <links>
            <link providerId="PCIArchaeology">
              <resource>
                <doi>${evaluationDoi}</doi>
                <date>${publishedDateThatFallsIntoIngestionWindow.toISOString()}</date>
              </resource>
              <doi>${nonBiorxivPaperDoi}</doi>
            </link>
          </links>
        `;

        beforeEach(async () => {
          result = await discover(pciXmlResponse)();
        });

        it('returns 0 evaluations and 1 skipped item', async () => {
          expect(result).toStrictEqual({
            understood: [],
            skipped: [
              {
                item: nonBiorxivPaperDoi,
                reason: 'not a biorxiv|medrxiv DOI',
              },
            ],
          });
        });
      });
    });

    describe.each(
      [
        ['https://arxiv.org/abs/2101.01564'],
        ['https://hal.archives-ouvertes.fr/hal-03295242'],
        ['https://zenodo.org/record/7983163'],
        ['https://osf.io/preprints/socarxiv/2f8ph/'],
      ],
    )('and the paper being evaluated is expressed with a value (%s) that cannot be parsed into a DOI', (valueThatCannotBeParsedIntoADoi) => {
      const pciXmlResponse = `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <links>
          <link providerId="PCIArchaeology">
            <resource>
              <doi>${evaluationDoi}</doi>
              <date>${publishedDateThatFallsIntoIngestionWindow.toISOString()}</date>
            </resource>
            <doi>${valueThatCannotBeParsedIntoADoi}</doi>
          </link>
        </links>
      `;

      beforeEach(async () => {
        result = await discover(pciXmlResponse)();
      });

      it.skip('returns 0 evaluations and 1 skipped item', () => {
        expect(result).toStrictEqual({
          understood: [],
          skipped: [
            {
              item: valueThatCannotBeParsedIntoADoi,
              reason: 'not parseable into a DOI',
            },
          ],
        });
      });
    });

    describe.each(
      [
        // ['https://www.doi.org/10.1101/2023.09.05.556367', '10.1101/2023.09.05.556367'],
        ['https://doi.org/10.1101/2023.11.19.567721', '10.1101/2023.11.19.567721'],
        // ['https://doi.org/10.5281/zenodo.10086186', '10.5281/zenodo.10086186'],
        // ['https://doi.org/10.32942/X2BS3S', '10.32942/X2BS3S'],
        // ['https://doi.org/10.31219/osf.io/mr8hu', '10.31219/osf.io/mr8hu'],
        // ['https://doi.org/10.20944/preprints202004.0186.v5', '10.20944/preprints202004.0186.v5'],
        // ['https://www.biorxiv.org/content/10.1101/2021.08.18.456759', '10.1101/2021.08.18.456759'],
        ['10.1101/131136 ', '10.1101/131136'],
        // ['https://www.biorxiv.org/content/10.1101/2022.05.17.492258v4', '10.1101/2022.05.17.492258'],
      ],
    )('and the paper being evaluated is expressed with a value (%s) that can be parsed into a DOI', (valueThatCanBeParsedIntoADoi, doiParsedFromUrl) => {
      const pciXmlResponse = `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <links>
          <link providerId="PCIArchaeology">
            <resource>
              <doi>${evaluationDoi}</doi>
              <date>${publishedDateThatFallsIntoIngestionWindow.toISOString()}</date>
            </resource>
            <doi>${valueThatCanBeParsedIntoADoi}</doi>
          </link>
        </links>
      `;

      beforeEach(async () => {
        result = await discover(pciXmlResponse)();
      });

      it('returns 1 evaluation and 0 skipped items', async () => {
        const expectedEvaluation = constructPublishedEvaluation({
          paperExpressionDoi: doiParsedFromUrl,
          publishedOn: publishedDateThatFallsIntoIngestionWindow,
          evaluationLocator: `doi:${evaluationDoi}`,
        });

        expect(result).toStrictEqual({
          understood: [
            expectedEvaluation,
          ],
          skipped: [],
        });
      });
    });
  });

  describe('when there is an evaluation that does not fall into the ingestion window', () => {
    it.todo('returns 0 published evaluations and 0 skipped items');
  });
});
