import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchAccessMicrobiologyEvaluation } from '../../../../src/third-parties/fetch-evaluation-digest/access-microbiology/fetch-access-microbiology-evaluation';
import { QueryExternalService } from '../../../../src/third-parties/query-external-service';
import { SanitisedHtmlFragment } from '../../../../src/types/sanitised-html-fragment';
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
    let result: SanitisedHtmlFragment;

    beforeEach(async () => {
      result = await pipe(
        key,
        fetchAccessMicrobiologyEvaluation(queryExternalService, dummyLogger),
        TE.getOrElse(abortTest('returned on the left')),
      )();
    });

    it('returns a full text', () => {
      expect(result).toBe(`<p>${text}</p>`);
    });
  });
});
