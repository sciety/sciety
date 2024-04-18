import { ViewModel } from './construct-view-model';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../html-page';

export const renderAddAFeaturedListFormPage = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: 'Add a featured list form for a group',
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>Add a featured list form for a ${viewModel.groupName}</h1>
  </header>
  <form action="#" method="post" class="standard-form">
    <section>
      <label for="listId" class="standard-form__sub_heading">List Id</label>
      <input type="text" id="listId" name="" value="">
    </section>
    <button type="submit">Save</button><a href="#">Cancel</a>
  </form>
  `),
});
