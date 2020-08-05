import { RenderFeedItem } from './render-feed-item';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { Event } from '../types/events';
import { NonEmptyArray } from '../types/non-empty-array';

type RenderFeed = () => Promise<string>;

export type GetEvents = (followList: Array<EditorialCommunityId>) => Promise<NonEmptyArray<Event>>;

export default (
  getEvents: GetEvents,
  renderFeedItem: RenderFeedItem,
): RenderFeed => (
  async () => {
    const followList = [
      new EditorialCommunityId('316db7d9-88cc-4c26-b386-f067e0f56334'), // Review Commons
      new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd8'), // A PREreview Journal Club
      new EditorialCommunityId('b560187e-f2fb-4ff9-a861-a204f3fc0fb0'), // eLife
      new EditorialCommunityId('10360d97-bf52-4aef-b2fa-2f60d319edd7'), // PREReview
      new EditorialCommunityId('53ed5364-a016-11ea-bb37-0242ac130002'), // PeerJ
      new EditorialCommunityId('74fd66e9-3b90-4b5a-a4ab-5be83db4c5de'), // PCI Zoology
    ];

    const events = await getEvents(followList);
    const feedItems = await Promise.all(events.map(renderFeedItem));
    return `
      <section>
        <h2 class="ui header">
          Feed
        </h2>
        <ol class="ui large feed">
          ${templateListItems(feedItems, 'event')}
        </ol>
      </section>
    `;
  }
);
