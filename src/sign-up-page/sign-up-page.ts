import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const signUpPage: Page = {
  title: 'Sign up',
  content: toHtmlFragment(`
    <header class="page-header">
      <h1>Sign up</h1>
    </header>
  `),
};
