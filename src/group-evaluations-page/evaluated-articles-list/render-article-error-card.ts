import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type ArticleErrorCardViewModel = {
  href: string,
};

export const renderArticleErrorCard = (viewModel: ArticleErrorCardViewModel): HtmlFragment => (
  toHtmlFragment(`
    <div class="error-card">
      <a href="${viewModel.href}">
        Can't currently display this article.
      </a>
    </div>
  `)
);
