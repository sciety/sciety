import { htmlEscape } from 'escape-goat';
import { searchResultsPagePath } from '../../../../standards/paths';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const renderUnevaluatedPreprintsCheckbox = (includeUnevaluatedPreprints: boolean) => `
  <section>
    <label class="search-form__checkbox_label">
      <input type="checkbox" name="includeUnevaluatedPreprints" value="true" ${includeUnevaluatedPreprints ? ' checked' : ''}>
      Include preprints that haven't been evaluated yet
    </label>
  </section>
`;

const renderCheckbox = (
  includeUnevaluatedPreprints: boolean,
) => renderUnevaluatedPreprintsCheckbox(includeUnevaluatedPreprints);

export const renderSearchForm = (query: string, includeUnevaluatedPreprints: boolean): HtmlFragment => toHtmlFragment(`
  <form action="${searchResultsPagePath}" method="get" class="search-form">
    <label for="searchText" class="search-form__label">
      Search preprints by DOI, author or keyword.
    </label>
    <div class="search-form__positioning_context">
      ${htmlEscape`<input value="${query}" id="searchText" name="query" class="standard-form__full_width_text_input">`}
      ${renderCheckbox(includeUnevaluatedPreprints)}
      <button type="submit" class="search-form__submit" aria-label="Run the search">Search</button>
      <button type="reset" id="clearSearchText" class="search-form__clear visually-hidden">
        <img src="/static/images/clear-search-text-icon.svg" class="search-form__clear_icon" alt="">
      </button>
    </div>
  </form>
`);
