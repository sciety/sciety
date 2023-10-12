import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage } from '../../types/html-page';

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
        <dl>
          <dt>Article</dt>
          <dd>The protective function of an immunity protein against the
            <i>cis</i>
            -toxic effects of a
            <i>Xanthomonas</i>
            Type IV Secretion System Effector</dd>
          <dt>List</dt>
          <dd>My reading list</dd>
        </dl>
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
        <section>
          <label for="standardFormInput">Standard form label</label>
          <input type="text" name="" id="standardFormInput" />
        </section>
        <section>
          <label for="annotationContent" class="standard-form__sub_heading">Standard form sub heading</label>
          <p class="standard-form__helper_text">Standard form helper text</p>
          <textarea id="annotationContent" name="annotationContent" rows="10"></textarea>
          <p class="standard-form__constraints">Standard form constraints text</p>
        </section>
        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  `),
};
