import createRenderSummaryFeedList from '../../src/templates/render-summary-feed-list';

describe('render-summary-feed-list', () => {
  describe('when there are events', () => {
    it('returns a list', async () => {
      const renderSummaryFeedList = createRenderSummaryFeedList(async () => '');
      const events = [
        {}, {}, {},
      ];
      const rendered = await renderSummaryFeedList(events);

      expect(rendered.unsafelyUnwrap()).toStrictEqual(expect.stringContaining('<ol class="summary-feed-list"'));
    });
  });

  describe('when there are no events', () => {
    it.todo('returns nothing');
  });
});
