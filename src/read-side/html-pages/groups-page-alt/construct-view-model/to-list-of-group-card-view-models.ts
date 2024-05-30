import * as D from 'fp-ts/Date';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import * as DE from '../../../../types/data-error';
import { Group } from '../../../../types/group';
import { constructGroupCard, GroupCardViewModel } from '../../shared-components/group-card';

const byLatestActivity: Ord.Ord<GroupCardViewModel> = pipe(
  O.getOrd(D.Ord),
  Ord.reverse,
  Ord.contramap((group) => (group.latestActivityAt)),
);

type ToListOfGroupCardViewModels = (dependencies: Dependencies)
=> (groups: ReadonlyArray<Group>)
=> TE.TaskEither<DE.DataError, ReadonlyArray<GroupCardViewModel>>;

export const toListOfGroupCardViewModels: ToListOfGroupCardViewModels = (dependencies) => flow(
  RA.map((group) => group.id),
  E.traverseArray(constructGroupCard(dependencies)),
  E.map(RA.sort(byLatestActivity)),
  T.of,
);
