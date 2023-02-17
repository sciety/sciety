import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';

export const createUserAccountFormPage: Page = {
  title: 'Sign up',
  content: toHtmlFragment(`
    <div class="create-user-account-form-wrapper">
      <header class="page-header">
        <h1>Sign up</h1>
      </header>
      <form action="/forms/create-user-account" method="post" class="create-user-account-form">
        <h2>Sign up &ndash; Step 2 of 2</h2>
        <label for="fullName" class="create-user-account-form__label">Full name</label>
        <input type="text" id="fullName" name="fullName" placeholder="Ada Lovelace" class="create-user-account-form__input">
        <label for="handle" class="create-user-account-form__label">Create a handle</label>
        <input type="text" id="handle" name="handle" placeholder="ada_lovelace42" class="create-user-account-form__input">
        <button id="createAccountButton" class="create-user-account-form__submit">Sign Up</button>
        <button type="reset" class="create-user-account-form__reset">Clear form</button>
      </form>
    </div>
  `),
};
