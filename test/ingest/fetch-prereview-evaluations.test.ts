import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { fetchPrereviewEvaluations } from '../../src/ingest/fetch-prereview-evaluations';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('fetch-prereview-evaluations', () => {
  describe('when the reponse includes no preprints', () => {
    const result = fetchPrereviewEvaluations()({
      fetchData: <D>() => TE.right({ data: [] } as unknown as D),
      fetchGoogleSheet: shouldNotBeCalled,
    });

    it('returns no evaluations', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        evaluations: [],
      })));
    });

    it.todo('returns no skipped items');
  });

  describe('when the response is corrupt', () => {
    it('reports an error', async () => {
      const result = fetchPrereviewEvaluations()({
        fetchData: <D>() => TE.right({} as unknown as D),
        fetchGoogleSheet: shouldNotBeCalled,
      });

      expect(await result()).toStrictEqual(E.left(expect.stringContaining('Invalid value')));
    });
  });
});
