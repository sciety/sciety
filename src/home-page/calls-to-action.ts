import * as O from 'fp-ts/Option';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

const loginButtonIfNotLoggedIn = O.fold(
  () => '<a class="home-page-calls-to-action__login_button" href="/log-in">Log in</a>',
  () => '',
);

export const callsToAction = (user: O.Option<User>): HtmlFragment => toHtmlFragment(`
  <section class="home-page-calls-to-action">
    <h2 class="home-page-calls-to-action__title">Get started with Sciety</h2>
    <p class="home-page-call-to-action__text">Follow your first group, save interesting articles and keep up to date with the latest trends.</p>
    <div class="home-page-calls-to-action__buttons">
      ${loginButtonIfNotLoggedIn(user)}
      <a class="home-page-calls-to-action__subscribe_button" href="https://blog.sciety.org/subscribe">Subscribe for updates</a>
    </div>
    <p class="home-page-calls-to-action__byline">Follow the journey through <a href="/blog">our blog</a>.</p>
  </section>
`);
