import { listDescriptionMaxLength, listNameMaxLength } from '../commands/edit-list-details';
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
<header class="page-header page-header--edit-list-details-form-page">
  <h1>Edit list details</h1>
</header>
<form action="/forms/edit-list-details" method="post" class="edit-list-details-form">
  <input type="hidden" value="${viewModel.listId}" name="listId">
  <label for="listName" class="edit-list-details-form__label">List name</label>
  <input type="text" id="listName" name="name" class="edit-list-details-form__field" value="${viewModel.listName}" pattern="[^<>]+" required maxlength="${listNameMaxLength}">
  <p class="edit-list-details-form__constraints">Max ${listNameMaxLength} characters.</p>
  <label for="listDescription" class="edit-list-details-form__label">Description</label>
  <textarea id="listDescription" name="description" cols="30" rows="10" class="edit-list-details-form__field" placeholder="This is a description of my list. It tells you about the lists I have made." required maxlength="${listDescriptionMaxLength}">${viewModel.listDescription}</textarea>
  <p class="edit-list-details-form__constraints">Max ${listDescriptionMaxLength} characters.</p>
  <a href="/lists/${viewModel.listId}" class="edit-list-details-form__cancel">Cancel</a><button class="edit-list-details-form__save">Save</button>
</form>
`),
  });
