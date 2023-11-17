import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { isEventOfType, constructEvent } from '../../../domain-events/index.js';
import { ArticleId, eqArticleId } from '../../../types/article-id.js';
import { toErrorMessage } from '../../../types/error-message.js';
import { RecordSubjectAreaCommand } from '../../commands/index.js';
import { ResourceAction } from '../resource-action.js';

const buildUpArticleSubjectAreaResourceFor = (articleId: ArticleId) => flow(
  RA.filter(isEventOfType('SubjectAreaRecorded')),
  RA.filter((event) => eqArticleId.equals(event.articleId, articleId)),
  RA.head,
  O.map((event) => event.subjectArea),
);

export const recordSubjectArea: ResourceAction<RecordSubjectAreaCommand> = (command) => (events) => pipe(
  events,
  buildUpArticleSubjectAreaResourceFor(command.articleId),
  O.match(
    () => E.right([constructEvent('SubjectAreaRecorded')(command)]),
    (subjectArea) => (subjectArea === command.subjectArea
      ? E.right([])
      : E.left(toErrorMessage('changing of subject area not possible according to domain model'))),
  ),
);
