import * as O from 'fp-ts/Option';
import { ArticleAuthors } from '../types/article-authors';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type GroupItem = {
  id: GroupId,
};

export type ArticleItem = {
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ArticleAuthors,
};

export const isArticleItem = (item: ArticleItem | GroupItem): item is ArticleItem => 'doi' in item;

export type ArticleResults = {
  items: ReadonlyArray<ArticleItem>,
  total: number,
  nextCursor: O.Option<string>,
};
