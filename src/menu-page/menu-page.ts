import { toHtmlFragment } from '../types/html-fragment';

export const menuPage = {
  title: 'Menu',
  content: toHtmlFragment(`
  <nav class="navigation-menu">
    <h1 class="navigation-menu__title">Menu</h1>
    <ul role="list" class="navigation-menu__links">
      <li><a href="/" class="navigation-menu__link navigation-menu__link--home"><span>Home</span></a></li>
      <li><a href="/about" class="navigation-menu__link navigation-menu__link--about"><span>About</span></a></li>
    </ul>
    <footer class="navigation-menu__footer">
      <a href="#feedback" class="navigation-menu__feedback_button">Feedback</a>
      <small class="navigation-menu__small_print">
        &copy; 2021 eLife Sciences Publications Ltd.
        <a href="/legal">Legal information</a>
      </small>
    </footer>
  </nav>
  `),
};
