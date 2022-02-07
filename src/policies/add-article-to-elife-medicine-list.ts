import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Ports as AddArticleToListPorts } from '../add-article-to-list';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Logger } from '../infrastructure/logger';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import * as Gid from '../types/group-id';

type FetchMedrvixSubjectArea = (articleId: Doi) => TE.TaskEither<DE.DataError, string>;

export type Ports = AddArticleToListPorts & {
  logger: Logger,
  fetchMedrvixSubjectArea: FetchMedrvixSubjectArea,
};

const elifeGroupId = Gid.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');

type AddArticleToElifeMedicineList = (ports: Ports) => (event: DomainEvent) => T.Task<void>;

export const addArticleToElifeMedicineList: AddArticleToElifeMedicineList = (ports) => (event) => {
  if (!isEvaluationRecordedEvent(event)) {
    return T.of(undefined);
  }
  if (event.groupId !== elifeGroupId) {
    return T.of(undefined);
  }

  return pipe(
    event.articleId,
    ports.fetchMedrvixSubjectArea,
    TE.match(
      () => { ports.logger('info', 'addArticleToElifeMedicineList policy: failed to fetch subject area', { articleId: event.articleId }); },
      () => undefined,
    ),
  );
};
