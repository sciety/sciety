import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type ArticleErrorCardViewModel = {
  href: string,
};

export const renderArticleErrorCard = (viewModel: ArticleErrorCardViewModel): HtmlFragment => (
  toHtmlFragment(`
    <article class="article-card">
      <a class="article-card__link" href="${viewModel.href}">
        Can't currently display this article.
      </a>
    </article>
  `)
);
