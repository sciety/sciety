import { GroupId } from '../../src/types/group-id';
import { arbitraryWord } from '../helpers';

export const arbitraryGroupId = (): GroupId => new GroupId(`group-id-${arbitraryWord(6)}`);
