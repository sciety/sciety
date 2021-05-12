import { toHtmlFragment } from '../types/html-fragment';

const content = toHtmlFragment(`
<div class="landing-page">

  <section class="landing-page-hero">
    <div class="landing-page-hero__content">
      <h1 class="landing-page-hero__content__title">
        The home of public preprint evaluation
      </h1>
      <p class="landing-page-hero__content__byline">
        Open evaluation and curation together in one place.
        <br>
        Let Sciety help you navigate the preprint landscape.
      </p>
      <p class="landing-page-hero__content__byline">Follow the journey through <a href="/blog">our blog</a>.</p>
      <form action="/search" method="get">
        <label for="searchText" class="visually-hidden">Search term</label>
        <input id="searchText" name="query" placeholder="Search for a topic of interest" class="landing-page-hero__search_text">
        <button type="reset" class="visually-hidden">Reset</button>
        <button type="submit" class="visually-hidden">Search</button>
      </form>
    </div>

    <picture>
      <source srcset="/static/images/landing-page-illustration.svg" media="(min-width: 60.25em)">
      <img src="data:" alt="" class="landing-page-hero__image">
    </picture>
  </section>

  <section class="landing-page-personas">
    <h2 class="landing-page-personas__title">Where effort meets impact</h2>
    <div class="landing-page-personas__content">
      <div class="landing-page-personas__persona">
        <img src="/static/images/landing-persona-readers.svg" alt="" class="landing-page-personas__image">
        <p>Quickly find relevant content and spend more time reading what you care about.</p>
      </div>
      <div class="landing-page-personas__persona">
        <img src="/static/images/landing-persona-groups.svg" alt="" class="landing-page-personas__image">
        <p>Share your group's insights to grow your readership and keep the community informed.</p>
      </div>
    </div>
  </section>

  <section class="landing-page-calls-to-action">
    <h2 class="landing-page-calls-to-action__title">Get started with Sciety</h2>
    <p class="landing-page-call-to-action__text">Follow your first group, save interesting articles and keep up to date with the latest trends.</p>
    <div class="landing-page-calls-to-action__buttons">
      <a class="landing-page-calls-to-action__login_button" href="/log-in">Log in</a>
      <a class="landing-page-calls-to-action__subscribe_button" href="https://blog.sciety.org/subscribe">Subscribe for updates</a>
    </div>
  </section>
</div>
`);

export const landingPage = {
  title: 'Sciety: the home of public preprint evaluation',
  content,
};
