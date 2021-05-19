import { toHtmlFragment } from '../../types/html-fragment';

export const callsToAction = toHtmlFragment(`
  <section class="landing-page-calls-to-action">
    <h2 class="landing-page-calls-to-action__title">Get started with Sciety</h2>
    <p class="landing-page-call-to-action__text">Follow your first group, save interesting articles and keep up to date with the latest trends.</p>
    <div class="landing-page-calls-to-action__buttons">
      <a class="landing-page-calls-to-action__login_button" href="/log-in">Log in</a>
      <a class="landing-page-calls-to-action__subscribe_button" href="https://blog.sciety.org/subscribe">Subscribe for updates</a>
    </div>
    <p class="landing-page-calls-to-action__byline">Follow the journey through <a href="/blog">our blog</a>.</p>
  </section>
`);
