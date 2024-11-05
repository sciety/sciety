import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { CompleteHtmlDocument } from './complete-html-document';
import { toErrorPageViewModel } from './construct-error-page-view-model';
import { constructHtmlResponse } from './construct-html-response';
import { ClientClassification } from './shared-components/head';
import { renderStandardPageLayout } from './shared-components/standard-page-layout';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';
import { DependenciesForViews } from '../dependencies-for-views';

export const toDefaultErrorHtmlDocument = (
  dependencies: DependenciesForViews,
  loggedInUserId: O.Option<UserId>,
  errorMessage: string,
  clientClassification: ClientClassification,
): CompleteHtmlDocument => {
  const userDetails = pipe(
    loggedInUserId,
    O.chain((id) => dependencies.lookupUser(id)),
  );
  return pipe(
    constructHtmlResponse(userDetails, renderStandardPageLayout, clientClassification)(E.left(toErrorPageViewModel({
      message: toHtmlFragment(errorMessage),
      type: DE.unavailable,
    }))).document,
  );
};
