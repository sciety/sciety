import { toHtmlFragment } from '../types/html-fragment';
import { ListId } from '../types/list-id';
import { Page } from '../types/page';

export type ViewModel = {
  listName: string,
  listDescription: string,
  listId: ListId,
};

export const renderEditListDetailsFormPage = (viewModel: ViewModel): Page => (
  {
    title: 'Edit list details',
    content: toHtmlFragment(`
<h1>Edit list details</h1>
<form action="/forms/edit-list-details" method="post" class="edit-list-details-form">
  <input type="hidden" value="${viewModel.listId}" name="listId">
  <label for="listName" class="edit-list-details-form__label">List name</label>
  <input type="text" id="listName" name="name" class="edit-list-details-form__field" value="${viewModel.listName}" pattern="[^<>]+" required>
  <label for="listDescription" class="edit-list-details-form__label">Description</label>
  <textarea id="listDescription" name="description" cols="30" rows="10" class="edit-list-details-form__field" placeholder="This is a description of my list. It tells you about the lists I have made." required>${viewModel.listDescription}</textarea>
  <p>Max 250 characters.</p>
  <a href="/lists/${viewModel.listId}">Cancel</a>
  <button>Save</button>
</form>
`),
  });
