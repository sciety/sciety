import { Doi } from '../types/doi';
import * as GID from '../types/group-id';

type ListData = {
  listId: string,
  name: string,
  description: string,
  ownerId: GID.GroupId,
  members: ReadonlyArray<Doi>,
};

export const listCreationData: Record<string, ListData> = {
  'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7': {
    listId: 'cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7',
    name: 'High interest articles',
    description: 'Articles that have been identified as high interest by NCRC editors.',
    ownerId: GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a.jpg'),
    members: [],
  },
  '5ac3a439-e5c6-4b15-b109-92928a740812': {
    listId: '5ac3a439-e5c6-4b15-b109-92928a740812',
    name: 'Endorsed articles',
    description: 'Articles that have been endorsed by Biophysics Colab.',
    ownerId: GID.fromValidatedString('4bbf0c12-629b-4bb8-91d6-974f4df8efb2.png'),
    members: [],
  },
};
