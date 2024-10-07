import { htmlEscape } from 'escape-goat';
import { searchResultsPagePath } from '../../../../standards/paths';
import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const renderEvaluatedOnlyCheckbox = (evaluatedOnly: boolean) => `
  <section>
    <input type="checkbox" name="evaluatedOnly" value="true" id="searchEvaluatedOnlyFilter"${evaluatedOnly ? ' checked' : ''}>
    <label for="searchEvaluatedOnlyFilter" class="search-form__checkbox_label">Search only evaluated preprints</label>
  </section>
`;

const renderUnevaluatedPreprintsCheckbox = (includeUnevaluatedPreprints: boolean) => `
  <section>
    <label class="search-form__checkbox_label">
      <input type="checkbox" name="includeUnevaluatedPreprints" value="true" ${includeUnevaluatedPreprints ? ' checked' : ''}>
      Include preprints that haven't been evaluated yet
    </label>
  </section>
`;

const renderCheckbox = (evaluatedOnly: boolean) => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return renderUnevaluatedPreprintsCheckbox(!evaluatedOnly);
  }
  return renderEvaluatedOnlyCheckbox(evaluatedOnly);
};

export const renderSearchForm = (query: string, evaluatedOnly: boolean): HtmlFragment => toHtmlFragment(`
  <form action="${searchResultsPagePath}" method="get" class="search-form">
    <label for="searchText" class="search-form__label">
      Search preprints by DOI, author or keyword.
    </label>
    <div class="search-form__positioning_context">
      ${htmlEscape`<input value="${query}" id="searchText" name="query" class="standard-form__full_width_text_input">`}
      ${renderCheckbox(evaluatedOnly)}
      <button type="submit" class="search-form__submit" aria-label="Run the search">Search</button>
      <button type="reset" id="clearSearchText" class="search-form__clear visually-hidden">
        <img src="/static/images/clear-search-text-icon.svg" class="search-form__clear_icon" alt="">
      </button>
    </div>
  </form>
`);
