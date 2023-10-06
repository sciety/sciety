import { sanitise } from '../../types/sanitised-html-fragment';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage } from '../../types/html-page';
import { ArticleId } from '../../types/article-id';
import * as LID from '../../types/list-id';

import { renderPage } from '../create-annotation-form-page/render-page';

export const referencePage: HtmlPage = {
  title: 'Reference',
  content: toHtmlFragment(`
<style>
  ._style-guide-heading {
    font-family: monospace;
    margin-top: 3rem;
    margin-bottom: 3rem;
    margin-left: -3rem;
    background-color: wheat;
    color: teal;
    padding: 1.5rem 3rem;
  }
</style>
    <header class="page-header">
      <h1>Reference</h1>
    </header>
    <div>
      <h2 class="_style-guide-heading">Forms</h2>
      <h3 class="_style-guide-heading">Standard</h3>
      <form class="standard-form" method="post" action="#">
        <fieldset aria-describedby="saveArticlePageFormHelperTextForLists">
          <legend>
            Which list do you want to save this article to?
          </legend>
          <p id="saveArticlePageFormHelperTextForLists">Select one of your lists.</p>
          <div>
            <input type="radio" id="list-id-1" name="listId" value="1"/>
            <label for="list-id-1">List A</label>
          </div>
          <div>
            <input type="radio" id="list-id-2" name="listId" value="2"/>
            <label for="list-id-2">List B</label>
          </div>
          <div>
            <input type="radio" id="list-id-3" name="listId" value="3"/>
            <label for="list-id-3">List C</label>
          </div>
        </fieldset>
        <button type="submit">
          Submit
        </button>
      </form>
      <h3 class="_style-guide-heading">Create annotation</h3>
      ${renderPage({
    articleId: new ArticleId('10.1101/1234'),
    listId: LID.fromValidatedString('foo'),
    articleTitle: sanitise(toHtmlFragment('New Article')),
    listName: 'Someone\'s saved articles',
  })}
    </div>
  `),
};
