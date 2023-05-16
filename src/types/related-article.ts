import { ArticleAuthors } from './article-authors';
import { Doi } from './doi';
import { SanitisedHtmlFragment } from './sanitised-html-fragment';

export type RelatedArticle = {
  articleId: Doi,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};
