import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isArticleAddedToListEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { Doi } from '../../types/doi';
import * as GroupId from '../../types/group-id';
import * as LID from '../../types/list-id';

export type MissingArticles = ReadonlyArray<Doi>;

export const handleEvent = (readmodel: MissingArticles, event: DomainEvent): MissingArticles => {
  if (isEvaluationRecordedEvent(event)) {
    if (event.groupId === GroupId.fromValidatedString('b560187e-f2fb-4ff9-a861-a204f3fc0fb0')) {
      return pipe(
        readmodel,
        RA.some((doi) => doi.value === event.articleId.value),
        B.match(
          () => pipe(
            readmodel,
            RA.append(event.articleId),
          ),
          () => readmodel,
        ),
      );
    }
  } else if (isArticleAddedToListEvent(event)) {
    if (event.listId === LID.fromValidatedString('3792ee73-6a7d-4c54-b6ee-0abc18cb8bc4')) {
      return pipe(
        readmodel,
        RA.filter((doi) => doi.value !== event.articleId.value),
      );
    }
  }
  return readmodel;
};
