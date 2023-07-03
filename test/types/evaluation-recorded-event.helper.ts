import { EventOfType, constructEvent } from '../../src/domain-events';
import { Doi } from '../../src/types/doi';
import { EvaluationLocator } from '../../src/types/evaluation-locator';
import { GroupId } from '../../src/types/group-id';
import { EvaluationType } from '../../src/types/recorded-evaluation';

export const evaluationRecordedHelper = (
  groupId: GroupId,
  doi: Doi,
  evaluationLocator: EvaluationLocator,
  authors: ReadonlyArray<string>,
  publishedAt: Date,
  date: Date = new Date(),
  evaluationType?: EvaluationType,
): EventOfType<'EvaluationRecorded'> => constructEvent('EvaluationRecorded')({
  date,
  groupId,
  articleId: doi,
  evaluationLocator,
  publishedAt,
  authors,
  evaluationType,
});
