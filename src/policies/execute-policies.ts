import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { addArticleToElifeSubjectAreaLists, Ports as AddArticleToElifeSubjectAreaListsPorts } from './add-article-to-elife-subject-area-lists';
import { Ports as AddArticleToEvaluatedArticlePorts, addArticleToEvaluatedArticlesList } from './add-article-to-evaluated-articles-list';
import { createUserSavedArticlesListAsGenericList, Ports as CreateUserSavedArticlesListAsGenericListPorts } from './create-user-saved-articles-list-as-generic-list';
import { replicateUserSavedArticlesListAsGenericList, Ports as ReplicateUserSavedArticlesListAsGenericListPorts } from './replicate-user-saved-articles-list-as-generic-list';
import {
  DomainEvent,
} from '../domain-events';

type PoliciesPorts = AddArticleToEvaluatedArticlePorts
& AddArticleToElifeSubjectAreaListsPorts
& CreateUserSavedArticlesListAsGenericListPorts
& ReplicateUserSavedArticlesListAsGenericListPorts;

type ExecutePolicies = (ports: PoliciesPorts) => (event: DomainEvent) => T.Task<void>;

export const executePolicies: ExecutePolicies = (ports) => (event) => pipe(
  [
    addArticleToEvaluatedArticlesList(ports)(event),
    addArticleToElifeSubjectAreaLists(ports)(event),
    createUserSavedArticlesListAsGenericList(ports)(event),
    replicateUserSavedArticlesListAsGenericList(ports)(event),
  ],
  T.sequenceSeqArray,
  T.map(() => undefined),
);
