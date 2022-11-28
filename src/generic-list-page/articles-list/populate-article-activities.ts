import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { getActivityForDois } from '../../shared-read-models/article-activity/get-activity-for-dois';
import { ArticleActivity } from '../../types/article-activity';
import { Doi } from '../../types/doi';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

type PopulateArticleActivities = (ports: Ports)
=> (dois: ReadonlyArray<Doi>)
=> T.Task<ReadonlyArray<ArticleActivity>>;

export const populateArticleActivities: PopulateArticleActivities = (ports) => (dois) => pipe(
  ports.getAllEvents,
  T.map(getActivityForDois(dois)),
);
