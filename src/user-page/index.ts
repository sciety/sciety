import createGetHardcodedFollowedEditorialCommunities, { GetEditorialCommunity } from './get-hardcoded-followed-editorial-communities';
import createProjectFollowedEditorialCommunityIds from './project-followed-editorial-community-ids';
import createRenderFollowToggle from './render-follow-toggle';
import createRenderFollowedEditorialCommunity from './render-followed-editorial-community';
import createRenderPage from './render-page';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import FollowList from '../types/follow-list';
import userId from '../types/user-id';

type Ports = {
  editorialCommunities: EditorialCommunityRepository,
};

interface Params {
  userId?: string;
  followList: FollowList;
}

type RenderPage = (params: Params) => Promise<string>;

const hardcodedEvents: Array<DomainEvent> = [
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
  {
    type: 'UserUnfollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someone'),
    editorialCommunityId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
  },
  {
    type: 'EditorialCommunityJoined',
    date: new Date(),
    actorId: new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'),
  },
  {
    type: 'UserFollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someoneelse'),
    editorialCommunityId: new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'),
  },
  {
    type: 'UserUnfollowedEditorialCommunity',
    date: new Date(),
    userId: userId('someoneelse'),
    editorialCommunityId: new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'),
  },
];

export default (ports: Ports): RenderPage => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => (
    (await ports.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap()
  );

  const renderFollowToggle = createRenderFollowToggle();
  const renderFollowedEditorialCommunity = createRenderFollowedEditorialCommunity(renderFollowToggle);
  const getHardcodedFollowedEditorialCommunities = createGetHardcodedFollowedEditorialCommunities(
    createProjectFollowedEditorialCommunityIds(async () => hardcodedEvents),
    getEditorialCommunity,
  );
  const renderPage = createRenderPage(getHardcodedFollowedEditorialCommunities, renderFollowedEditorialCommunity);
  return async (params) => renderPage(userId(params.userId ?? ''), params.followList);
};
