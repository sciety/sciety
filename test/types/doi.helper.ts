import { Doi } from '../../src/types/doi';
import { arbitraryWord } from '../helpers';

export const arbitraryDoi = (): Doi => new Doi(`10.1101/${arbitraryWord(8)}`);
