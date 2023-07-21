import { EventOfType, constructEvent } from '../../src/domain-events';
import { Doi } from '../../src/types/doi';
import { EvaluationLocator } from '../../src/types/evaluation-locator';
import { GroupId } from '../../src/types/group-id';
import { EvaluationType } from '../../src/types/recorded-evaluation';
import { arbitraryDate } from '../helpers';
import { arbitraryDoi } from './doi.helper';
import { arbitraryEvaluationLocator } from './evaluation-locator.helper';
import { arbitraryEvaluationType } from './evaluation-type.helper';
import { arbitraryGroupId } from './group-id.helper';

export const arbitraryEvaluationRecordedEvent = (): EventOfType<'EvaluationRecorded'> => constructEvent('EvaluationRecorded')({
  groupId: arbitraryGroupId(),
  articleId: arbitraryDoi(),
  evaluationLocator: arbitraryEvaluationLocator(),
  authors: [],
  publishedAt: arbitraryDate(),
  date: arbitraryDate(),
  evaluationType: arbitraryEvaluationType(),
});

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
