import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { evaluationTypes, EvaluationType } from '../../../src/domain-events/types/evaluation-type';
import { arbitraryNumber } from '../../helpers';

export const arbitraryEvaluationType = (): EvaluationType => pipe(
  evaluationTypes,
  R.collect(S.Ord)((key, value) => value),
  (arrayOfTypes) => arrayOfTypes[arbitraryNumber(0, arrayOfTypes.length - 1)],
);
