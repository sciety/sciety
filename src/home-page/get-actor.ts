import * as T from 'fp-ts/Task';
import { Maybe } from 'true-myth';
import { EditorialCommunityId } from '../types/editorial-community-id';

type Actor = {
  url: string,
  name: string,
  imageUrl: string,
};

type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<Maybe<{
  name: string,
  avatarPath: string,
}>>;

export const getActor = (getEditorialCommunity: GetEditorialCommunity): GetActor => (id) => async () => {
  const editorialCommunity = (await getEditorialCommunity(id)()).unsafelyUnwrap();
  return {
    name: editorialCommunity.name,
    imageUrl: editorialCommunity.avatarPath,
    url: `/editorial-communities/${id.value}`,
  };
};
