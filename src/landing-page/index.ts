import { toHtmlFragment } from '../types/html-fragment';

const content = toHtmlFragment(`
<div class="landing-page">

  <div class="landing-page-hero">
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
    </div>

    <picture>
      <source srcset="/static/images/landing-page-illustration.svg" media="(min-width: 60.25em)">
      <img src="data:" alt="" class="landing-page-hero__image">
    </picture>
  </div>

  <div class="landing-page-calls-to-action">
    <h2 class="landing-page-calls-to-action__title">Get started with Sciety</h2>
    <p>Follow your first group, save interesting articles and keep up to date with the latest trends.</p>
    <div>
      <a class="landing-page-calls-to-action__login_button" href="/log-in">Log in</a>
      <a class="landing-page-calls-to-action__subscribe_button" href="https://blog.sciety.org/subscribe">Subscribe for updates</a>
    </div>
  </div>
</div>
`);

export const landingPage = {
  title: 'Sciety: the home of public preprint evaluation',
  content,
};
