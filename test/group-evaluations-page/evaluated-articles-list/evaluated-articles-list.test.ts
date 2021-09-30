import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { evaluatedArticlesList } from '../../../src/group-evaluations-page/evaluated-articles-list';
import * as DE from '../../../src/types/data-error';
import { arbitraryDate, arbitraryNumber, arbitrarySanitisedHtmlFragment } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroup } from '../../types/group.helper';

const generateArticles = (count: number) => (
  [...Array(count).keys()].map(() => ({
    doi: arbitraryDoi(),
    evaluationCount: arbitraryNumber(1, 5),
    latestActivityDate: arbitraryDate(),
  }))
);

describe('evaluated-articles-list', () => {
  describe('when article details for the page can be fetched', () => {
    it.todo('returns article cards for each article');
  });

  describe('when there are no evaluated articles', () => {
    it.todo('displays a static message');
  });

  describe('when there is more than one page', () => {
    it.todo('links to the next page');
  });

  describe('when some of the article details can\'t be retrieved', () => {
    it('returns the successful article cards', async () => {
      const articles = generateArticles(4);
      const fetchArticle = jest.fn().mockImplementation(
        (doi) => {
          if (doi.value === articles[0].doi.value || doi.value === articles[1].doi.value) {
            return TE.left(DE.unavailable);
          }
          return TE.right({
            title: arbitrarySanitisedHtmlFragment(),
            server: arbitraryArticleServer(),
            authors: [],
          });
        },
      );
      const html = await pipe(
        evaluatedArticlesList({
          fetchArticle,
          findVersionsForArticleDoi: () => TO.some([{ occurredAt: arbitraryDate() }]),
        })(articles, arbitraryGroup(), 1, 20),
        TE.map(JSDOM.fragment),
        TE.getOrElse(shouldNotBeCalled),
      )();
      const cardCount = Array.from(html.querySelectorAll('.article-card')).length;

      expect(cardCount).toBe(2);
    });
  });

  describe('when none of the article details can be retrieved', () => {
    it('returns "this information can\'t be found" message', async () => {
      const result = await pipe(
        evaluatedArticlesList({
          fetchArticle: () => TE.left(DE.unavailable),
          findVersionsForArticleDoi: shouldNotBeCalled,
        })(
          [{
            doi: arbitraryDoi(),
            evaluationCount: arbitraryNumber(1, 5),
            latestActivityDate: arbitraryDate(),
          }],
          arbitraryGroup(),
          1,
          1,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();

      expect(result).toContain('This information can not be found');
    });
  });

  describe('when the requested page is out of bounds', () => {
    it('returns not found', async () => {
      const pageNumber = 2;
      const pageSize = 1;
      const result = await evaluatedArticlesList({
        fetchArticle: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
      })(
        [{
          doi: arbitraryDoi(),
          evaluationCount: arbitraryNumber(1, 5),
          latestActivityDate: arbitraryDate(),
        }],
        arbitraryGroup(),
        pageNumber,
        pageSize,
      )();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
