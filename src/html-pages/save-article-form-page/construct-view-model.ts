import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { sequenceS } from 'fp-ts/Apply';
import * as LOID from '../../types/list-owner-id.js';
import { Dependencies } from './dependencies.js';
import { Params } from './params.js';
import { ViewModel } from './view-model.js';
import * as DE from '../../types/data-error.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import * as EDOI from '../../types/expression-doi.js';

type ConstructViewModel = (dependencies: Dependencies) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies) => (params) => pipe(
  {
    frontMatter: pipe(
      params.articleId.value,
      EDOI.fromValidatedString,
      dependencies.fetchExpressionFrontMatter,
    ),
    userLists: pipe(
      params.user,
      O.map((user) => user.id),
      O.map(LOID.fromUserId),
      O.map(dependencies.selectAllListsOwnedBy),
      TE.fromOption(() => {
        dependencies.logger('error', 'Tried to save an article, but no user is available');
        return DE.unavailable;
      }),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.map((partial) => ({
    article: {
      name: partial.frontMatter.title,
      id: params.articleId,
    },
    userLists: partial.userLists,
    pageHeading: toHtmlFragment('Save an article to your list'),
  } satisfies ViewModel)),
);
