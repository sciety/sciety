import { HtmlFragment, toHtmlFragment } from '../../../../types/html-fragment';
import { ViewModel } from '../view-model';

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

const renderBrowseByCategoryCallToAction = () => {
  if (process.env.EXPERIMENT_ENABLED === 'true') {
    return '<a href="/search">Browse by subject category</a>';
  }
  return '';
};

export const renderHero = (viewModel: ViewModel): HtmlFragment => toHtmlFragment(`
  <section class="home-page-hero-wrapper">
    <img class="home-page-hero__left_image" src="/static/images/home-page/sciety-pattern-left.svg" alt=""/>
    <div class="home-page-hero">
      <h1 class="home-page-hero__content_title">
        ${viewModel.pageHeading}
      </h1>
      <p class="home-page-hero__content_byline">
        Join the global network discovering and highlighting important new studies.
      </p>

      <section class="home-page-hero__section">
        ${renderSearchForm()}
        ${renderBrowseByCategoryCallToAction()}
      </section>
    </div>
    <img class="home-page-hero__right_image" src="/static/images/home-page/sciety-pattern-right.svg" alt=""/>
  </section>
`);
