import * as O from 'fp-ts/Option';
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
  evaluationCount = O.none,
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
});
