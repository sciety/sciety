import { ArticleAuthors } from '../../../types/article-authors';
import { ArticleServer } from '../../../types/article-server';
import { ArticleId } from '../../../types/article-id';
import { SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment';

export type ArticleItem = {
  articleId: ArticleId,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};
