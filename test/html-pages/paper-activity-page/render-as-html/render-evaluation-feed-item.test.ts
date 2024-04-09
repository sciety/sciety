import { pipe } from 'fp-ts/function';
import { load } from 'cheerio';
import { renderEvaluationPublishedFeedItem } from '../../../../src/html-pages/paper-activity-page/render-as-html/render-evaluation-published-feed-item';
import { missingFullTextAndSourceLink } from '../../../../src/html-pages/paper-activity-page/render-as-html/static-messages';
import { EvaluationLocator, evaluationLocatorCodec } from '../../../../src/types/evaluation-locator';
import { arbitraryNumber, arbitraryWord } from '../../../helpers';
import * as RFI from '../evaluation-feed-item.helper';

const toggleableContentSelector = '[data-behaviour="collapse_to_teaser"]';
const teaserSelector = '[data-teaser]';
const cheerioSafeIdSelector = (evaluationLocator: EvaluationLocator) => `#${evaluationLocatorCodec.encode(evaluationLocator).replace(':', '\\:')}`;
const sourceLinkSelector = '.activity-feed__item__read_original_source';

describe('render-evaluation-feed-item', () => {
  const fullText = arbitraryWord(100);

  describe('when the evaluation has long full text', () => {
    const teaserLength = 6;
    const item = pipe(
      RFI.arbitrary(),
      RFI.withFullText(fullText),
    );
    const parsedResult = pipe(
      renderEvaluationPublishedFeedItem(item, teaserLength),
      load,
    );

    it('renders the full text', async () => {
      expect(parsedResult(toggleableContentSelector)).toHaveLength(1);
      expect(parsedResult('[data-full-text]').text()).toStrictEqual(expect.stringContaining(fullText));
      expect(parsedResult(teaserSelector).text()).toStrictEqual(expect.stringContaining('…'));
    });

    it('renders an id tag with the correct value', async () => {
      expect(parsedResult(cheerioSafeIdSelector(item.id))).toHaveLength(1);
    });
  });

  describe('when the evaluation has short full text', () => {
    const source = 'http://example.com/source';
    const item = pipe(
      RFI.arbitrary(),
      RFI.withFullText(fullText),
      RFI.withSource(source),
    );
    const parsedResult = pipe(
      renderEvaluationPublishedFeedItem(item, 200),
      load,
    );

    it('renders without a teaser', async () => {
      expect(parsedResult(toggleableContentSelector)).toHaveLength(0);
      expect(parsedResult(teaserSelector)).toHaveLength(0);
      expect(parsedResult('.activity-feed__item__body').text()).toStrictEqual(expect.stringContaining(fullText));
      expect(parsedResult(sourceLinkSelector).attr('href')).toStrictEqual(source);
    });

    it('renders an id tag with the correct value', async () => {
      expect(parsedResult(cheerioSafeIdSelector(item.id))).toHaveLength(1);
    });
  });

  describe('when the evaluation has no full text', () => {
    describe('when there is a source link URL', () => {
      const source = 'http://example.com/source';
      const item = pipe(
        RFI.arbitrary(),
        RFI.withNoFullText,
        RFI.withSource(source),
      );
      const parsedResult = pipe(
        renderEvaluationPublishedFeedItem(item, 6),
        load,
      );

      it('renders without a teaser', async () => {
        expect(parsedResult(toggleableContentSelector)).toHaveLength(0);
        expect(parsedResult(sourceLinkSelector).attr('href')).toStrictEqual(source);
      });

      it('renders an id tag with the correct value', async () => {
        expect(parsedResult(cheerioSafeIdSelector(item.id))).toHaveLength(1);
      });
    });

    describe('when there is no source link URL', () => {
      const item = pipe(
        RFI.arbitrary(),
        RFI.withNoFullText,
        RFI.withNoSource,
      );
      const result = renderEvaluationPublishedFeedItem(item, arbitraryNumber(6, 10));

      it('displays a message that the evaluation is unavailable', () => {
        expect(result).toContain(missingFullTextAndSourceLink);
      });
    });
  });
});
