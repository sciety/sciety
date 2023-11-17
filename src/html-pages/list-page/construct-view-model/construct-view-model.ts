import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructContentWithPaginationViewModel } from './construct-content-with-pagination-view-model.js';
import { getOwnerInformation } from './get-owner-information.js';
import { userHasEditCapability } from './user-has-edit-capability.js';
import { ListId } from '../../../types/list-id.js';
import { UserId } from '../../../types/user-id.js';
import * as DE from '../../../types/data-error.js';
import { ArticleId } from '../../../types/article-id.js';
import { Dependencies } from './dependencies.js';
import { ViewModel } from '../view-model.js';
import { Params } from './params.js';

const getLoggedInUserIdFromParam = (user: O.Option<{ id: UserId }>) => pipe(
  user,
  O.map(({ id }) => id),
);

type ConstructContentViewModel = (
  articleIds: ReadonlyArray<string>,
  dependencies: Dependencies,
  params: Params,
  editCapability: boolean,
  listId: ListId,
) => TE.TaskEither<DE.DataError, ViewModel['content']>;

const constructContentViewModel: ConstructContentViewModel = (
  articleIds, dependencies, params, editCapability, listId,
) => pipe(
  articleIds,
  RA.map((articleId) => new ArticleId(articleId)),
  TE.right,
  TE.chainW(
    RA.match<TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', ViewModel['content']>, ArticleId>(
      () => TE.right('no-articles' as const),
      constructContentWithPaginationViewModel(dependencies, params.page, editCapability, listId),
    ),
  ),
  TE.orElse((left) => {
    if (left === 'no-articles-can-be-fetched') {
      return TE.right('no-articles-can-be-fetched' as const);
    }
    return TE.left(left);
  }),
);

export const constructViewModel = (
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params.id,
  dependencies.lookupList,
  O.map((list) => ({
    ...list,
    listId: list.id,
    basePath: `/lists/${list.id}`,
    articleCount: list.articleIds.length,
    listOwnerId: list.ownerId,
    relatedArticlesLink: list.articleIds.length > 0
      ? O.some(`https://labs.sciety.org/lists/by-id/${list.id}/article-recommendations?from-sciety=true`)
      : O.none,
    editCapability: userHasEditCapability(getLoggedInUserIdFromParam(params.user), list.ownerId),
    listPageAbsoluteUrl: new URL(`${process.env.APP_ORIGIN ?? 'https://sciety.org'}/lists/${list.id}`),
  })),
  O.map((partial) => ({
    ...partial,
    subscribeHref: partial.editCapability ? O.none : O.some(`/lists/${partial.listId}/subscribe`),
  })),
  O.chain((partial) => pipe(
    getOwnerInformation(dependencies)(partial.ownerId),
    O.map((ownerInformation) => ({
      ...ownerInformation,
      ...partial,
    })),
  )),
  TE.fromOption(() => DE.notFound),
  TE.chain((partialPageViewModel) => pipe(
    constructContentViewModel(
      partialPageViewModel.articleIds,
      dependencies,
      params,
      partialPageViewModel.editCapability,
      partialPageViewModel.listId,
    ),
    TE.map((content) => ({
      content,
      ...partialPageViewModel,
    })),
  )),
  TE.map((partial) => ({
    ...partial,
    showAnnotationSuccessBanner: params.success,
  })),
);
