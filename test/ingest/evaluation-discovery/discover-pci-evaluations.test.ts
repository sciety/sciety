import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { discoverPciEvaluations } from '../../../src/ingest/evaluation-discovery/discover-pci-evaluations';
import { daysAgo } from '../../../src/ingest/time';
import { constructPublishedEvaluation } from '../../../src/ingest/types/published-evaluation';
import { arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';

const discover = (xml: string) => pipe(
  {
    fetchData: <D>() => TE.right(xml as unknown as D),
    fetchGoogleSheet: shouldNotBeCalled,
  },
  discoverPciEvaluations(arbitraryUri()),
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
      const date = daysAgo(5);
      const pciXmlResponse = `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <links>
          <link providerId="PCIArchaeology">
            <resource>
              <doi>${reviewId}</doi>
              <date>${date.toISOString()}</date>
            </resource>
            <doi>${articleId}</doi>
          </link>
        </links>
      `;
      const expectedEvaluation = constructPublishedEvaluation({
        paperExpressionDoi: articleId,
        publishedOn: date,
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
              <date>${daysAgo(5).toISOString()}</date>
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

  describe('when the doi is malformed', () => {
    it('returns 0 evaluations and 1 skipped item', async () => {
      const evaluationId = 'https: //doi.org/10.24072/pci.evolbiol.100133';
      const pciXmlResponse = `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <links>
          <link providerId="PCIArchaeology">
            <resource>
              <doi>${evaluationId}</doi>
              <date>${daysAgo(5).toISOString()}</date>
            </resource>
            <doi>${arbitraryArticleId().value}</doi>
          </link>
        </links>
      `;

      const result = await pipe(
        discover(pciXmlResponse),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result).toStrictEqual({
        understood: [],
        skipped: [
          {
            item: evaluationId,
            reason: 'malformed evaluation doi',
          },
        ],
      });
    });
  });
});
