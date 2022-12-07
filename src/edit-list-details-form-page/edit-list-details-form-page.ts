import * as TE from 'fp-ts/TaskEither';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export const editListDetailsFormPage = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  params: unknown,
): TE.TaskEither<RenderPageError, Page> => TE.right({
  title: 'Edit details form',
  content: toHtmlFragment(`
<h1>My form</h1>
<form action="/forms/edit-list-details" method="post">
  <label for="listName">List name</label>
  <input type="text" id="listName" name="name">
  <input type="text" name="listId">
  <label for="listDescription">Description</label>
  <textarea id="listDescription" name="description" cols="30" rows="10" placeholder="This is a description of my list. It tells you about the lists I have made."></textarea>
  <p>Max 250 characters.</p>
  <button>Save</button>
</form>
`),
});
