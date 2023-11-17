import * as O from 'fp-ts/Option';
import { ArticleId } from '../../types/article-id.js';
import { HtmlFragment } from '../../types/html-fragment.js';
import { ListId } from '../../types/list-id.js';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment.js';

export type UnrecoverableError = 'article-not-in-list';

export type ViewModel = {
  articleId: ArticleId,
  listId: ListId,
  articleTitle: SanitisedHtmlFragment,
  listName: string,
  pageHeading: HtmlFragment,
  unrecoverableError: O.Option<UnrecoverableError>,
};
