import * as Lid from '../../src/types/list-id';
import { arbitraryWord } from '../helpers';

export const arbitraryListId = (): Lid.ListId => Lid.fromValidatedString(`list-id-${arbitraryWord(6)}`);
