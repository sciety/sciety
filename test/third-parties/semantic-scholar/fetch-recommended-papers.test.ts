import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { RelatedArticles } from '../../../src/shared-ports/fetch-related-articles';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryWord } from '../../helpers';
import { Ports, fetchRecommendedPapers } from '../../../src/third-parties/semantic-scholar/fetch-recommended-papers';
import { dummyLogger } from '../../dummy-logger';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('fetch-recommended-papers', () => {
  const articleId = arbitraryArticleId();
  const articleTitle = arbitrarySanitisedHtmlFragment();
  const articleAuthors = [arbitraryString(), arbitraryString()];

  describe('when a good response is returned', () => {
    it('translates to RelatedArticles', async () => {
      const ports: Ports = {
        logger: dummyLogger,
        getJson: async () => ({
          recommendedPapers: [
            {
              externalIds: {
                DOI: articleId.value,
              },
              title: articleTitle.toString(),
              authors: [
                {
                  name: articleAuthors[0],
                },
                {
                  name: articleAuthors[1],
                },
              ],
            },
          ],
        }),
      };
      const result = await pipe(
        arbitraryArticleId(),
        fetchRecommendedPapers(ports),
        TE.getOrElseW(shouldNotBeCalled),
      )();
      const expected: RelatedArticles = [{
        articleId,
        title: articleTitle,
        authors: O.some(articleAuthors),
      }];

      expect(result).toStrictEqual(expected);
    });
  });

  describe.each([
    ['10.26434/not-a-supported-doi'],
  ])('when a response contains an unsupported article (%s)', (unsupportedArticleId) => {
    it.failing('removes the unsupported article', async () => {
      const ports: Ports = {
        logger: dummyLogger,
        getJson: async () => ({
          recommendedPapers: [
            {
              externalIds: {
                DOI: articleId.value,
              },
              title: articleTitle.toString(),
              authors: [
                {
                  name: articleAuthors[0],
                },
                {
                  name: articleAuthors[1],
                },
              ],
            },
            {
              externalIds: {
                DOI: unsupportedArticleId,
              },
              title: arbitraryString(),
              authors: [
                {
                  name: arbitraryWord(),
                },
              ],
            },
          ],
        }),
      };
      const result = await pipe(
        arbitraryArticleId(),
        fetchRecommendedPapers(ports),
        TE.getOrElseW(shouldNotBeCalled),
      )();
      const expected: RelatedArticles = [expect.objectContaining({
        articleId,
      })];

      expect(result).toStrictEqual(expected);
    });
  });

  describe('when we cannot access Semantic Scholar', () => {
    it.todo('returns a left');
  });

  describe('when we cannot decode the response', () => {
    it.todo('returns a left');
  });
});
