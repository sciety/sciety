import { URL } from 'url';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Maybe, Result } from 'true-myth';
import createGetFollowedEditorialCommunitiesFromIds, { GetEditorialCommunity } from './get-followed-editorial-communities-from-ids';
import createProjectFollowedEditorialCommunityIds, { GetAllEvents } from './project-followed-editorial-community-ids';
import createRenderFollowList from './render-follow-list';
import createRenderFollowToggle, { Follows } from './render-follow-toggle';
import createRenderFollowedEditorialCommunity from './render-followed-editorial-community';
import createRenderHeader, { UserDetails } from './render-header';
import createRenderPage, { RenderPage } from './render-page';
import EditorialCommunityId from '../types/editorial-community-id';
import { User } from '../types/user';
import toUserId, { UserId } from '../types/user-id';

type FetchEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
  avatar: URL;
}>>;

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type Ports = {
  getEditorialCommunity: FetchEditorialCommunity,
  getAllEvents: GetAllEvents,
  follows: Follows,
  getUserDetails: GetUserDetails,
};

interface Params {
  id?: string;
  user: Maybe<User>;
}

type UserPage = (params: Params) => ReturnType<RenderPage>;

export default (ports: Ports): UserPage => {
  const getEditorialCommunity: GetEditorialCommunity = (editorialCommunityId) => async () => (
    (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap()
  );

  const renderFollowToggle = createRenderFollowToggle(ports.follows);
  const renderFollowedEditorialCommunity = createRenderFollowedEditorialCommunity(renderFollowToggle);
  const getFollowedEditorialCommunities = createGetFollowedEditorialCommunitiesFromIds(
    createProjectFollowedEditorialCommunityIds(ports.getAllEvents),
    getEditorialCommunity,
  );
  const wrapGetUserDetails = async (userId: UserId): Promise<Result<UserDetails, 'not-found' | 'unavailable'>> => (
    pipe(
      userId,
      ports.getUserDetails,
      TE.fold(
        (error) => T.of(Result.err<UserDetails, 'not-found' | 'unavailable'>(error)),
        (userDetails) => T.of(Result.ok<UserDetails, 'not-found' | 'unavailable'>(userDetails)),
      ),
    )()
  );
  const renderHeader = createRenderHeader(ports.getUserDetails);
  const renderFollowList = createRenderFollowList(
    getFollowedEditorialCommunities,
    renderFollowedEditorialCommunity,
  );
  const renderPage = createRenderPage(
    renderHeader,
    renderFollowList,
    // TODO for goodness sake don't do this for longer than you have to - doubles Twitter API calls unnecessarily
    async (userId) => (await wrapGetUserDetails(userId)).map(({ displayName }) => displayName),
  );

  return async (params) => {
    const userId = toUserId(params.id ?? '');
    const viewingUserId = params.user.map((value) => value.id);

    return renderPage(userId, viewingUserId);
  };
};
