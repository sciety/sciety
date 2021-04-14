import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { GroupId } from '../types/group-id';

type Actor = {
  url: string,
  name: string,
  imageUrl: string,
};

type GetActor = (id: GroupId) => T.Task<Actor>;

export type GetGroup = (id: GroupId) => TO.TaskOption<{
  name: string,
  avatarPath: string,
}>;

export const getActor = (getGroup: GetGroup): GetActor => (id) => pipe(
  id,
  getGroup,
  TO.match(
    () => { throw new Error(`No such group ${id.value}`); },
    (group) => ({
      name: group.name,
      imageUrl: group.avatarPath,
      url: `/groups/${id.value}`,
    }),
  ),
);
