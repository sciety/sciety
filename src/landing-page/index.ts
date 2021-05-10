import { toHtmlFragment } from '../types/html-fragment';

const content = toHtmlFragment(`
<div class="landing-page">

  <div class="landing-page__content">
    <h1 class="landing-page__content__title">
      The home of public preprint evaluation
    </h1>
    <p class="landing-page__content__byline">
      Open evaluation and curation together in one place.
      <br>
      Let Sciety help you navigate the preprint landscape.
    </p>
    <p class="landing-page__content__byline">Follow the journey through <a href="/blog">our blog</a>.</p>
  </div>

  <picture>
    <source srcset="/static/images/landing-page-illustration.svg" media="(min-width: 60.25em)">
    <img src="data:" alt="" class="landing-page__image">
  </picture>

</div>
`);

export const landingPage = {
  title: 'Sciety: the home of public preprint evaluation',
  content,
};
