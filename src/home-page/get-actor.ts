import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { EditorialCommunityId } from '../types/editorial-community-id';

type Actor = {
  url: string,
  name: string,
  imageUrl: string,
};

type GetActor = (id: EditorialCommunityId) => T.Task<Actor>;

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => T.Task<O.Option<{
  name: string,
  avatarPath: string,
}>>;

export const getActor = (getEditorialCommunity: GetEditorialCommunity): GetActor => (id) => pipe(
  id,
  getEditorialCommunity,
  T.map(flow(
    O.getOrElseW(() => { throw new Error(`No such community ${id.value}`); }),
    (community) => ({
      name: community.name,
      imageUrl: community.avatarPath,
      url: `/groups/${id.value}`,
    }),
  )),
);
