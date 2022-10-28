import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { AddArticleToList, Logger } from '../shared-ports';
import { elifeGroupId, mappingOfBiorxivAndMedrxivSubjectAreasToELifeLists } from '../shared-read-models/elife-articles-missing-from-subject-area-lists';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import * as Lid from '../types/list-id';

type GetBiorxivOrMedrxivSubjectArea = (articleId: Doi) => TE.TaskEither<DE.DataError, string>;

export type Ports = {
  logger: Logger,
  getBiorxivOrMedrxivSubjectArea: GetBiorxivOrMedrxivSubjectArea,
  addArticleToList: AddArticleToList,
};

type AddArticleToElifeSubjectAreaLists = (ports: Ports) => (event: DomainEvent) => T.Task<void>;

const getCorrespondingListId = (subjectArea: string): O.Option<Lid.ListId> => pipe(
  mappingOfBiorxivAndMedrxivSubjectAreasToELifeLists,
  R.lookup(subjectArea),
  O.map(Lid.fromValidatedString),
);

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
    TE.mapLeft(() => 'Subject Area available from neither bioRxiv nor medRxiv'),
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
