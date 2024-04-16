import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { constructViewModel, Dependencies } from './construct-view-model';
import { renderEditListDetailsFormPage } from './render-edit-list-details-form-page';
import * as DE from '../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../types/html-fragment';
import { listIdCodec, ListId } from '../../types/list-id';
import { HtmlPage } from '../html-page';

export const editListDetailsFormPageParamsCodec = t.type({
  id: listIdCodec,
});

const renderNoSuchListError = (): ErrorPageBodyViewModel => toErrorPageBodyViewModel(
  {
    type: DE.notFound,
    message: toHtmlFragment('The list that you are trying to edit does not exist.'),
  },
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
