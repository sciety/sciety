import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';

export type GroupItem = {
  _tag: 'Group',
  id: GroupId,
};

export type ArticleItem = {
  _tag: 'Article',
  doi: Doi,
  title: string,
  authors: string,
  postedDate: Date,
};
