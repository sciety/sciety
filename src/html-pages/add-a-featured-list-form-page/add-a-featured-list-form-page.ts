import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { renderAddAFeaturedListFormPage } from './render-add-a-featured-list-form-page';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { HtmlPage } from '../html-page';

export const addAFeaturedListFormPageParamsCodec = t.type({});

export const addAFeaturedListFormPage = () => (): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  renderAddAFeaturedListFormPage(),
  TE.right,
);
