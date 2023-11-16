import { htmlEscape } from 'escape-goat';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const showClearButtonIfInputIsPopulated = `
  def setClearButtonVisibility()
    if my value is not ''
      remove .visually-hidden from #clearSearchText
    else
      add .visually-hidden to #clearSearchText
  end
  init setClearButtonVisibility() end
  on input setClearButtonVisibility()
`;

const clearAndFocusInputOnClick = `
  init set @aria-label to 'Clear search text' end
  on click
    add .visually-hidden to me
    set #searchText@value to ''
    call #searchText.focus()
  end
`;

export const renderSearchForm = (query: string, evaluatedOnly: boolean): HtmlFragment => toHtmlFragment(`
  <form action="/search" method="get" class="search-form standard-form">
    <label for="searchText" class="search-form__text_input_label">Find preprints</label>
    <div class="standard-form__helper_text">
      Search articles by DOI, author or keyword.
    </div>
    <div class="search-form__positioning_context">
      ${htmlEscape`<input
        value="${query}" id="searchText" name="query" class="search-form__text" _="${showClearButtonIfInputIsPopulated}" >`}
      <section>
        <input type="checkbox" name="evaluatedOnly" value="true" id="searchEvaluatedOnlyFilter"${evaluatedOnly ? ' checked' : ''} >
        <label for="searchEvaluatedOnlyFilter" class="search-form__checkbox_label">Search only evaluated articles</label>
      </section>
      <button type="submit" class="search-form__submit" aria-label="Run the search">Search</button>
      <button type="reset" id="clearSearchText" class="search-form__clear visually-hidden" _="${clearAndFocusInputOnClick}">
        <img src="/static/images/clear-search-text-icon.svg" class="search-form__clear_icon" alt="">
      </button>
    </div>
  </form>
`);
