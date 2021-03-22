import { toHtmlFragment } from '../types/html-fragment';

export const menuPage = {
  title: 'Menu',
  content: toHtmlFragment(`
  <nav class="navigation-menu">
    <h1 class="navigation-menu__title">Menu</h1>
    <ul role="list">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
    <footer>
      <a href="#feedback" class="button button--feedback">Feedback</a>
      <small class="navigation-menu__small_print">
        &copy; 2021 eLife Sciences Publications Ltd.
        <a href="/legal">Legal information</a>
      </small>
    </footer>
  </nav>
  `),
};
