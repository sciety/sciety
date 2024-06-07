import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { discoverPciEvaluations } from '../../../src/ingest/evaluation-discovery/discover-pci-evaluations';
import { ingestionWindowStartDate } from '../../../src/ingest/evaluation-discovery/ingestion-window-start-date';
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
);

describe('discover-pci-evaluations', () => {
  describe('when there are no evaluations', () => {
    const pciXmlResponse = `
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <links>
      </links>
    `;

    it('returns no evaluations and no skipped items', async () => {
      expect(await discover(pciXmlResponse)()).toStrictEqual(E.right({
        understood: [],
        skipped: [],
      }));
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

        it('returns 1 published evaluation and no skipped items', async () => {
          const expectedEvaluation = constructPublishedEvaluation({
            paperExpressionDoi: biorxivPaperDoi,
            publishedOn: publishedDateThatFallsIntoIngestionWindow,
            evaluationLocator: `doi:${evaluationDoi}`,
          });

          expect(await discover(pciXmlResponse)()).toStrictEqual(E.right({
            understood: [
              expectedEvaluation,
            ],
            skipped: [],
          }));
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

        it('returns 0 evaluations and 1 skipped item', async () => {
          expect(await discover(pciXmlResponse)()).toStrictEqual(E.right({
            understood: [],
            skipped: [
              {
                item: nonBiorxivPaperDoi,
                reason: 'not a biorxiv|medrxiv DOI',
              },
            ],
          }));
        });
      });
    });

    describe('and the paper being evaluated is expressed with a value that cannot be parsed into a DOI', () => {
      it.todo('returns 0 evaluations and 1 skipped item');
    });

    describe('and the paper being evaluated is expressed with a value that can be parsed into a DOI', () => {
      const valueThatCanBeParsedIntoADoi = 'https://www.doi.org/10.1101/2023.09.05.556367';
      const doiParsedFromUrl = '10.1101/2023.09.05.556367';
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

      it.failing('returns 1 evaluation and 0 skipped items', async () => {
        const expectedEvaluation = constructPublishedEvaluation({
          paperExpressionDoi: doiParsedFromUrl,
          publishedOn: publishedDateThatFallsIntoIngestionWindow,
          evaluationLocator: `doi:${evaluationDoi}`,
        });

        expect(await discover(pciXmlResponse)()).toStrictEqual(E.right({
          understood: [
            expectedEvaluation,
          ],
          skipped: [],
        }));
      });
    });
  });

  describe('when there is an evaluation that does not fall into the ingestion window', () => {
    it.todo('returns 0 published evaluations and 0 skipped items');
  });
});
