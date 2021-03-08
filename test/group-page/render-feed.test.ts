import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { GetEvents, renderFeed } from '../../src/group-page/render-feed';
import { Doi } from '../../src/types/doi';
import { GroupId } from '../../src/types/group-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

describe('render feed', () => {
  const stubGetEvents: GetEvents = () => T.of([]);
  const anGroupId = new GroupId('');
  const group = {
    id: anGroupId,
    name: 'name',
    avatar: new URL('http://example.com/image'),
    avatarPath: '',
    descriptionPath: 'path',
  };

  describe('with group events', () => {
    it('returns a list of events', async () => {
      const renderSummaryFeedList = () => O.some(toHtmlFragment('a list'));
      const component = renderFeed(
        stubGetEvents,
        () => () => T.of({
          avatar: '',
          date: new Date(),
          actorName: '',
          actorUrl: '',
          doi: new Doi('10.1101/111111'),
          title: pipe('', toHtmlFragment, sanitise),
          verb: 'reviewed',
        }),
        renderSummaryFeedList,
      );
      const rendered = await component(group)();

      expect(rendered).toStrictEqual(expect.stringContaining('a list'));
    });
  });

  describe('without group events', () => {
    it('returns fallback text', async () => {
      const renderSummaryFeedList = () => O.none;
      const component = renderFeed(
        stubGetEvents,
        () => () => T.of({
          avatar: '',
          date: new Date(),
          actorName: '',
          actorUrl: '',
          doi: new Doi('10.1101/111111'),
          title: pipe('', toHtmlFragment, sanitise),
          verb: 'reviewed',
        }),
        renderSummaryFeedList,
      );
      const rendered = await component(group)();

      expect(rendered).toStrictEqual(expect.stringContaining('group hasn’t evaluated'));
    });
  });
});
