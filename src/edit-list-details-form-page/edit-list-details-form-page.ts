import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { toHtmlFragment } from '../types/html-fragment';
import { ListId } from '../types/list-id';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export const editListDetailsFormPageParamsCodec = t.type({
  id: ListIdFromString,
});

type ViewModel = {
  name: string,
  id: ListId,
};

const renderEditListDetailsFormPage = (viewModel: ViewModel) => (
  {
    title: 'Edit details form',
    content: toHtmlFragment(`
<h1>My form</h1>
<form action="/forms/edit-list-details" method="post">
  <input type="hidden" value="${viewModel.id}" name="listId">
  <label for="listName">List name</label>
  <input type="text" id="listName" name="name" value="${viewModel.name}">
  <label for="listDescription">Description</label>
  <textarea id="listDescription" name="description" cols="30" rows="10" placeholder="This is a description of my list. It tells you about the lists I have made."></textarea>
  <p>Max 250 characters.</p>
  <button>Save</button>
</form>
`),
  });

const constructViewModel = (id: ListId) => ({
  name: '',
  id,
});

export const editListDetailsFormPage = (
  params: { id: ListId },
): TE.TaskEither<RenderPageError, Page> => pipe(
  params.id,
  constructViewModel,
  renderEditListDetailsFormPage,
  TE.right,
);
