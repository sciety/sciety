import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded, groupJoined } from '../../../src/domain-events';
import { Ports, toListOfGroupCardViewModels } from '../../../src/html-pages/groups-page/to-list-of-group-card-view-models';
import { getGroup, handleEvent, initialState } from '../../../src/shared-read-models/groups';
import { arbitraryDate } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('to-list-of-group-card-view-models', () => {
  const mostActiveGroup = arbitraryGroup();
  const leastActiveGroup = arbitraryGroup();
  const inactiveGroup = arbitraryGroup();
  const events = [
    groupJoined(
      inactiveGroup.id,
      inactiveGroup.name,
      inactiveGroup.avatarPath,
      inactiveGroup.descriptionPath,
      inactiveGroup.shortDescription,
      inactiveGroup.homepage,
      inactiveGroup.slug,
    ),
    groupJoined(
      leastActiveGroup.id,
      leastActiveGroup.name,
      leastActiveGroup.avatarPath,
      leastActiveGroup.descriptionPath,
      leastActiveGroup.shortDescription,
      leastActiveGroup.homepage,
      leastActiveGroup.slug,
    ),
    groupJoined(
      mostActiveGroup.id,
      mostActiveGroup.name,
      mostActiveGroup.avatarPath,
      mostActiveGroup.descriptionPath,
      mostActiveGroup.shortDescription,
      mostActiveGroup.homepage,
      mostActiveGroup.slug,
    ),
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
