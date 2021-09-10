import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchPciEvaluations } from '../../src/ingest/fetch-pci-evaluations';
import { arbitraryUri } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('fetch-pci-evaluations', () => {
  describe('when there are no evaluations', () => {
    it('returns no evaluations and no skipped items', async () => {
      const pciXmlResponse = `
        <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <links>
        </links>
      `;
      const result = await pipe(
        {
          fetchData: <D>() => TE.right(pciXmlResponse as unknown as D),
          fetchGoogleSheet: shouldNotBeCalled,
        },
        fetchPciEvaluations(arbitraryUri()),
      )();

      expect(result).toStrictEqual(E.right({
        evaluations: [],
        skippedItems: [],
      }));
    });
  });

  describe('when there is a valid evaluation', () => {
    it.todo('returns 1 evaluation and no skipped items');
  });

  describe('when there is an invalid evaluation', () => {
    it.todo('returns 0 evaluations and 1 skipped item');
  });
});
