import { toHtmlFragment } from '../types/html-fragment';
import { ListId } from '../types/list-id';
import { Page } from '../types/page';

export type ViewModel = {
  name: string,
  id: ListId,
};

export const renderEditListDetailsFormPage = (viewModel: ViewModel): Page => (
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
