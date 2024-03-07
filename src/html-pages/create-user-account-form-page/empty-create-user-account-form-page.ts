import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { HtmlPage } from '../html-page';
import { Params } from './params';
import { rawUserInput } from '../../read-side';
import { renderFormPage } from './render-form-page';

export const emptyCreateUserAccountFormPage = (params: Params): TE.TaskEither<never, HtmlPage> => pipe(
  params,
  renderFormPage(rawUserInput(''), rawUserInput('')),
  TE.right,
);
