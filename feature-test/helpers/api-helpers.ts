import { Doi } from '../../src/types/doi';
import { Group } from '../../src/types/group';
import { ListId } from '../../src/types/list-id';
import { UserDetails } from '../../src/types/user-details';
import { callApi } from './call-api.helper';

export const addArticleToList = async (articleId: Doi, listId: ListId) => callApi(
  'api/add-article-to-list',
  {
    articleId: articleId.value,
    listId,
  },
);

export const addGroup = async (group: Group) => callApi('api/add-group', {
  ...group,
  groupId: group.id,
});

export const createUser = async (userDetails: UserDetails) => callApi('api/create-user', {
  ...userDetails,
  userId: userDetails.id,
});
