import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { constructContentWithPaginationViewModel } from './construct-content-with-pagination-view-model';
import { getOwnerInformation } from './get-owner-information';
import { ListId, listIdCodec } from '../../../types/list-id';
import { userIdCodec } from '../../../types/user-id';
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

type Params = t.TypeOf<typeof paramsCodec>;

type ConstructContentViewModel = (
  articleIds: ReadonlyArray<string>,
  dependencies: Dependencies,
  params: Params,
  listId: ListId,
) => TE.TaskEither<DE.DataError, ViewModel['content']>;

const constructContentViewModel: ConstructContentViewModel = (
  articleIds, dependencies, params, listId,
) => pipe(
  articleIds,
  RA.map((articleId) => new Doi(articleId)),
  constructContentWithPaginationViewModel(dependencies, params.page, listId),
  TE.mapLeft(() => DE.unavailable),
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
      listPageAbsoluteUrl: new URL(`${process.env.APP_ORIGIN ?? 'https://sciety.org'}/lists/${list.id}`),
      articleCount: list.articleIds.length,
      listOwnerId: list.ownerId,
    })),
  )),
  TE.fromOption(() => DE.notFound),
  TE.chain((partialPageViewModel) => pipe(
    constructContentViewModel(
      partialPageViewModel.articleIds,
      dependencies,
      params,
      partialPageViewModel.listId,
    ),
    TE.map((content) => ({
      content,
      ...partialPageViewModel,
    })),
  )),
);
