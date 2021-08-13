import { sequenceS } from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderCardsSection } from './render-cards-section';
import { Ports, userListCard } from './user-list-card';
import { HtmlFragment } from '../../types/html-fragment';
import { toUserId } from '../../types/user-id';

export const cards = (ports: Ports): T.Task<HtmlFragment> => pipe(
  {
    first: userListCard(ports)(
      toUserId('1417520401282854918'),
      'Some interesting preprints on ion channel proteins',
    ),
    second: userListCard(ports)(
      toUserId('1412019815619911685'),
      'See what researchers at Prachee Avasthi’s lab are reading to discover some interesting new work',
    ),
    third: userListCard(ports)(
      toUserId('1223116442549145601'),
      'A list of papers on innate immunology curated by Ailís O’Carroll',
    ),
  },
  sequenceS(TE.ApplyPar),
  T.map(renderCardsSection),
);
