import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { constructViewModel, Dependencies } from './construct-view-model';
import { renderEditListDetailsFormPage } from './render-edit-list-details-form-page';
import { listIdCodec, ListId } from '../../types/list-id';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage } from '../../types/html-page';
import { RenderPageError } from '../../types/render-page-error';

export const editListDetailsFormPageParamsCodec = t.type({
  id: listIdCodec,
});

const renderNoSuchListError = (): RenderPageError => (
  {
    type: DE.notFound,
    message: toHtmlFragment('The list that you are trying to edit does not exist.'),
  }
);

export const editListDetailsFormPage = (dependencies: Dependencies) => (
  params: { id: ListId },
): TE.TaskEither<RenderPageError, HtmlPage> => pipe(
  params.id,
  constructViewModel(dependencies),
  E.bimap(
    renderNoSuchListError,
    renderEditListDetailsFormPage,
  ),
  TE.fromEither,
);
