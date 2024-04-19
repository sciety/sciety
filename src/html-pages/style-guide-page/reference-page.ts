import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../html-page';

export const referencePage: HtmlPage = toHtmlPage({
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
          <legend class="standard-form__sub_heading">
            Standard form fieldset legend
          </legend>
          <div class="standard-form__labelled_selectable_control">
            <input type="radio" id="item-a" name="listId" value="1"/>
            <label for="item-a">Item A</label>
          </div>
          <div class="standard-form__labelled_selectable_control">
            <input type="radio" id="item-b" name="listId" value="2"/>
            <label for="item-b">Item B</label>
          </div>
          <div class="standard-form__labelled_selectable_control">
            <input type="radio" id="item-c" name="listId" value="3"/>
            <label for="item-c">Item C</label>
          </div>
        </fieldset>
        <section>
          <label for="standardFormInput">Standard form label</label>
          <input type="text" name="" id="standardFormInput" />
        </section>
        <section>
          <label for="annotationContent" class="standard-form__sub_heading">Standard form sub heading <span class="standard-form__sub_heading_secondary_text">(Less important text)</span></label>
          <p class="standard-form__helper_text">Standard form helper text</p>
          <textarea id="annotationContent" name="annotationContent" rows="10"></textarea>
          <p class="standard-form__constraints">Standard form constraints text</p>
        </section>
        <button type="submit">
          Submit
        </button><a href="#" class="standard-form__cancel">Cancel</a>
      </form>
      <h3 class="_style-guide-heading">Error summary</h3>
      <div role='alert' class='error-summary'>
        <h3>Something went wrong</h3>
        <p>
          Please check the following:
        </p>
        <ul>
          <li>Your full name and handle must not contain any of &quot;,&lt;,&gt;</li>
          <li>Your full name must be 1-30 characters long</li>
          <li>Your handle must be 4-15 characters long</li>
          <li>Your handle must not be in use by anyone else</li>
        </ul>
      </div>
    </div>
  `),
});
