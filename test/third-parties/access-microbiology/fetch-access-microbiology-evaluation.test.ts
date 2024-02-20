import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { fetchAccessMicrobiologyEvaluation } from '../../../src/third-parties/access-microbiology/fetch-access-microbiology-evaluation';
import { QueryExternalService } from '../../../src/third-parties/query-external-service';
import { Evaluation } from '../../../src/types/evaluation';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryHtmlFragment, arbitraryString } from '../../helpers';

describe('fetch-access-microbiology-evaluation', () => {
  describe.skip('given an XML containing the relevant sub-article', () => {
    const queryExternalService: QueryExternalService = () => () => TE.right('');
    const key = arbitraryString();
    const body = arbitraryHtmlFragment();
    let result: Evaluation;

    beforeEach(async () => {
      result = await pipe(
        key,
        fetchAccessMicrobiologyEvaluation(queryExternalService, dummyLogger),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('return a full text', () => {
      expect(result.fullText).toStrictEqual(body);
    });

    it.todo('return a url');
  });
});
