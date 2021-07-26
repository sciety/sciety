import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { ArticleViewModel, renderArticleCard } from '../../../src/shared-components/article-card/render-article-card';
import { Doi } from '../../../src/types/doi';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { arbitraryDoi } from '../../types/doi.helper';

const generateArticleViewModel = ({
  doi = arbitraryDoi(),
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
  renderArticleCard(O.none),
  JSDOM.fragment,
  (rendered) => rendered.querySelectorAll('span'),
);

describe('render-article-card', () => {
  it('links the article title to the article page', () => {
    const articleViewModel = generateArticleViewModel({
      doi: new Doi('10.1101/1234'),
      title: sanitise(toHtmlFragment('The article title')),
    });

    const rendered = JSDOM.fragment(renderArticleCard(O.none)(articleViewModel));
    const link = rendered.querySelector('a');

    expect(link?.getAttribute('href')).toStrictEqual('/articles/activity/10.1101/1234');
    expect(link?.textContent).toStrictEqual('The article title');
  });

  describe('latest version', () => {
    const isLatestVersionSpan = (span: HTMLSpanElement) => span.textContent?.includes('Latest version');

    describe('when a latest version date is supplied', () => {
      it('displays the date', () => {
        const versionSpan = pipe(
          { latestVersionDate: O.some(new Date('1971-01-01')) },
          generateArticleViewModel,
          getSpans,
          Array.from,
          (array: Array<HTMLSpanElement>) => array.find(isLatestVersionSpan),
        );

        expect(versionSpan?.textContent).toStrictEqual('Latest version Jan 1, 1971');
      });
    });

    describe('when a latest version date is not supplied', () => {
      it('displays nothing', () => {
        const isLatestVersionPresent = pipe(
          { latestVersionDate: O.none },
          generateArticleViewModel,
          getSpans,
          Array.from,
          (array: Array<HTMLSpanElement>) => array.some(isLatestVersionSpan),
        );

        expect(isLatestVersionPresent).toBeFalsy();
      });
    });
  });

  describe('latest activity', () => {
    const isLatestActivitySpan = (span: HTMLSpanElement) => span.textContent?.includes('Latest activity');

    describe('when a latest activity date is supplied', () => {
      it('displays the date', () => {
        const latestActivitySpan = pipe(
          { latestActivityDate: O.some(new Date('1971-01-01')) },
          generateArticleViewModel,
          getSpans,
          Array.from,
          (array: Array<HTMLSpanElement>) => array.find(isLatestActivitySpan),
        );

        expect(latestActivitySpan?.textContent).toStrictEqual('Latest activity Jan 1, 1971');
      });
    });

    describe('when a latest activity date is not supplied', () => {
      it('displays nothing', () => {
        const isLatestActivityPresent = pipe(
          { latestActivityDate: O.none },
          generateArticleViewModel,
          getSpans,
          Array.from,
          (array: Array<HTMLSpanElement>) => array.some(isLatestActivitySpan),
        );

        expect(isLatestActivityPresent).toBeFalsy();
      });
    });
  });

  describe('authors', () => {
    const authorListSelector = '.article-card__authors';
    const authorListItemSelector = 'li.article-card__author';

    describe('when the authors list is not empty', () => {
      const articleViewModel = generateArticleViewModel({
        authors: ['Doe J', 'Foo A'],
      });

      it('the authors are in an ordered list', () => {
        const rendered = JSDOM.fragment(renderArticleCard(O.none)(articleViewModel));
        const authors = rendered.querySelector(authorListSelector);

        expect(authors?.tagName).toStrictEqual('OL');
      });

      it('displays the authors as a list', () => {
        const rendered = JSDOM.fragment(renderArticleCard(O.none)(articleViewModel));
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

        const rendered = JSDOM.fragment(renderArticleCard(O.none)(articleViewModel));
        const authors = rendered.querySelector(authorListSelector);

        expect(authors).toBeNull();
      });
    });
  });

  describe('evaluations', () => {
    const isEvaluationSpan = (element: HTMLSpanElement) => element.textContent?.includes('evaluation');

    describe('when there are > 1 evaluations', () => {
      it('displays the evaluation count pluralised', () => {
        const evaluationsSpan = pipe(
          { evaluationCount: 42 },
          generateArticleViewModel,
          getSpans,
          Array.from,
          (array: Array<HTMLSpanElement>) => array.find(isEvaluationSpan),
        );

        expect(evaluationsSpan?.textContent).toStrictEqual('42 evaluations');
      });
    });

    describe('when there is 1 evaluation', () => {
      it('displays the evaluation count singular', () => {
        const evaluationsSpan = pipe(
          { evaluationCount: 1 },
          generateArticleViewModel,
          getSpans,
          Array.from,
          (array: Array<HTMLSpanElement>) => array.find(isEvaluationSpan),
        );

        expect(evaluationsSpan?.textContent).toStrictEqual('1 evaluation');
      });
    });

    describe('when there are 0 evaluations', () => {
      it('displays the evaluation count pluralised', () => {
        const evaluationsSpan = pipe(
          { evaluationCount: 0 },
          generateArticleViewModel,
          getSpans,
          Array.from,
          (array: Array<HTMLSpanElement>) => array.find(isEvaluationSpan),
        );

        expect(evaluationsSpan?.textContent).toStrictEqual('0 evaluations');
      });
    });
  });
});
