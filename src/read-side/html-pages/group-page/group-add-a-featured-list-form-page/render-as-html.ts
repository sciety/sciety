import { ViewModel } from './view-model';
import { HtmlPage, toHtmlPage } from '../../../../html-pages/html-page';
import { toHtmlFragment } from '../../../../types/html-fragment';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>${viewModel.pageHeading}</h1>
  </header>
  <form action="/forms/add-a-featured-list" method="post" class="standard-form">
    <section>
      <label for="listId" class="standard-form__sub_heading">List Id</label>
      <input type="text" id="listId" name="" value="">
    </section>
    <button type="submit">Save</button><a href="#" class="standard-form__cancel">Cancel</a>
  </form>
  `),
});
