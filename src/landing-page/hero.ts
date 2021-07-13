import { renderExampleSearches } from '../shared-components/render-example-searches';
import { toHtmlFragment } from '../types/html-fragment';

export const hero = toHtmlFragment(`
  <section class="landing-page-hero">
    <div class="landing-page-hero__content">
      <h1 class="landing-page-hero__content_title">
        Sciety: the home of public preprint evaluation
      </h1>
      <p class="landing-page-hero__content_byline">
        Open evaluation and curation together in one place.
        <br>
        Let Sciety help you navigate the preprint landscape.
      </p>
      <p class="landing-page-hero__content_byline">Follow the journey through <a href="/blog">our blog</a>.</p>
      <form class="landing-page-hero__search_form" action="/search" method="get">
        <input type="hidden" name="category" value="articles">
        <label for="searchText" class="visually-hidden">Search term</label>
        <input id="searchText" name="query" placeholder="Search for a topic of interest" class="landing-page-hero__search_text">
        <button type="submit" class="landing-page-hero__search_button">Search</button>
        <button type="reset" class="visually-hidden">Reset</button>
      </form>
      ${renderExampleSearches()}
    </div>

    <picture>
      <source srcset="/static/images/landing-page-illustration.svg" media="(min-width: 60.25em)">
      <img src="data:" alt="" class="landing-page-hero__image">
    </picture>
  </section>
`);
