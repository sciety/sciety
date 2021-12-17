import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchPciEvaluations } from '../../src/ingest/fetch-pci-evaluations';
import { daysAgo } from '../../src/ingest/time';
import { arbitraryUri } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';

const ingest = (xml: string) => pipe(
  {
    fetchData: <D>() => TE.right(xml as unknown as D),
    fetchGoogleSheet: shouldNotBeCalled,
  },
  fetchPciEvaluations(arbitraryUri()),
);

describe('fetch-pci-evaluations', () => {
  describe('when there are no evaluations', () => {
    const pciXmlResponse = `
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <links>
      </links>
    `;

    it('returns no evaluations and no skipped items', async () => {
      expect(await ingest(pciXmlResponse)()).toStrictEqual(E.right({
        evaluations: [],
        skippedItems: [],
      }));
    });
  });

  describe('when there is a valid evaluation', () => {
    it('returns 1 evaluation and no skipped items', async () => {
      const articleId = arbitraryDoi().value;
      const reviewId = arbitraryDoi().value;
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

      expect(await ingest(pciXmlResponse)()).toStrictEqual(E.right({
        evaluations: [
          {
            articleDoi: articleId,
            date,
            evaluationLocator: `doi:${reviewId}`,
            authors: [],
          },
        ],
        skippedItems: [],
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

      expect(await ingest(pciXmlResponse)()).toStrictEqual(E.right({
        evaluations: [],
        skippedItems: [
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
            <doi>${arbitraryDoi().value}</doi>
          </link>
        </links>
      `;

      const result = await pipe(
        ingest(pciXmlResponse),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result).toStrictEqual({
        evaluations: [],
        skippedItems: [
          {
            item: evaluationId,
            reason: 'malformed evaluation doi',
          },
        ],
      });
    });
  });
});
