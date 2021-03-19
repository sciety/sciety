import { toHtmlFragment } from '../types/html-fragment';

export const menuPage = {
  title: 'Menu',
  content: toHtmlFragment(`
    <div>
      <h1>Menu</h1>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </div>
  `),
};
