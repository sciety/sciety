import { ArticleId } from '../../src/types/article-id.js';
import { ListId } from '../../src/types/list-id.js';
import { AddGroupCommand, CreateUserAccountCommand } from '../../src/write-side/commands/index.js';
import { callApi } from './call-api.helper.js';

export const addArticleToList = async (articleId: ArticleId, listId: ListId): ReturnType<typeof callApi> => callApi(
  'api/add-article-to-list',
  {
    articleId: articleId.value,
    listId,
  },
);

export const addGroup = async (command: AddGroupCommand): ReturnType<typeof callApi> => callApi('api/add-group', command);

export const createUser = async (command: CreateUserAccountCommand): ReturnType<typeof callApi> => callApi('api/create-user', command);
