import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { constructViewModel, Ports } from './construct-view-model';
import { renderEditListDetailsFormPage } from './render-edit-list-details-form-page';
import { ListIdFromString } from '../../types/list-id';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';

export const editListDetailsFormPageParamsCodec = t.type({
  id: ListIdFromString,
});

const renderNoSuchListError = (): RenderPageError => (
  {
    type: DE.notFound,
    message: toHtmlFragment('The list that you are trying to edit does not exist.'),
  }
);

export const editListDetailsFormPage = (adapters: Ports) => (
  params: { id: ListId },
): TE.TaskEither<RenderPageError, Page> => pipe(
  params.id,
  constructViewModel(adapters),
  E.bimap(
    renderNoSuchListError,
    renderEditListDetailsFormPage,
  ),
  TE.fromEither,
);
