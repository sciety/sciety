import * as O from 'fp-ts/Option';
import { JSDOM } from 'jsdom';
import { ArticleViewModel, renderArticleActivityCard } from '../../src/shared-components/render-article-activity-card';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

const generateArticleViewModel = ({
  doi = new Doi('10.1101/1111'),
  title = sanitise(toHtmlFragment('default title')),
  authors = [],
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

        const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
        const spans = rendered.querySelectorAll('span');
        const versionSpan = Array.from(spans).find(isLatestVersionSpan);

        expect(versionSpan?.textContent).toStrictEqual('Latest version Jan 1, 1971');
      });
    });

    describe('when a latest version date is not supplied', () => {
      it('displays nothing', () => {
        const articleViewModel = generateArticleViewModel({ latestVersionDate: O.none });

        const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
        const spans = rendered.querySelectorAll('span');
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

        const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
        const spans = rendered.querySelectorAll('span');
        const latestActivitySpan = Array.from(spans).find(isLatestActivitySpan);

        expect(latestActivitySpan?.textContent).toStrictEqual('Latest activity Jan 1, 1971');
      });
    });

    describe('when a latest activity date is not supplied', () => {
      it('displays nothing', () => {
        const articleViewModel = generateArticleViewModel({ latestActivityDate: O.none });

        const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
        const spans = rendered.querySelectorAll('span');
        const isLatestActivityPresent = Array.from(spans).some(isLatestActivitySpan);

        expect(isLatestActivityPresent).toBeFalsy();
      });
    });
  });

  describe('authors', () => {
    describe('when the authors list is not empty', () => {
      it.todo('displays the authors as a list');
    });

    describe('when the authors list is empty', () => {
      it.todo('displays nothing');
    });
  });

  describe('evaluations', () => {
    describe('when there are > 1 evaluations', () => {
      it.todo('displays the evaluation count pluralised');
    });

    describe('when there is 1 evaluation', () => {
      it.todo('displays the evaluation count singular');
    });

    describe('when there are 0 evaluations', () => {
      it.todo('displays the evaluation count pluralised');
    });
  });
});
