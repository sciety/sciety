import { Doi } from '../../src/types/doi';
import { ListId } from '../../src/types/list-id';
import { AddGroupCommand, CreateUserAccountCommand } from '../../src/write-side/commands';
import { callApi } from './call-api.helper';

export const addArticleToList = async (articleId: Doi, listId: ListId): ReturnType<typeof callApi> => callApi(
  'api/add-article-to-list',
  {
    articleId: articleId.value,
    listId,
  },
);

export const addGroup = async (command: AddGroupCommand): ReturnType<typeof callApi> => callApi('api/add-group', command);

export const createUser = async (command: CreateUserAccountCommand): ReturnType<typeof callApi> => callApi('api/create-user', command);
