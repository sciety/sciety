import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { fetchAccessMicrobiologyEvaluation } from '../../../src/third-parties/access-microbiology/fetch-access-microbiology-evaluation';
import { QueryExternalService } from '../../../src/third-parties/query-external-service';
import { Evaluation } from '../../../src/types/evaluation';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryString, arbitraryWord } from '../../helpers';
import { abortTest } from '../../framework/abort-test';

describe('fetch-access-microbiology-evaluation', () => {
  describe.skip('given an XML containing the relevant sub-article', () => {
    const key = arbitraryWord();
    const text = arbitraryString();
    const queryExternalService: QueryExternalService = () => () => TE.right(`
      <article>
        <sub-article>
          <front-stub>
            <article-id>${key}</article-id>
          </front-stub>
          <body>
            <p>${text}</p>
          </body>
        </sub-article>
      </article>
    `);
    let result: Evaluation;

    beforeEach(async () => {
      result = await pipe(
        key,
        fetchAccessMicrobiologyEvaluation(queryExternalService, dummyLogger),
        TE.getOrElse(abortTest('returned on the left')),
      )();
    });

    it.failing('return a full text', () => {
      expect(result.fullText).toBe(`<p>${text}</p>`);
    });

    it.todo('return a url');
  });
});
