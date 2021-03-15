import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const searchPage: Page = {
  title: 'Search',
  content: toHtmlFragment(`
    <div class="search-results-page__background--filler">
      <div class="sciety-grid sciety-grid--search-results">
        <header class="page-header page-header--search-results">
          <h1 class="page-heading--search">Search sciety</h1>
        </header>
        <form action="/articles" method="get" class="search-form">
          <label for="searchText" class="visually-hidden">Search term</label>
          <input id="searchText" name="query" placeholder="Discover new evaluations…" class="search-form__text">
          <button type="reset" id="clearSearchText" class="search-form__clear visually-hidden">
            <img src="/static/images/clear-search-text-icon.svg" class="search-form__clear_icon" alt="">
          </button>
          <button type="submit" class="visually-hidden">Search</button>
        </form>
      </div>
    </div>
  `),
};
