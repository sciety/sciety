import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchPrelightsHighlight } from '../../src/infrastructure/fetch-prelights-highlight';
import { arbitraryUri } from '../helpers';

describe('fetch-prelight-highlight', () => {
  it('given an arbitrary URL the result contains the same URL', async () => {
    const guid = new URL(arbitraryUri());

    const evaluationUrl = await pipe(
      fetchPrelightsHighlight(guid.toString()),
      TE.map((evaluation) => evaluation.url.toString()),
    )();

    expect(evaluationUrl).toStrictEqual(E.right(guid.toString()));
  });
});
