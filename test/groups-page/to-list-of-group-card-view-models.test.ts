import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded, groupCreated } from '../../src/domain-events';
import { Ports, toListOfGroupCardViewModels } from '../../src/groups-page/to-list-of-group-card-view-models';
import { arbitraryDate } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('to-list-of-group-card-view-models', () => {
  const mostActiveGroup = arbitraryGroup();
  const leastActiveGroup = arbitraryGroup();
  const inactiveGroup = arbitraryGroup();
  const ports: Ports = {
    getAllEvents: T.of([
      groupCreated(inactiveGroup),
      groupCreated(leastActiveGroup),
      groupCreated(mostActiveGroup),
      evaluationRecorded(leastActiveGroup.id, arbitraryDoi(), arbitraryReviewId(), arbitraryDate(), [], new Date('2019')),
      evaluationRecorded(mostActiveGroup.id, arbitraryDoi(), arbitraryReviewId(), arbitraryDate(), [], new Date('2021')),
    ]),
  };
  let groupNames: ReadonlyArray<string>;

  beforeEach(async () => {
    groupNames = await pipe(
      [inactiveGroup, leastActiveGroup, mostActiveGroup],
      toListOfGroupCardViewModels(ports),
      TE.map(RA.map((group) => group.name)),
      TE.getOrElse(shouldNotBeCalled),
    )();
  });

  it.skip('sorts the groups by latest activity date', () => {
    expect(groupNames).toStrictEqual([
      mostActiveGroup.name,
      leastActiveGroup.name,
      inactiveGroup.name,
    ]);
  });
});
