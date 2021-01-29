import { URL } from 'url';
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
  avatar: URL,
}>>;

export const getActor = (getEditorialCommunity: GetEditorialCommunity): GetActor => (id) => async () => {
  const editorialCommunity = (await getEditorialCommunity(id)()).unsafelyUnwrap();
  return {
    name: editorialCommunity.name,
    imageUrl: editorialCommunity.avatar.toString(),
    url: `/editorial-communities/${id.value}`,
  };
};
