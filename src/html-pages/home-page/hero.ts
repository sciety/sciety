import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

const renderSearchForm = () => `
  <form class="home-page-hero-search-form" action="/search" method="get">
    <input type="hidden" name="category" value="articles">
    <label for="searchText" class="visually-hidden">Search term</label>
    <input id="searchText" name="query" class="home-page-hero-search-form__text">
    <input type="hidden" name="evaluatedOnly" value="true">
    <button type="submit" class="home-page-hero-search-form__button">Search</button>
    <button type="reset" class="visually-hidden">Reset</button>
  </form>
`;

export const hero: HtmlFragment = toHtmlFragment(`
  <section class="home-page-hero">
    <div class="home-page-hero__left_wrapper">
      <h1 class="home-page-hero__content_title">
        The home of public preprint evaluation
      </h1>
      <p class="home-page-hero__content_byline">
        Explore and curate evaluated preprints.
      </p>

      <section class="home-page-hero__section">
        <h2 class="home-page-hero__subheading">Find evaluated preprints</h2>
        ${renderSearchForm()}
      </section>
    </div>
  </section>
`);
