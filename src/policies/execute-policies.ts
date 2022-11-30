import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Ports as AddArticleToEvaluatedArticlePorts, addArticleToEvaluatedArticlesList } from './add-article-to-evaluated-articles-list';
import {
  DomainEvent,
} from '../domain-events';

type PoliciesPorts = AddArticleToEvaluatedArticlePorts;

type ExecutePolicies = (ports: PoliciesPorts) => (event: DomainEvent) => T.Task<void>;

export const executePolicies: ExecutePolicies = (ports) => (event) => pipe(
  [
    addArticleToEvaluatedArticlesList(ports)(event),
  ],
  T.sequenceSeqArray,
  T.map(() => undefined),
);
