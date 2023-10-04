import { toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { HtmlPage } from '../../types/html-page';

export type ViewModel = {
  listName: string,
  listDescription: string,
  listId: ListId,
  listNameMaxLength: number,
  listDescriptionMaxLength: number,
};

export const renderEditListDetailsFormPage = (viewModel: ViewModel): HtmlPage => (
  {
    title: 'Edit list details',
    content: toHtmlFragment(`
<header class="page-header page-header--edit-list-details-form-page">
  <h1>Edit list details</h1>
</header>
<form action="/forms/edit-list-details" method="post" class="edit-list-details-form">
  <input type="hidden" value="${viewModel.listId}" name="listId">
  <section class="edit-list-details-form__section">
    <label for="listName" class="edit-list-details-form__label">List name</label>
    <p class="edit-list-details-form__helper_text">Give the list a descriptive title.</p>
    <input type="text" id="listName" name="name" class="edit-list-details-form__field" value="${viewModel.listName}" pattern="[^<>]+" required maxlength="${viewModel.listNameMaxLength}">
    <p class="edit-list-details-form__constraints">Maximum ${viewModel.listNameMaxLength} characters</p>
  </section>
  <section class="edit-list-details-form__section">
    <label for="listDescription" class="edit-list-details-form__label">Description (optional)</label>
    <p class="edit-list-details-form__helper_text">Add further context to help readers understand your list.</p>
    <textarea id="listDescription" name="description" cols="30" rows="5" class="edit-list-details-form__field" maxlength="${viewModel.listDescriptionMaxLength}">${viewModel.listDescription}</textarea>
    <p class="edit-list-details-form__constraints">Maximum ${viewModel.listDescriptionMaxLength} characters</p>
  </section>
  <button class="edit-list-details-form__save">Save</button><a href="/lists/${viewModel.listId}" class="edit-list-details-form__cancel">Cancel</a>
</form>
`),
  });
