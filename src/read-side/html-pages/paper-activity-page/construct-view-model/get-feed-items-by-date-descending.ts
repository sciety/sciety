import { sequenceS } from 'fp-ts/Apply';
import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { toEvaluationPublishedFeedItem } from './to-evaluation-published-feed-item';
import { toExpressionPublishedFeedItem } from './to-expression-published-feed-item';
import * as EDOI from '../../../../types/expression-doi';
import * as PH from '../../../../types/publishing-history';
import { constructEvaluationHistory } from '../../../construct-evaluation-history';
import { CassyniSeminarPublishedFeedItem, FeedItem } from '../view-model';

const byDate: Ord.Ord<FeedItem> = pipe(
  D.Ord,
  Ord.contramap((event) => event.publishedAt),
);

const byDateDescending: Ord.Ord<FeedItem> = pipe(
  byDate,
  Ord.reverse,
);

const constructCassyniSeminarFeedItems = (
  history: PH.PublishingHistory,
): ReadonlyArray<CassyniSeminarPublishedFeedItem> => {
  if (PH.getAllExpressionDois(history).includes(EDOI.fromValidatedString('10.46471/gigabyte.137'))) {
    return [{
      type: 'cassyni-seminar-published',
      publishedAt: new Date('2024-10-24'),
      doiLink: 'https://doi.org/10.52843/cassyni.y1p61f',
      videoLink: 'https://cassyni.com/events/6ttAf8cL1ruzkWZznh5Xed?t=1516s',
      imageUrl: 'https://api.cassyni.com/api/videos/MH5YFnwYt2VpYChF8Jj9EE/poster?embedded=false',
      title: 'New bioinformatics resources from The International Cannabis Genome Research Consortium',
      reviewedPaperDoi: EDOI.fromValidatedString('10.46471/gigabyte.137'),
    }];
  }
  if (PH.getAllExpressionDois(history).includes(EDOI.fromValidatedString('10.1101/2023.12.19.572354'))) {
    return [{
      type: 'cassyni-seminar-published',
      publishedAt: new Date('2025-04-08'),
      doiLink: 'https://doi.org/10.52843/cassyni.06hwvh',
      videoLink: 'https://cassyni.com/events/RfbzkzjvuLjxHYQb4AJdh7',
      imageUrl: 'https://api.cassyni.com/api/videos/QQ4UNboVbmQojiWFt4Xv2r/poster?embedded=false&play_button=false',
      title: 'Network-based anomaly detection algorithm reveals proteins with major roles in human tissues',
      reviewedPaperDoi: EDOI.fromValidatedString('10.1101/2023.12.19.572354'),
    }];
  }
  if (PH.getAllExpressionDois(history).includes(EDOI.fromValidatedString('10.1590/scielopreprints.6611'))) {
    return [{
      type: 'cassyni-seminar-published',
      publishedAt: new Date('2025-04-22'),
      doiLink: 'https://doi.org/10.52843/cassyni.007cq8',
      videoLink: 'https://cassyni.com/events/iAC1qrycdt6HYcF9sdAUV',
      imageUrl: 'https://api.cassyni.com/api/videos/XYZijr6z2irhZeXkhXc1Ga/poster?embedded=false&play_button=false',
      title: 'Author Insight on How to Publish Vectors of Human Disease Data with GBIF and GigaByte',
      reviewedPaperDoi: EDOI.fromValidatedString('10.1590/scielopreprints.6611'),
    }];
  }
  return [];
};

type GetFeedItemsByDateDescending = (dependencies: Dependencies)
=> (history: PH.PublishingHistory)
=> T.Task<ReadonlyArray<FeedItem>>;

export const getFeedItemsByDateDescending: GetFeedItemsByDateDescending = (
  dependencies,
) => (
  history,
) => pipe(
  ({
    evaluations: pipe(
      constructEvaluationHistory(dependencies, history),
      T.traverseArray(toEvaluationPublishedFeedItem(dependencies)),
    ),
    expressions: pipe(
      history,
      PH.getAllExpressions,
      RA.map(toExpressionPublishedFeedItem),
      T.of,
    ),
  }),
  sequenceS(T.ApplyPar),
  T.map((items) => [...items.evaluations, ...items.expressions, ...constructCassyniSeminarFeedItems(history)]),
  T.map(RA.sort(byDateDescending)),
);
