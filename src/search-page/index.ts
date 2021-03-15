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
          <div>
            <button type="submit" class="visually-hidden">Search</button>
            <button type="reset" class="visually-hidden">Reset</button>
          </div>
        </form>
      </div>
    </div>
  `),
};
