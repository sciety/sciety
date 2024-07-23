import { callApi } from './call-api.helper';
import { ExpressionDoi } from '../../src/types/expression-doi';
import { ListId } from '../../src/types/list-id';
import { AddGroupCommand, CreateUserAccountCommand } from '../../src/write-side/commands';

export const addArticleToList = async (
  expressionDoi: ExpressionDoi,
  listId: ListId,
): ReturnType<typeof callApi> => callApi(
  'api/add-article-to-list',
  {
    expressionDoi,
    listId,
  },
);

export const addGroup = async (command: AddGroupCommand): ReturnType<typeof callApi> => callApi('api/add-group', command);

export const createUser = async (command: CreateUserAccountCommand): ReturnType<typeof callApi> => callApi('api/create-user', command);
