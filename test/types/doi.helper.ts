import { Doi } from '../../src/types/doi';
import { arbitraryWord } from '../helpers';

export const arbitraryDoi = (prefix = '10.1101'): Doi => new Doi(`${prefix}/${arbitraryWord(8)}`);
