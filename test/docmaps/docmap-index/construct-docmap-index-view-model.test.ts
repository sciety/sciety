import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { DocmapIndexViewModel, constructDocmapIndexViewModel } from '../../../src/docmaps/docmap-index/docmap-index';
import { TestFramework, createTestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('construct-docmap-index-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are no docmaps', () => {
    let index: DocmapIndexViewModel;

    beforeEach(async () => {
      index = await pipe(
        {},
        constructDocmapIndexViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an empty list', () => {
      expect(index).toStrictEqual([]);
    });
  });

  describe('when supported groups have evaluated some articles', () => {
    describe('when the whole index is requested', () => {
      it.todo('returns a docmap for every combination of group and evaluated article');
    });

    describe('when a particular publisher account ID is requested', () => {
      it.todo('only returns docmaps by the corresponding group');
    });

    describe('when only docmaps updated after a certain date are requested', () => {
      it.todo('only returns docmaps whose updated property is after the specified date');
    });

    describe('when a supported group has evaluated multiple articles', () => {
      it.todo('returns a docmap for every evaluated article');
    });
  });

  describe('when there is an evaluated event by an unsupported group', () => {
    it.todo('excludes articles evaluated by the unsupported group');
  });

  describe('when one of the docmaps requires a third-party query to construct', () => {
    describe('when the third-party query succeeds', () => {
      it.todo('returns the docmap as part of the index');
    });

    describe('when the third-party query fails', () => {
      it.todo('fails to produce an index');
    });
  });
});
