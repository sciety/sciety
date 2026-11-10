import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { AtprotoMention } from '../../../../types/atproto-mention';
import * as EDOI from '../../../../types/expression-doi';
import * as PH from '../../../../types/publishing-history';
import { AtprotoMentionPublishedFeedItem } from '../view-model';

const enabledForExpressionDois = [
  EDOI.fromValidatedString('10.1101/2024.12.06.627200'),
];

const isEnabledFor = (history: PH.PublishingHistory) => pipe(
  history,
  PH.getAllExpressionDois,
  RA.some((expressionDoi) => RA.elem(EDOI.eqExpressionDoi)(expressionDoi)(enabledForExpressionDois)),
);

const toFeedItem = (mention: AtprotoMention): AtprotoMentionPublishedFeedItem => ({
  type: 'atproto-mention-published',
  publishedAt: mention.createdAt,
  source: mention.source,
  authorHandle: mention.authorHandle,
  text: mention.text,
  href: mention.href,
});

export const constructAtprotoMentionFeedItems = (
  dependencies: Dependencies,
  history: PH.PublishingHistory,
): T.Task<ReadonlyArray<AtprotoMentionPublishedFeedItem>> => (
  isEnabledFor(history)
    ? pipe(
      history,
      dependencies.fetchAtprotoMentions,
      TE.map(RA.map(toFeedItem)),
      TE.getOrElseW(() => T.of([])),
    )
    : T.of([])
);
