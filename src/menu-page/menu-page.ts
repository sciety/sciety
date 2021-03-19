import { toHtmlFragment } from '../types/html-fragment';

export const menuPage = {
  title: 'Menu',
  content: toHtmlFragment(`
  <nav id="fly-out-menu" class="fly-out-menu">
    <h1 class="menu-title">Menu</h1>
    <ul role="list" class="fly-out-menu-list">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
    <footer class="fly-out-menu__footer">
      <a href="#feedback" class="button button--feedback">Feedback</a>
      <small>
        &copy; 2021 eLife Sciences Publications Ltd.
        <a href="/legal" class="fly-out-menu__footer__link">Legal information</a>
      </small>
    </footer>
  </nav>
  `),
};
