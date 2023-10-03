import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Doi } from '../../types/doi';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { renderAsHtml } from './render-as-html';
import * as LID from '../../types/list-id';

const doi = new Doi('10.1101/123456');
const listName = 'My test list';
const listId = LID.fromValidatedString('fake-list-id');

type SaveArticleFormPage = TE.TaskEither<RenderPageError, Page>;

export const saveArticleFormPage = (): SaveArticleFormPage => pipe(
  {
    articleId: doi,
    listId,
    listName,
  },
  renderAsHtml,
  TE.right,
);
