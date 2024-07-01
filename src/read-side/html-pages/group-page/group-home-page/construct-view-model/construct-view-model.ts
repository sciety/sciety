import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructFeaturedLists } from './construct-featured-lists';
import { constructFeed } from './construct-feed';
import { constructHeader } from './construct-header';
import { Params } from './params';
import * as DE from '../../../../../types/data-error';
import { ConstructViewModel } from '../../../construct-view-model';
import { ViewModel } from '../view-model';

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  dependencies.getGroupBySlug(params.slug),
  O.map(constructHeader(dependencies, params.user)),
  TE.fromOption(() => DE.notFound),
  TE.chain((header) => pipe(
    constructFeed(dependencies, header.group, 10, params.page),
    TE.map((feed) => ({
      header,
      group: header.group,
      featuredLists: constructFeaturedLists(dependencies, header.group.id),
      feed,
    })),
  )),
);
