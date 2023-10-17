import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage } from '../../types/html-page';
import { UserGeneratedInput } from '../../types/user-generated-input';
import { ViewModel } from './view-model';
import { ConstructPage } from '../construct-page';

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

export const renderFormPage = (viewModel: ViewModel): HtmlPage => ({
  title: viewModel.pageHeader,
  content: toHtmlFragment(`
    <div class="create-user-account-form-wrapper">
      <header class="page-header">
        ${renderErrorSummary(viewModel.errorSummary)}
        <h1>${viewModel.pageHeader}</h1>
      </header>
      <form action="/forms/create-user-account" method="post" class="create-user-account-form">
        <h2>Sign up &ndash; Step 2 of 2</h2>
        <label for="fullName" class="create-user-account-form__label">Full name</label>
        <input type="text" id="fullName" name="fullName" placeholder="Alec Jeffreys" class="create-user-account-form__input" value="${viewModel.fullName}">
        <label for="handle" class="create-user-account-form__label">Create a handle</label>
        <div class='create-user-account-form__handle'>
          <span class='create-user-account-form__handle-url'>sciety.org/users/</span><input type="text" id="handle" name="handle" placeholder="ajeff18" class="create-user-account-form__input" value="${viewModel.handle}">
        </div>
        <button id="createAccountButton" class="create-user-account-form__submit">Sign Up</button>
      </form>
    </div>
  `),
});

const emptyFormViewModel: ViewModel = {
  pageHeader: 'Sign up',
  errorSummary: O.none,
  handle: '' as UserGeneratedInput,
  fullName: '' as UserGeneratedInput,
  validationRecovery: O.none,
};

export const createUserAccountFormPage: ConstructPage = (): TE.TaskEither<never, HtmlPage> => pipe(
  emptyFormViewModel,
  renderFormPage,
  TE.right,
);
