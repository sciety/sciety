import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchAccessMicrobiologyEvaluation } from '../../../../src/third-parties/fetch-evaluation/access-microbiology/fetch-access-microbiology-evaluation';
import { QueryExternalService } from '../../../../src/third-parties/query-external-service';
import { Evaluation } from '../../../../src/types/evaluation';
import { dummyLogger } from '../../../dummy-logger';
import { abortTest } from '../../../framework/abort-test';
import { arbitraryString } from '../../../helpers';

describe('fetch-access-microbiology-evaluation', () => {
  describe('given an XML containing the relevant sub-article', () => {
    const key = '10.1099/acmi.0.000569.v1.3';
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

    it('returns a full text', () => {
      expect(result.fullText).toBe(`<p>${text}</p>`);
    });

    it('returns a url', () => {
      expect(result.url.toString()).toBe('https://doi.org/10.1099/acmi.0.000569.v1.3');
    });
  });
});
