/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReadModel } from './handle-event';
import { SelectAllListsContainingArticle } from '../../shared-ports';
import * as LOID from '../../types/list-owner-id';
import { ListId } from '../../types/list-id';
import { UserId } from '../../types/user-id';

export const selectAllListsContainingArticle = (
  readModel: ReadModel,
): SelectAllListsContainingArticle => (articleId) => [{
  id: 'list-id-placeholder' as ListId,
  name: 'List name placeholder',
  description: '',
  articleIds: [],
  updatedAt: new Date(),
  ownerId: LOID.fromUserId('' as UserId),
}];
