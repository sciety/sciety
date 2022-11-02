import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { elifeGroupId, getCorrespondingListId } from '../add-article-to-elife-subject-area-list/read-model';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { AddArticleToList, Logger } from '../shared-ports';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { SubjectArea } from '../types/subject-area';

type GetBiorxivOrMedrxivSubjectArea = (articleId: Doi) => TE.TaskEither<DE.DataError, SubjectArea>;

export type Ports = {
  logger: Logger,
  getBiorxivOrMedrxivSubjectArea: GetBiorxivOrMedrxivSubjectArea,
  addArticleToList: AddArticleToList,
};

type AddArticleToElifeSubjectAreaLists = (ports: Ports) => (event: DomainEvent) => T.Task<void>;

export const addArticleToElifeSubjectAreaLists: AddArticleToElifeSubjectAreaLists = (ports) => (event) => {
  if (!isEvaluationRecordedEvent(event)) {
    return T.of(undefined);
  }
  if (event.groupId !== elifeGroupId) {
    return T.of(undefined);
  }

  return pipe(
    event.articleId,
    ports.getBiorxivOrMedrxivSubjectArea,
    TE.bimap(
      () => 'Subject Area available from neither bioRxiv nor medRxiv',
      ({ value }) => value,
    ),
    TE.chain((subjectArea) => pipe(
      subjectArea,
      getCorrespondingListId,
      O.foldW(
        () => {
          ports.logger('info', 'addArticleToElifeSubjectAreaLists policy: unsupported subject area', { event, subjectArea });
          return TE.right(undefined);
        },
        (listId) => ports.addArticleToList({ articleId: event.articleId, listId }),
      ),
    )),
    TE.match(
      (errorMessage) => { ports.logger('error', 'addArticleToElifeSubjectAreaLists policy failed', { articleId: event.articleId, errorMessage }); },
      () => {},
    ),
  );
};
