import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { getUnlistedEvaluatedArticles } from '../../../src/read-models/evaluated-articles-lists/get-unlisted-evaluated-articles';
import { handleEvent, initialState } from '../../../src/read-models/evaluated-articles-lists/handle-event';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { arbitraryListCreatedEvent, arbitraryListDeletedEvent } from '../../domain-events/list-resource-events.helper';

describe('get-unlisted-evaluated-articles', () => {
  describe('when the evaluated articles list of a group gets removed', () => {
    const groupJoined = arbitraryGroupJoinedEvent();
    const listCreated = { ...arbitraryListCreatedEvent(), groupId: groupJoined.groupId };
    const evaluatedArticlesListSpecified = constructEvent('EvaluatedArticlesListSpecified')({ listId: listCreated.listId, groupId: groupJoined.groupId });
    const listRemoved = { ...arbitraryListDeletedEvent(), listId: listCreated.listId };
    const evaluationPublicationRecorded = {
      ...arbitraryEvaluationPublicationRecordedEvent(),
      groupId: groupJoined.groupId,
    };
    const events: ReadonlyArray<DomainEvent> = [
      groupJoined,
      listCreated,
      evaluatedArticlesListSpecified,
      evaluationPublicationRecorded,
      listRemoved,
    ];
    const readmodel = pipe(
      events,
      RA.reduce(initialState(), handleEvent),
    );
    const result = getUnlistedEvaluatedArticles(readmodel)();

    it.failing('ignores evaluations by the group', () => {
      expect(result).toHaveLength(0);
    });
  });
});
