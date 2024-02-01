import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

import * as PH from '../../src/types/publishing-history';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryPaperExpression } from './paper-expression.helper';
import { ExpressionDoi } from '../../src/types/expression-doi';
import { arbitraryExpressionDoi } from './expression-doi.helper';

type ArbitraryPublishingHistoryOnlyPreprints = (overrides?: { earliestExpressionDoi?: ExpressionDoi })
=> PH.PublishingHistory;

export const arbitraryPublishingHistoryOnlyPreprints: ArbitraryPublishingHistoryOnlyPreprints = (
  overrides = { earliestExpressionDoi: arbitraryExpressionDoi() },
) => pipe(
  [
    {
      ...arbitraryPaperExpression(),
      expressionType: 'preprint',
      expressionDoi: overrides.earliestExpressionDoi ?? arbitraryExpressionDoi(),
      publishedAt: new Date('2000-01-01'),
    },
    {
      ...arbitraryPaperExpression(),
      expressionType: 'preprint',
      publishedAt: new Date('2020-01-01'),
    },
  ],
  PH.fromExpressions,
  E.getOrElseW(shouldNotBeCalled),
);
