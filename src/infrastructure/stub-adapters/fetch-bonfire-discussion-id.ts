import * as TE from 'fp-ts/TaskEither';
import { ExternalQueries } from '../../third-parties';
import * as DE from '../../types/data-error';
import {
  CanonicalExpressionDoi, eqExpressionDoi, ExpressionDoi, fromValidatedString,
} from '../../types/expression-doi';

const isAppropriateDoi = (
  expressionDoi: ExpressionDoi,
) => (doiToBeChecked: ExpressionDoi): boolean => eqExpressionDoi.equals(doiToBeChecked, expressionDoi);

export const fetchBonfireDiscussionId: ExternalQueries['fetchBonfireDiscussionId'] = (expressionDoi: CanonicalExpressionDoi) => (isAppropriateDoi(expressionDoi)(fromValidatedString('10.7554/elife.95814.3')) ? TE.right('1234') : TE.left(DE.unavailable));
