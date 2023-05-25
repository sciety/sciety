import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

const renderSearchForm = () => `
  <form class="home-page-hero-search-form" action="/search" method="get">
    <label for="searchText" class="home-page-hero-search-form__label">Search for keywords, groups or DOIs</label>
    <div class="home-page-hero-search-form__visible_interactive_elements">
      <input id="searchText" name="query" class="home-page-hero-search-form__text">
      <button type="submit" class="home-page-hero-search-form__button">Search</button>
    </div>
    <button type="reset" class="visually-hidden">Reset</button>
    <input type="hidden" name="evaluatedOnly" value="true">
    <input type="hidden" name="category" value="articles">
  </form>
`;

export const hero: HtmlFragment = toHtmlFragment(`
  <section class="home-page-hero-wrapper">
    <div class="home-page-hero">
      <h1 class="home-page-hero__content_title">
        The home of preprint evaluation
      </h1>
      <p class="home-page-hero__content_byline">
        Find preprints reviewed and recommended by trusted groups of researchers.
      </p>

      <section class="home-page-hero__section">
        ${renderSearchForm()}
      </section>
    </div>
  </section>
`);
