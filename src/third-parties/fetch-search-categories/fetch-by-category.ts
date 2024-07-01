import * as EDOI from '../../types/expression-doi';
import { ExternalQueries } from '../external-queries';

export const fetchByCategory = (): ExternalQueries['fetchByCategory'] => () => [
  EDOI.fromValidatedString('10.1101/2024.01.16.575490'),
];
