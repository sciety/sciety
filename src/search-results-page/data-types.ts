import * as O from 'fp-ts/Option';
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
  authors: O.Option<ReadonlyArray<string>>,
};

export const isArticleItem = (item: ArticleItem | GroupItem): item is ArticleItem => 'doi' in item;

export type ArticleResults = {
  items: ReadonlyArray<ArticleItem>,
  total: number,
  nextCursor: O.Option<string>,
};
