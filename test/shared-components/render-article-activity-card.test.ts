import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { ArticleViewModel, renderArticleActivityCard } from '../../src/shared-components/render-article-activity-card';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

const generateArticleViewModel = ({
  doi = new Doi('10.1101/1111'),
  title = sanitise(toHtmlFragment('default title')),
  authors = ['Smith J'],
  latestActivityDate = O.some(new Date()),
  latestVersionDate = O.some(new Date()),
  evaluationCount = 0,
}): ArticleViewModel => ({
  doi,
  title,
  authors,
  latestActivityDate,
  latestVersionDate,
  evaluationCount,
});

const getSpans = (articleViewModel: ArticleViewModel) => pipe(
  articleViewModel,
  renderArticleActivityCard,
  JSDOM.fragment,
  (rendered) => rendered.querySelectorAll('span'),
);

describe('render-article-activity-card', () => {
  it('links the article title to the article page', () => {
    const articleViewModel = generateArticleViewModel({
      doi: new Doi('10.1101/1234'),
      title: sanitise(toHtmlFragment('The article title')),
    });

    const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
    const link = rendered.querySelector('a');

    expect(link?.getAttribute('href')).toStrictEqual('/articles/activity/10.1101/1234');
    expect(link?.textContent).toStrictEqual('The article title');
  });

  describe('latest version', () => {
    const isLatestVersionSpan = (span: HTMLSpanElement) => span.textContent?.includes('Latest version');

    describe('when a latest version date is supplied', () => {
      it('displays the date', () => {
        const articleViewModel = generateArticleViewModel({ latestVersionDate: O.some(new Date('1971-01-01')) });
        const spans = getSpans(articleViewModel);
        const versionSpan = Array.from(spans).find(isLatestVersionSpan);

        expect(versionSpan?.textContent).toStrictEqual('Latest version Jan 1, 1971');
      });
    });

    describe('when a latest version date is not supplied', () => {
      it('displays nothing', () => {
        const articleViewModel = generateArticleViewModel({ latestVersionDate: O.none });
        const spans = getSpans(articleViewModel);
        const isLatestVersionPresent = Array.from(spans).some(isLatestVersionSpan);

        expect(isLatestVersionPresent).toBeFalsy();
      });
    });
  });

  describe('latest activity', () => {
    const isLatestActivitySpan = (span: HTMLSpanElement) => span.textContent?.includes('Latest activity');

    describe('when a latest activity date is supplied', () => {
      it('displays the date', () => {
        const articleViewModel = generateArticleViewModel({ latestActivityDate: O.some(new Date('1971-01-01')) });
        const spans = getSpans(articleViewModel);
        const latestActivitySpan = Array.from(spans).find(isLatestActivitySpan);

        expect(latestActivitySpan?.textContent).toStrictEqual('Latest activity Jan 1, 1971');
      });
    });

    describe('when a latest activity date is not supplied', () => {
      it('displays nothing', () => {
        const articleViewModel = generateArticleViewModel({ latestActivityDate: O.none });
        const spans = getSpans(articleViewModel);
        const isLatestActivityPresent = Array.from(spans).some(isLatestActivitySpan);

        expect(isLatestActivityPresent).toBeFalsy();
      });
    });
  });

  describe('authors', () => {
    const authorListSelector = '.article-activity-card__authors';
    const authorListItemSelector = 'li.article-activity-card__author';

    describe('when the authors list is not empty', () => {
      const articleViewModel = generateArticleViewModel({
        authors: ['Doe J', 'Foo A'],
      });

      it('the authors are in an ordered list', () => {
        const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
        const authors = rendered.querySelector(authorListSelector);

        expect(authors?.tagName).toStrictEqual('OL');
      });

      it('displays the authors as a list', () => {
        const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
        const authors = rendered.querySelectorAll(authorListItemSelector);
        const authorFullNames = Array.from(authors).map((element) => element.textContent);

        expect(authorFullNames).toStrictEqual([
          'Doe J',
          'Foo A',
        ]);
      });
    });

    describe('when the authors list is empty', () => {
      it('displays nothing', () => {
        const articleViewModel = generateArticleViewModel({ authors: [] });

        const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
        const authors = rendered.querySelector(authorListSelector);

        expect(authors).toBeNull();
      });
    });
  });

  describe('evaluations', () => {
    const isEvaluationSpan = (element: HTMLSpanElement) => element.textContent?.includes('evaluation');

    describe('when there are > 1 evaluations', () => {
      it('displays the evaluation count pluralised', () => {
        const articleViewModel = generateArticleViewModel({ evaluationCount: 42 });
        const spans = getSpans(articleViewModel);
        const evaluationsSpan = Array.from(spans).find(isEvaluationSpan);

        expect(evaluationsSpan?.textContent).toStrictEqual('42 evaluations');
      });
    });

    describe('when there is 1 evaluation', () => {
      it('displays the evaluation count singular', () => {
        const articleViewModel = generateArticleViewModel({ evaluationCount: 1 });
        const spans = getSpans(articleViewModel);
        const evaluationsSpan = Array.from(spans).find(isEvaluationSpan);

        expect(evaluationsSpan?.textContent).toStrictEqual('1 evaluation');
      });
    });

    describe('when there are 0 evaluations', () => {
      it('displays the evaluation count pluralised', () => {
        const articleViewModel = generateArticleViewModel({ evaluationCount: 0 });
        const spans = getSpans(articleViewModel);
        const evaluationsSpan = Array.from(spans).find(isEvaluationSpan);

        expect(evaluationsSpan?.textContent).toStrictEqual('0 evaluations');
      });
    });
  });
});
