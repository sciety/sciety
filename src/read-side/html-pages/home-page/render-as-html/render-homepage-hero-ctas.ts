import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';

const renderSearchForm = () => `
  <form class="home-page-hero-search-form" action="/search" method="get">
    <label for="searchText" class="home-page-hero-search-form__label">Start your search using keywords, author names or DOIs</label>
    <div class="home-page-hero-search-form__visible_interactive_elements">
      <input id="searchText" name="query" class="home-page-hero-search-form__text">
      <button type="submit" class="home-page-hero-search-form__button">Search</button>
    </div>
    <button type="reset" class="visually-hidden">Reset</button>
    <input type="hidden" name="evaluatedOnly" value="true">
  </form>
`;

const renderBrowseByCategoryLink = () => '<a class="home-page-hero-browse-by-category-link" href="/search">Browse by category</a>';

export const renderHomepageHeroCtas = (): HtmlFragment => toHtmlFragment(`
  <div class="home-page-hero__ctas">
    ${renderSearchForm()}
    <span>or</span>
    ${renderBrowseByCategoryLink()}
  </div>
`);
