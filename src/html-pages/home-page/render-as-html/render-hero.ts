import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';

const renderSearchForm = () => `
  <form class="home-page-hero-search-form" action="/search" method="get">
    <label for="searchText" class="home-page-hero-search-form__label">Search for keywords, authors or DOIs</label>
    <div class="home-page-hero-search-form__visible_interactive_elements">
      <input id="searchText" name="query" class="home-page-hero-search-form__text">
      <button type="submit" class="home-page-hero-search-form__button">Search</button>
    </div>
    <button type="reset" class="visually-hidden">Reset</button>
    <input type="hidden" name="evaluatedOnly" value="true">
  </form>
`;

export const renderHero = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <section class="home-page-hero-wrapper">
    <img class="home-page-hero__left_image" src="/static/images/home-page/sciety-pattern-left.svg" alt=""/>
    <div class="home-page-hero">
      <h1 class="home-page-hero__content_title">
        ${viewModel.pageHeading}
      </h1>
      <p class="home-page-hero__content_byline">
        Find preprints recommended and reviewed by trusted groups of researchers.
      </p>

      <section class="home-page-hero__section">
        ${renderSearchForm()}
      </section>
    </div>
    <img class="home-page-hero__right_image" src="/static/images/home-page/sciety-pattern-right.svg" alt=""/>
  </section>
`);
