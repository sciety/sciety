import * as O from 'fp-ts/Option';
import { GroupId } from '../types/group-id';
import { ListId } from '../types/list-id';

export type GetEvaluatedArticlesListIdForGroup = (groupId: GroupId) => O.Option<ListId>;
