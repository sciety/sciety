import { ArticleAuthors } from '../../../types/article-authors.js';
import { ArticleServer } from '../../../types/article-server.js';
import { ArticleId } from '../../../types/article-id.js';
import { SanitisedHtmlFragment } from '../../../types/sanitised-html-fragment.js';

export type ArticleItem = {
  articleId: ArticleId,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};
