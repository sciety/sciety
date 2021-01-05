import { URL } from 'url';
import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
import { GetActor } from '../shared-components/render-summary-feed-item';
import EditorialCommunityId from '../types/editorial-community-id';

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<Maybe<{
  name: string;
  avatar: URL;
}>>;

export const getActor = (getEditorialCommunity: GetEditorialCommunity): GetActor => (id) => async () => {
  const editorialCommunity = (await getEditorialCommunity(id)()).unsafelyUnwrap();
  return {
    name: editorialCommunity.name,
    imageUrl: editorialCommunity.avatar.toString(),
    url: `/editorial-communities/${id.value}`,
  };
};
