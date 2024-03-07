import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { HtmlPage } from '../html-page';
import { renderFormPage } from './render-form-page';

export const emptyCreateUserAccountFormPage = (): TE.TaskEither<never, HtmlPage> => pipe(
  O.none,
  renderFormPage,
  TE.right,
);
