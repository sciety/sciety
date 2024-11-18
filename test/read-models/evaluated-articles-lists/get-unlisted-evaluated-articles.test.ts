import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../src/domain-events';
import { getUnlistedEvaluatedArticles } from '../../../src/read-models/evaluated-articles-lists/get-unlisted-evaluated-articles';
import { handleEvent, initialState } from '../../../src/read-models/evaluated-articles-lists/handle-event';
import { ArticleId } from '../../../src/types/article-id';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../domain-events/evaluation-resource-events.helper';
import { arbitraryGroupJoinedEvent } from '../../domain-events/group-resource-events.helper';
import { arbitraryArticleAddedToListEvent, arbitraryListCreatedEvent, arbitraryListDeletedEvent } from '../../domain-events/list-resource-events.helper';

describe('get-unlisted-evaluated-articles', () => {
  const groupJoined = arbitraryGroupJoinedEvent();
  const listCreated = { ...arbitraryListCreatedEvent(), groupId: groupJoined.groupId };
  const evaluatedArticlesListSpecified = constructEvent('EvaluatedArticlesListSpecified')({ listId: listCreated.listId, groupId: groupJoined.groupId });
  const evaluationPublicationRecorded = {
    ...arbitraryEvaluationPublicationRecordedEvent(),
    groupId: groupJoined.groupId,
  };

  describe('when we record an evaluation for a group', () => {
    const events: ReadonlyArray<DomainEvent> = [
      groupJoined,
      listCreated,
      evaluatedArticlesListSpecified,
      evaluationPublicationRecorded,
    ];
    const readmodel = pipe(
      events,
      RA.reduce(initialState(), handleEvent),
    );
    const result = getUnlistedEvaluatedArticles(readmodel)();

    it('is returned as unlisted', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when a recorded evaluation for a group has been listed', () => {
    const articleAddedToList = {
      ...arbitraryArticleAddedToListEvent(),
      listId: listCreated.listId,
      articleId: new ArticleId(evaluationPublicationRecorded.articleId),
    };
    const events: ReadonlyArray<DomainEvent> = [
      groupJoined,
      listCreated,
      evaluatedArticlesListSpecified,
      evaluationPublicationRecorded,
      articleAddedToList,
    ];
    const readmodel = pipe(
      events,
      RA.reduce(initialState(), handleEvent),
    );
    const result = getUnlistedEvaluatedArticles(readmodel)();

    it('is not recorded as unlisted', () => {
      expect(result).toHaveLength(0);
    });
  });

  describe('when the evaluated articles list of a group gets removed', () => {
    const listRemoved = { ...arbitraryListDeletedEvent(), listId: listCreated.listId };
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
