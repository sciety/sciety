import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { ViewModel } from '../view-model';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../types/expression-doi';
import { findAllListsContainingPaper } from './find-all-lists-containing-paper';
import { constructContainingList } from './construct-containing-list';

export const constructListedIn = (dependencies: Dependencies) => (expressionDoi: ExpressionDoi): ViewModel['listedIn'] => pipe(
  expressionDoi,
  findAllListsContainingPaper(dependencies),
  RA.map(constructContainingList(dependencies)),
);
