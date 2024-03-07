import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../html-page';
import { Params } from './params';
import { RawUserInput, rawUserInput } from '../../read-side';
import { safelyReflectRawUserInputForEditing } from '../../shared-components/raw-user-input-renderers';

const renderErrorSummary = (errorSummary: O.Option<unknown>) => pipe(
  errorSummary,
  O.match(
    () => '',
    () => `
    <div role='alert' class='error-summary'>
      <h3>Something went wrong</h3>
      <p>
      Please check the following:
      </p>
        <ul>
        <li>Your full name and handle must not contain any of &quot;,&lt;,&gt;</li>
        <li>Your full name must be 1-30 characters long</li>
        <li>Your handle must be 4-15 characters long</li>
        <li>Your handle must not be in use by anyone else</li>
        </ul>
    </div>
    `,
  ),
);

export const renderFormPage = (
  fullName: RawUserInput,
  handle: RawUserInput,
) => (params: Params): HtmlPage => pipe(
  params.errorSummary,
  renderErrorSummary,
  (errorSummary) => toHtmlPage({
    title: 'Sign up',
    content: toHtmlFragment(`
      <div class="create-user-account-form-wrapper">
        <header class="page-header">
          ${errorSummary}
          <h1>Sign up</h1>
        </header>
        <form action="/forms/create-user-account" method="post" class="create-user-account-form">
          <h2>Sign up &ndash; Step 2 of 2</h2>
          <label for="fullName" class="create-user-account-form__label">Full name</label>
          <input type="text" id="fullName" name="fullName" placeholder="Alec Jeffreys" class="create-user-account-form__input" value="${safelyReflectRawUserInputForEditing(fullName)}">
          <label for="handle" class="create-user-account-form__label">Create a handle</label>
          <div class='create-user-account-form__handle'>
            <span class='create-user-account-form__handle-url'>sciety.org/users/</span><input type="text" id="handle" name="handle" placeholder="ajeff18" class="create-user-account-form__input" value="${safelyReflectRawUserInputForEditing(handle)}">
          </div>
          <button id="createAccountButton" class="create-user-account-form__submit">Sign Up</button>
        </form>
      </div>
    `),
  }),
);

export const createUserAccountFormPage = (params: Params): TE.TaskEither<never, HtmlPage> => pipe(
  params,
  renderFormPage(rawUserInput(''), rawUserInput('')),
  TE.right,
);
