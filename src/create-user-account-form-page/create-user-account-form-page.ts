import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';

export const createUserAccountFormPage: Page = {
  title: 'Create user account',
  content: toHtmlFragment(`
    <h1>Create user account</h1>
    <form action="/forms/create-user-account" method="post">
      <label for="displayName">Display name</label>
      <input type="text" id="displayName" name="displayName">
      <label for="handle">Handle</label>
      <input type="text" id="handle" name="handle">
      <button>Create account</button>
      <button type="reset">Clear form</button>
    </form>
  `),
};
