import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { evaluatedArticlesList, Ports } from '../../../src/group-evaluations-page/evaluated-articles-list';
import {
  noArticlesCanBeFetchedMessage,
  noEvaluatedArticlesMessage,
} from '../../../src/group-evaluations-page/evaluated-articles-list/static-messages';
import * as DE from '../../../src/types/data-error';
import { Doi } from '../../../src/types/doi';
import { Group } from '../../../src/types/group';
import { HtmlFragment } from '../../../src/types/html-fragment';
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

const findVersionsForArticleDoi: Ports['findVersionsForArticleDoi'] = () => TO.some([{ occurredAt: arbitraryDate() }]);

const cardCount = (html: HtmlFragment) => Array.from(JSDOM.fragment(html).querySelectorAll('.article-card')).length;

describe('evaluated-articles-list', () => {
  describe('when article details for the page can be fetched', () => {
    const fetchArticle = () => TE.right({
      title: arbitrarySanitisedHtmlFragment(),
      server: arbitraryArticleServer(),
      authors: [],
    });

    let html: HtmlFragment;

    beforeEach(async () => {
      const articles = generateArticles(2);
      html = await pipe(
        evaluatedArticlesList({
          fetchArticle,
          findVersionsForArticleDoi,
        })(articles, arbitraryGroup(), 1, 20),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns article cards for each article', async () => {
      expect(cardCount(html)).toBe(2);
    });

    it('shows "page x of y"', () => {
      expect(html).toContain('page 1 of 1');
    });
  });

  describe('when there are no evaluated articles', () => {
    let html: HtmlFragment;

    beforeEach(async () => {
      html = await pipe(
        evaluatedArticlesList({
          fetchArticle: shouldNotBeCalled,
          findVersionsForArticleDoi: shouldNotBeCalled,
        })([], arbitraryGroup(), 1, 20),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays a static message', () => {
      expect(html).toContain(noEvaluatedArticlesMessage);
    });

    it('doesn\'t show "page x of y"', async () => {
      expect(html).not.toMatch(/page \d+ of \d+/);
    });
  });

  describe('when there is more than one page', () => {
    const fetchArticle = () => TE.right({
      title: arbitrarySanitisedHtmlFragment(),
      server: arbitraryArticleServer(),
      authors: [],
    });

    let html: HtmlFragment;
    let group: Group;

    beforeEach(async () => {
      const articles = generateArticles(20);
      group = arbitraryGroup();
      html = await pipe(
        evaluatedArticlesList({
          fetchArticle,
          findVersionsForArticleDoi,
        })(articles, group, 1, 7),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('links to the next page', async () => {
      expect(html).toContain(`/groups/${group.slug}/evaluated-articles?page=2`);
    });

    it('shows "page x of y"', () => {
      expect(html).toContain('page 1 of 3');
    });
  });

  describe('when some of the article details can\'t be retrieved', () => {
    let html: HtmlFragment;

    beforeEach(async () => {
      const articles = generateArticles(4);
      const fetchArticle = (doi: Doi) => {
        if (doi.value === articles[0].doi.value || doi.value === articles[1].doi.value) {
          return TE.left(DE.unavailable);
        }
        return TE.right({
          title: arbitrarySanitisedHtmlFragment(),
          server: arbitraryArticleServer(),
          authors: [],
        });
      };
      html = await pipe(
        evaluatedArticlesList({
          fetchArticle,
          findVersionsForArticleDoi,
        })(articles, arbitraryGroup(), 1, 20),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the successful article cards', async () => {
      expect(cardCount(html)).toBe(2);
    });

    it('shows "page x of y"', () => {
      expect(html).toContain('page 1 of 1');
    });
  });

  describe('when none of the article details can be retrieved', () => {
    let html: HtmlFragment;

    beforeEach(async () => {
      html = await pipe(
        evaluatedArticlesList({
          fetchArticle: () => TE.left(DE.unavailable),
          findVersionsForArticleDoi,
        })(
          generateArticles(1),
          arbitraryGroup(),
          1,
          1,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns "this information can\'t be found" message', async () => {
      expect(html).toContain(noArticlesCanBeFetchedMessage);
    });

    it('doesn\'t show "page x of y"', async () => {
      expect(html).not.toMatch(/page \d+ of \d+/);
    });
  });

  describe('when the requested page is out of bounds', () => {
    it('returns not found', async () => {
      const pageNumber = 2;
      const pageSize = 1;
      const result = await evaluatedArticlesList({
        fetchArticle: shouldNotBeCalled,
        findVersionsForArticleDoi,
      })(
        generateArticles(1),
        arbitraryGroup(),
        pageNumber,
        pageSize,
      )();

      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});
