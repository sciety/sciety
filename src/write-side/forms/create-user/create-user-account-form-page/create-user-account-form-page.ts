import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { ConstructPage } from '../../../../html-pages/construct-page';
import { toHtmlFragment } from '../../../../types/html-fragment';
import { HtmlPage } from '../../../../types/html-page';
import { CreateUserAccountFormRecovery } from './create-user-account-form-recovery';

const renderErrorSummary = (recovery: CreateUserAccountFormRecovery) => pipe(
  recovery,
  O.map(R.map((r) => r.error)),
  O.map(R.compact),
  O.map(R.toArray),
  O.map(RA.map(([key, error]) => `<li><a href="#${key}">${error}</a></li>`)),
  O.map(RA.match(
    () => '',
    (errors) => `
    <div role='alert' class='error-summary'>
      <h3>There is a problem</h3>
      <ul>
      ${errors.join('\n')}
      </ul>
    </div>
    `,
  )),
  O.getOrElse(() => ''),
);

const renderFullNameInput = (recovery: CreateUserAccountFormRecovery) => {
  const inputWithLegend = pipe(
    recovery,
    O.map((r) => r.fullName.userInput),
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

const renderHandleInput = (recovery: CreateUserAccountFormRecovery) => {
  const inputWithLegend = pipe(
    recovery,
    O.map((r) => r.handle.userInput),
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
    O.chain((vm) => vm.handle.error),
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

const pageHeader = 'Sign up';

export const renderFormPage = (recovery: CreateUserAccountFormRecovery): HtmlPage => ({
  title: `${O.isSome(recovery) ? 'Error: ' : ''}${pageHeader}`,
  content: toHtmlFragment(`
    <div class="create-user-account-form-wrapper">
      <header class="page-header">
        ${renderErrorSummary(recovery)}
        <h1>${pageHeader}</h1>
      </header>
      <form action="/forms/create-user-account" method="post" class="create-user-account-form">
        <h2>Sign up &ndash; Step 2 of 2</h2>
        ${renderFullNameInput(recovery)}
        ${renderHandleInput(recovery)}
        <button id="createAccountButton" class="create-user-account-form__submit">Sign Up</button>
      </form>
    </div>
  `),
});

export const createUserAccountFormPage: ConstructPage = (): TE.TaskEither<never, HtmlPage> => pipe(
  O.none,
  renderFormPage,
  TE.right,
);
