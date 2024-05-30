import { ViewModel } from './view-model';
import { pathToSubmitAddAFeaturedList } from '../../../../http/form-submission-handlers/submit-paths';
import { inputFieldNames } from '../../../../standards';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../../html-page';

export const renderAsHtml = (viewModel: ViewModel): HtmlPage => toHtmlPage({
  title: viewModel.pageHeading,
  content: toHtmlFragment(`
  <header class="page-header">
    <h1>${viewModel.pageHeading}</h1>
  </header>
  <p>
    From here you can manage your group pages on Sciety.
    You are able to see this page as you are a designated representative for a Sciety group.
  </p>
  <p>
  <a href="#">View public group page</a>
  </p>
  <form action="${pathToSubmitAddAFeaturedList()}" method="post" class="standard-form">
    <section>
      <input type="hidden" name="forGroup" value="${viewModel.groupId}">
      <input type="hidden" name="successRedirectPath" value="${viewModel.successRedirectPath}">
      <label for="listId" class="standard-form__sub_heading">List Id</label>
      <input type="text" id="listId" name="${inputFieldNames.listId}" value="">
    </section>
    <button type="submit">Save</button><a href="#" class="standard-form__cancel">Cancel</a>
  </form>
  `),
});
