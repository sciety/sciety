import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const searchPage: Page = {
  title: 'Search',
  content: toHtmlFragment(`
    <div class="page-content__background">
      <div class="sciety-grid sciety-grid--search-results">
        <header class="page-header page-header--search-results">
          <h1 class="page-heading--search">Search Sciety</h1>
        </header>
        <form action="/search" method="get" class="search-form">
          <input type="hidden" name="category" value="articles">
          <label for="searchText" class="visually-hidden">Search term</label>
          <input id="searchText" name="query" placeholder="Find articles and evaluating groups…" class="search-form__text">
          <button type="reset" id="clearSearchText" class="search-form__clear visually-hidden">
            <img src="/static/images/clear-search-text-icon.svg" class="search-form__clear_icon" alt="">
          </button>
          <button type="submit" class="visually-hidden">Search</button>
        </form>
      </div>
    </div>
  `),
};
