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
const publishedDateThatFallsIntoIngestionWindow = ingestionWindowStartDate(8);

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

  describe('when there is a valid evaluation', () => {
    it('returns 1 evaluation and no skipped items', async () => {
      const articleId = arbitraryArticleId().value;
      const reviewId = arbitraryArticleId().value;
      const pciXmlResponse = `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <links>
          <link providerId="PCIArchaeology">
            <resource>
              <doi>${reviewId}</doi>
              <date>${publishedDateThatFallsIntoIngestionWindow.toISOString()}</date>
            </resource>
            <doi>${articleId}</doi>
          </link>
        </links>
      `;
      const expectedEvaluation = constructPublishedEvaluation({
        paperExpressionDoi: articleId,
        publishedOn: publishedDateThatFallsIntoIngestionWindow,
        evaluationLocator: `doi:${reviewId}`,
      });

      expect(await discover(pciXmlResponse)()).toStrictEqual(E.right({
        understood: [
          expectedEvaluation,
        ],
        skipped: [],
      }));
    });
  });

  describe('when there is an invalid evaluation', () => {
    it('returns 0 evaluations and 1 skipped item', async () => {
      const articleId = '10.5281/zenodo.5118675';
      const pciXmlResponse = `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <links>
          <link providerId="PCIArchaeology">
            <resource>
              <doi>10.24072/pci.archaeo.100011</doi>
              <date>${publishedDateThatFallsIntoIngestionWindow.toISOString()}</date>
            </resource>
            <doi>${articleId}</doi>
          </link>
        </links>
      `;

      expect(await discover(pciXmlResponse)()).toStrictEqual(E.right({
        understood: [],
        skipped: [
          {
            item: articleId,
            reason: 'not a biorxiv|medrxiv DOI',
          },
        ],
      }));
    });
  });
});
