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

      <section class="home-page-hero__section">
        <h2 class="home-page-hero__subheading">Follow peer review groups</h2>
        <p>
          Researchers reviewing and curating the latest preprints.<br>
          <a href="/groups" class="home-page-hero__groups_link">Explore their work</a>
        </p>
      </section>

      <section class="home-page-hero__section">
        <h2 class="home-page-hero__subheading">Organise &amp; share with peers</h2>
        <p class="home-page-hero__above_button">Create an account to start sharing preprints with your community.</p>
        <a href="/sign-up" class="home-page-hero__sign_up_button">Sign Up</a>
      </section>
    </div>
  </section>
`);
