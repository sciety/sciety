import * as O from 'fp-ts/Option';
import { JSDOM } from 'jsdom';
import { ArticleViewModel, renderArticleActivityCard } from '../../src/shared-components/render-article-activity-card';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

describe('render-article-activity-card', () => {
  it('links the article title to the article page', () => {
    const articleViewModel: ArticleViewModel = {
      doi: new Doi('10.1101/1234'),
      title: sanitise(toHtmlFragment('The article title')),
      authors: [],
      latestActivityDate: O.none,
      latestVersionDate: O.none,
      evaluationCount: 0,
    };

    const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
    const link = rendered.querySelector('a');

    expect(link?.getAttribute('href')).toStrictEqual('/articles/activity/10.1101/1234');
    expect(link?.textContent).toStrictEqual('The article title');
  });

  describe('latest version', () => {
    describe('when a latest version date is supplied', () => {
      it('displays the date', () => {
        const articleViewModel: ArticleViewModel = {
          doi: new Doi('10.1101/1234'),
          title: sanitise(toHtmlFragment('The article title')),
          authors: [],
          latestActivityDate: O.none,
          latestVersionDate: O.some(new Date('1971-01-01')),
          evaluationCount: 0,
        };

        const rendered = JSDOM.fragment(renderArticleActivityCard(articleViewModel));
        const spans = rendered.querySelectorAll('span');
        const versionSpan = Array.from(spans).find((span) => span.textContent?.includes('Latest version'));

        expect(versionSpan?.textContent).toStrictEqual('Latest version Jan 1, 1971');
      });
    });

    describe('when a latest version date is not supplied', () => {
      it.todo('displays nothing');
    });
  });

  describe('latest activity', () => {
    describe('when a latest activity date is supplied', () => {
      it.todo('displays the date');
    });

    describe('when a latest activity date is not supplied', () => {
      it.todo('displays nothing');
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
