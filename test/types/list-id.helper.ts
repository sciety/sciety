import { ListId } from '../../src/types/list-id';
import { arbitraryWord } from '../helpers';

export const arbitraryListId = (): ListId => `list-id-${arbitraryWord(6)}`;
