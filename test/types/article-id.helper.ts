import { Doi } from '../../src/types/doi';
import { arbitraryNumber } from '../helpers';

export const arbitraryArticleId = (prefix = '10.1101'): Doi => new Doi(`${prefix}/${arbitraryNumber(100000, 999999)}`);
