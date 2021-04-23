import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';

export type GroupItem = {
  _tag: 'Group',
  id: GroupId,
};

export type ArticleItem = {
  _tag: 'Article',
  doi: Doi,
  server: ArticleServer,
  title: SanitisedHtmlFragment,
  authors: ReadonlyArray<string>,
  postedDate: Date,
};
