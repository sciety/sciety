import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { constructViewModel, Dependencies } from './construct-view-model.js';
import { renderEditListDetailsFormPage } from './render-edit-list-details-form-page.js';
import { listIdCodec, ListId } from '../../types/list-id.js';
import * as DE from '../../types/data-error.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { HtmlPage } from '../html-page.js';
import { ErrorPageBodyViewModel } from '../../types/render-page-error.js';

export const editListDetailsFormPageParamsCodec = t.type({
  id: listIdCodec,
});

const renderNoSuchListError = (): ErrorPageBodyViewModel => (
  {
    type: DE.notFound,
    message: toHtmlFragment('The list that you are trying to edit does not exist.'),
  }
);

export const editListDetailsFormPage = (dependencies: Dependencies) => (
  params: { id: ListId },
): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params.id,
  constructViewModel(dependencies),
  E.bimap(
    renderNoSuchListError,
    renderEditListDetailsFormPage,
  ),
  TE.fromEither,
);
