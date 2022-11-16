import * as RA from 'fp-ts/ReadonlyArray';
import { GetOneArticleIdInEvaluatedState } from '../add-article-to-elife-subject-area-list';
import * as addArticleToElifeSubjectAreaList from '../add-article-to-elife-subject-area-list/read-model';
import { getArticleIdsByState } from '../add-article-to-elife-subject-area-list/read-model';
import { getOneArticleIdInEvaluatedState } from '../add-article-to-elife-subject-area-list/read-model/get-one-article-id-in-evaluated-state';
import { DomainEvent } from '../domain-events';
import { IsArticleOnTheListOwnedBy, SelectArticlesBelongingToList } from '../shared-ports';
import { GetArticleIdsByState } from '../shared-ports/get-article-ids-by-state';
import * as listsContent from '../shared-read-models/lists-content';
import { isArticleOnTheListOwnedBy, selectArticlesBelongingToList } from '../shared-read-models/lists-content';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type Dispatcher = {
  queries: {
    getArticleIdsByState: GetArticleIdsByState,
    getOneArticleIdInEvaluatedState: GetOneArticleIdInEvaluatedState,
    isArticleOnTheListOwnedBy: IsArticleOnTheListOwnedBy,
    selectArticlesBelongingToList: SelectArticlesBelongingToList,
  },
  dispatchToAllReadModels: DispatchToAllReadModels,
};

export const dispatcher = (): Dispatcher => {
  let addArticleToElifeSubjectAreaListReadModel = addArticleToElifeSubjectAreaList.initialState();
  let listsContentReadModel = listsContent.initialState();

  const dispatchToAllReadModels: DispatchToAllReadModels = (events) => {
    addArticleToElifeSubjectAreaListReadModel = RA.reduce(
      addArticleToElifeSubjectAreaListReadModel,
      addArticleToElifeSubjectAreaList.handleEvent,
    )(events);
    listsContentReadModel = RA.reduce(
      listsContentReadModel,
      listsContent.handleEvent,
    )(events);
  };

  const queries = {
    getArticleIdsByState: getArticleIdsByState(addArticleToElifeSubjectAreaListReadModel),
    getOneArticleIdInEvaluatedState: getOneArticleIdInEvaluatedState(addArticleToElifeSubjectAreaListReadModel),
    isArticleOnTheListOwnedBy: isArticleOnTheListOwnedBy(listsContentReadModel),
    selectArticlesBelongingToList: selectArticlesBelongingToList(listsContentReadModel),
  };

  return {
    queries,
    dispatchToAllReadModels,
  };
};
