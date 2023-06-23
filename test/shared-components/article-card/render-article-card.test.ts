import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { ArticleCardViewModel, renderArticleCard } from '../../../src/shared-components/article-card/render-article-card';
import { Doi } from '../../../src/types/doi';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { arbitraryArticleId } from '../../types/article-id.helper';

const generateArticleViewModel = ({
  articleId = arbitraryArticleId(),
  title = sanitise(toHtmlFragment('default title')),
  authors = O.some(['Smith J']),
  latestActivityDate = O.some(new Date()),
  latestVersionDate = O.some(new Date()),
  evaluationCount = 0,
  listMembershipCount = O.none,
}): ArticleCardViewModel => ({
  articleId,
  title,
  authors,
  latestActivityAt: latestActivityDate,
  latestVersionDate,
  evaluationCount,
  listMembershipCount,
  curationStatementsTeasers: [],
});

const getSpans = (articleViewModel: ArticleCardViewModel) => pipe(
  articleViewModel,
  renderArticleCard,
  JSDOM.fragment,
  (rendered) => rendered.querySelectorAll('span'),
);

describe('render-article-card', () => {
  it('links to the article page', () => {
    const articleViewModel = generateArticleViewModel({
      articleId: new Doi('10.1101/1234'),
      title: sanitise(toHtmlFragment('The article title')),
    });

    const rendered = JSDOM.fragment(renderArticleCard(articleViewModel));
    const link = rendered.querySelector('a');

    expect(link?.getAttribute('href')).toBe('/articles/activity/10.1101/1234');
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

        expect(evaluationsSpan?.textContent).toBe('42 evaluations');
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

        expect(evaluationsSpan?.textContent).toBe('1 evaluation');
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

        expect(evaluationsSpan?.textContent).toBe('This article has no evaluations');
      });
    });
  });
});
