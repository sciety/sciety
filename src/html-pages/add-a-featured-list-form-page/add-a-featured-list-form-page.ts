import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { constructViewModel } from './construct-view-model';
import { renderAddAFeaturedListFormPage } from './render-add-a-featured-list-form-page';
import * as DE from '../../types/data-error';
import { ErrorPageBodyViewModel, toErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { toHtmlFragment } from '../../types/html-fragment';
import { HtmlPage } from '../html-page';

export const addAFeaturedListFormPageParamsCodec = t.type({
  slug: t.string,
});

const renderNoSuchGroupError = (): ErrorPageBodyViewModel => toErrorPageBodyViewModel(
  {
    type: DE.notFound,
    message: toHtmlFragment('The group does not exist.'),
  },
);

export const addAFeaturedListFormPage = () => (): TE.TaskEither<ErrorPageBodyViewModel, HtmlPage> => pipe(
  constructViewModel(),
  E.bimap(
    renderNoSuchGroupError,
    renderAddAFeaturedListFormPage,
  ),
  TE.fromEither,
);
