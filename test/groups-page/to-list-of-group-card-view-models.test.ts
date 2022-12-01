import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded, groupJoined } from '../../src/domain-events';
import { Ports, toListOfGroupCardViewModels } from '../../src/groups-page/to-list-of-group-card-view-models';
import { getGroup, handleEvent, initialState } from '../../src/shared-read-models/stateful-groups';
import { arbitraryDate } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('to-list-of-group-card-view-models', () => {
  const mostActiveGroup = arbitraryGroup();
  const leastActiveGroup = arbitraryGroup();
  const inactiveGroup = arbitraryGroup();
  const events = [
    groupJoined(inactiveGroup),
    groupJoined(leastActiveGroup),
    groupJoined(mostActiveGroup),
    evaluationRecorded(leastActiveGroup.id, arbitraryArticleId(), arbitraryReviewId(), [], new Date('2019'), arbitraryDate()),
    evaluationRecorded(mostActiveGroup.id, arbitraryArticleId(), arbitraryReviewId(), [], new Date('2021'), arbitraryDate()),
  ];
  const groupReadModelInstance = RA.reduce(initialState(), handleEvent)(events);

  const ports: Ports = {
    getAllEvents: T.of(events),
    selectAllListsOwnedBy: () => [],
    getGroup: getGroup(groupReadModelInstance),
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

  it('sorts the groups by latest activity date', () => {
    expect(groupNames).toStrictEqual([
      mostActiveGroup.name,
      leastActiveGroup.name,
      inactiveGroup.name,
    ]);
  });
});
