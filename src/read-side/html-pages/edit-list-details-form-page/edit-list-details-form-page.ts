import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { constructViewModel, Dependencies } from './construct-view-model';
import { renderEditListDetailsFormPage } from './render-edit-list-details-form-page';
import { ErrorPageBodyViewModel } from '../../../types/error-page-body-view-model';
import { listIdCodec, ListId } from '../../../types/list-id';
import { HtmlPage } from '../html-page';
import { renderErrorPage } from '../render-error-page';

export const editListDetailsFormPageParamsCodec = t.type({
  id: listIdCodec,
});

export const editListDetailsFormPage = (dependencies: Dependencies) => (
  params: { id: ListId },
): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  params.id,
  constructViewModel(dependencies),
  E.bimap(
    renderErrorPage,
    renderEditListDetailsFormPage,
  ),
  TE.fromEither,
);
