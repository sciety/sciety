import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { addArticleToElifeMedicineList, Ports as AddArticleToElifeMedicineListPorts } from './add-article-to-elife-medicine-list';
import { Ports as AddArticleToEvaluatedArticlePorts, addArticleToEvaluatedArticlesList } from './add-article-to-evaluated-articles-list';
import {
  RuntimeGeneratedEvent,
} from '../domain-events';

type PoliciesPorts = AddArticleToEvaluatedArticlePorts & AddArticleToElifeMedicineListPorts;

type ExecutePolicies = (ports: PoliciesPorts) => (event: RuntimeGeneratedEvent) => T.Task<void>;

export const executePolicies: ExecutePolicies = (ports) => (event) => pipe(
  [
    addArticleToEvaluatedArticlesList(ports)(event),
    addArticleToElifeMedicineList(ports)(event),
  ],
  T.sequenceArray,
  T.map(() => undefined),
);
