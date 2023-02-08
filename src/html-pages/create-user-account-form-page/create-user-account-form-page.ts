import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';

export const createUserAccountFormPage: Page = {
  title: 'Create user account',
  content: toHtmlFragment(`
    <div class="create-user-account-form-wrapper">
    <h1>Create user account</h1>
    <form action="/forms/create-user-account" method="post" class="create-user-account-form">
      <label for="displayName" class="create-user-account-form__label">Display name</label>
      <input type="text" id="displayName" name="displayName" class="create-user-account-form__input">
      <label for="handle" class="create-user-account-form__label">Handle</label>
      <input type="text" id="handle" name="handle" class="create-user-account-form__input">
      <button id='createAccountButton'>Create account</button>
      <button type="reset">Clear form</button>
    </form>
    </div>
  `),
};
