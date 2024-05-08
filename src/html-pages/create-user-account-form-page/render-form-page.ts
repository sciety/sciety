import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage, toHtmlPage } from '../html-page';
import { safelyReflectRawUserInputForEditing } from '../../shared-components/raw-user-input-renderers';
import { Recovery } from './recovery';
import { renderErrorSummary } from '../render-error-summary';

const renderFullNameInput = (recovery: Recovery) => {
  const inputWithLegend = pipe(
    recovery,
    O.map((r) => r.fullName.userInput),
    O.map(safelyReflectRawUserInputForEditing),
    O.getOrElse(() => ''),
    (value) => `
      <label for="fullName" class="create-user-account-form__label">Full name</label>
      <input type="text" id="fullName" name="fullName" placeholder="Alec Jeffreys" class="create-user-account-form__input" value="${value}">
    `,
  );
  return pipe(
    recovery,
    O.chain((r) => r.fullName.error),
    O.match(
      () => inputWithLegend,
      (message) => `
        <div class="standard-form__error">
          <p><span class="visually-hidden">Error: </span>${message}</p>
          ${inputWithLegend}
        </div>
      `,
    ),
  );
};

const renderHandleInput = (recovery: Recovery) => {
  const inputWithLegend = pipe(
    recovery,
    O.map((r) => r.handle.userInput),
    O.map(safelyReflectRawUserInputForEditing),
    O.getOrElse(() => ''),
    (value) => `
        <label for="handle" class="create-user-account-form__label">Create a handle</label>
        <div class='create-user-account-form__handle'>
          <span class='create-user-account-form__handle-url'>sciety.org/users/</span><input type="text" id="handle" name="handle" placeholder="ajeff18" class="create-user-account-form__input" value="${value}">
        </div>
  `,
  );
  return pipe(
    recovery,
    O.chain((r) => r.handle.error),
    O.match(
      () => inputWithLegend,
      (message) => `
        <div class="standard-form__error">
          <p><span class="visually-hidden">Error: </span>${message}</p>
          ${inputWithLegend}
        </div>
      `,
    ),
  );
};

const prefixTitleWithErrorDuringValidationRecovery = (recovery: Recovery, title: string) => `${O.isSome(recovery) ? 'Error: ' : ''}${title}`;

export const renderFormPage = (
  recovery: Recovery,
): HtmlPage => pipe(
  recovery,
  renderErrorSummary,
  (errorSummary) => toHtmlPage({
    title: prefixTitleWithErrorDuringValidationRecovery(recovery, 'Sign up'),
    content: toHtmlFragment(`
      <div class="create-user-account-form-wrapper">
        <header class="page-header">
          ${errorSummary}
          <h1>Sign up</h1>
        </header>
        <form action="/forms/create-user-account" method="post" class="create-user-account-form">
          <h2>Sign up &ndash; Step 2 of 2</h2>
          ${renderFullNameInput(recovery)}
          ${renderHandleInput(recovery)}
          <button id="createAccountButton" class="create-user-account-form__submit">Sign Up</button>
        </form>
      </div>
    `),
  }),
);
