import { sequenceS } from 'fp-ts/Apply';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { Params } from './params';
import { ViewModel } from './view-model';
import * as DE from '../../../types/data-error';
import * as EDOI from '../../../types/expression-doi';
import { toHtmlFragment } from '../../../types/html-fragment';
import * as LOID from '../../../types/list-owner-id';
import { UserId } from '../../../types/user-id';

type ConstructViewModel = (
  dependencies: Dependencies,
  userId: UserId,
) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (dependencies, userId) => (params) => pipe(
  {
    frontMatter: pipe(
      params.articleId.value,
      EDOI.fromValidatedString,
      dependencies.fetchExpressionFrontMatter,
    ),
    userLists: pipe(
      userId,
      LOID.fromUserId,
      dependencies.selectAllListsOwnedBy,
      TE.right,
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
