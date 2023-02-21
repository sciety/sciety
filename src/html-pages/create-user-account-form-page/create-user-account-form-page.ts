import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as O from 'fp-ts/Option';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';

export const paramsCodec = t.type({
  errorSummary: tt.optionFromNullable(t.unknown),
});

type Params = t.TypeOf<typeof paramsCodec>;

const renderErrorSummary = (errorSummary: O.Option<unknown>) => pipe(
  errorSummary,
  O.match(
    () => '',
    () => `
    <h3>Something went wrong</h3>
    <p>Your handle must contain more than 3 characters and less than 15 characters.</p>
    `,
  ),
);

export const createUserAccountFormPage = (params: Params): TE.TaskEither<never, Page> => pipe(
  params.errorSummary,
  renderErrorSummary,
  (errorSummary) => TE.right({
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
          <input type="text" id="fullName" name="fullName" placeholder="Alec Jeffreys" class="create-user-account-form__input">
          <label for="handle" class="create-user-account-form__label">Create a handle</label>
          <div class='create-user-account-form__handle'>
            <span class='create-user-account-form__handle-url'>sciety.org/users/</span><input type="text" id="handle" name="handle" placeholder="ajeff18" class="create-user-account-form__input">
          </div>
          <button id="createAccountButton" class="create-user-account-form__submit">Sign Up</button>
        </form>
      </div>
    `),
  }),
);
