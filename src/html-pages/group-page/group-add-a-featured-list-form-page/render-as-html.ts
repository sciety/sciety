import { ViewModel } from './view-model';
import { toHtmlFragment } from '../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../../html-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>${viewModel.pageHeading}</h1>
  </header>
  <form action="#" method="post" class="standard-form">
    <section>
      <label for="listId" class="standard-form__sub_heading">List Id</label>
      <input type="text" id="listId" name="" value="">
    </section>
    <button type="submit">Save</button><a href="#" class="standard-form__cancel">Cancel</a>
  </form>
  `),
});
