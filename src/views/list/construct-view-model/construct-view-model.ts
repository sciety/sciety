import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { constructContentWithPaginationViewModel } from './construct-content-with-pagination-view-model';
import { getOwnerName } from './get-owner-name';
import { listIdCodec } from '../../../types/list-id';
import * as DE from '../../../types/data-error';
import { ArticleId } from '../../../types/article-id';
import { Dependencies } from './dependencies';
import { ViewModel } from '../view-model';

export const paramsCodec = t.type({
  id: listIdCodec,
});

type Params = t.TypeOf<typeof paramsCodec>;

export const constructViewModel = (
  dependencies: Dependencies,
) => (params: Params): TE.TaskEither<DE.DataError, ViewModel> => pipe(
  params.id,
  dependencies.lookupList,
  O.chain((list) => pipe(
    list.ownerId,
    getOwnerName(dependencies),
    O.map((ownerName) => ({
      ownerName,
      name: list.name,
      updatedAt: list.updatedAt,
      articleIds: list.articleIds,
      listId: list.id,
      listPageAbsoluteUrl: new URL(`${process.env.APP_ORIGIN ?? 'https://sciety.org'}/lists/${list.id}`),
    })),
  )),
  TE.fromOption(() => DE.notFound),
  TE.chainTaskK((partialPageViewModel) => pipe(
    partialPageViewModel.articleIds,
    RA.map((articleId) => new ArticleId(articleId)),
    constructContentWithPaginationViewModel(dependencies, partialPageViewModel.listId),
    T.map(
      (articles) => ({
        articles,
        ...partialPageViewModel,
      }),
    ),
  )),
);
