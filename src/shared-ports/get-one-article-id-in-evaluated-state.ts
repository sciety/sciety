import * as O from 'fp-ts/Option';
import { Doi } from '../types/doi';

export type GetOneArticleIdInEvaluatedState = () => O.Option<Doi>;
