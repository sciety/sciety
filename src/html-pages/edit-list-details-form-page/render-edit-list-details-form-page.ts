import { htmlEscape } from 'escape-goat';
import { toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';
import { HtmlPage } from '../html-page';

export type ViewModel = {
  listName: string,
  listDescription: string,
  listId: ListId,
  listHref: string,
  listNameMaxLength: number,
  listDescriptionMaxLength: number,
  pageHeading: string,
};

export const renderEditListDetailsFormPage = (viewModel: ViewModel): HtmlPage => (
  {
    title: viewModel.pageHeading,
    content: toHtmlFragment(`
<header class="page-header page-header--edit-list-details-form-page">
  <h1>${viewModel.pageHeading}</h1>
</header>
<form action="/forms/edit-list-details" method="post" class="edit-list-details-form standard-form">
  <input type="hidden" value="${viewModel.listId}" name="listId">
  <section>
    <label for="listName" class="standard-form__sub_heading">List name</label>
    <p class="standard-form__helper_text">Give the list a descriptive title.</p>
    <input type="text" id="listName" name="name" value="${htmlEscape(viewModel.listName)}" pattern="[^<>]+" required maxlength="${viewModel.listNameMaxLength}">
    <p class="standard-form__constraints">Maximum ${viewModel.listNameMaxLength} characters</p>
  </section>
  <section>
    <label for="listDescription" class="standard-form__sub_heading">Description <span class="standard-form__sub_heading_secondary_text">(optional)</span></label>
    <p class="standard-form__helper_text">Add further context to help readers understand your list.</p>
    <textarea id="listDescription" name="description" rows="5" maxlength="${viewModel.listDescriptionMaxLength}">${htmlEscape(viewModel.listDescription)}</textarea>
    <p class="standard-form__constraints">Maximum ${viewModel.listDescriptionMaxLength} characters</p>
  </section>
  <button type="submit">Save</button><a href="${viewModel.listHref}" class="edit-list-details-form__cancel">Cancel</a>
</form>
`),
  });
