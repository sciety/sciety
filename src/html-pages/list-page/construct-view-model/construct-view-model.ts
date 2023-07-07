import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { constructContentWithPaginationViewModel } from './construct-content-with-pagination-view-model';
import { getOwnerInformation } from './get-owner-information';
import { userHasEditCapability } from './user-has-edit-capability';
import { ListId, listIdCodec } from '../../../types/list-id';
import { userIdCodec, UserId } from '../../../types/user-id';
import * as DE from '../../../types/data-error';
import { Doi } from '../../../types/doi';
import { Dependencies } from './dependencies';
import { ViewModel } from '../view-model';

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: listIdCodec,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Params = t.TypeOf<typeof paramsCodec>;

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
  RA.map((articleId) => new Doi(articleId)),
  TE.right,
  TE.chainW(
    RA.match<TE.TaskEither<DE.DataError | 'no-articles-can-be-fetched', ViewModel['content']>, Doi>(
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
  O.chain((list) => pipe(
    getOwnerInformation(dependencies)(list.ownerId),
    O.map((ownerInformation) => ({
      ...ownerInformation,
      ...list,
      listId: list.id,
      basePath: `/lists/${list.id}`,
      articleCount: list.articleIds.length,
      listOwnerId: list.ownerId,
      editCapability: userHasEditCapability(getLoggedInUserIdFromParam(params.user), list.ownerId),
      relatedArticlesLink: list.articleIds.length > 0
        ? O.some(`https://labs.sciety.org/lists/by-id/${list.id}/article-recommendations?from-sciety=true`)
        : O.none,
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
);
