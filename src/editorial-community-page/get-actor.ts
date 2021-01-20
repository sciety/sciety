import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
import { EditorialCommunity } from '../types/editorial-community';
import { EditorialCommunityId } from '../types/editorial-community-id';

type Actor = {
  url: string;
  name: string;
  imageUrl: string;
};

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<Maybe<EditorialCommunity>>;

type GetActor = (getEditorialCommunity: GetEditorialCommunity) => (id: EditorialCommunityId) => T.Task<Actor>;

export const getActor: GetActor = (getEditorialCommunity) => (id) => async () => {
  const editorialCommunity = (await getEditorialCommunity(id)()).unsafelyUnwrap();
  return {
    name: editorialCommunity.name,
    imageUrl: editorialCommunity.avatar.toString(),
    url: `/editorial-communities/${id.value}`,
  };
};
