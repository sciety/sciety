import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded, groupJoined } from '../../../../src/domain-events';
import { toHtmlFragment } from '../../../../src/types/html-fragment';
import { sanitise } from '../../../../src/types/sanitised-html-fragment';
import { arbitraryDate, arbitraryNumber } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { arbitraryGroup } from '../../../types/group.helper';
import { arbitraryReviewId } from '../../../types/review-id.helper';
import { Ports, fetchExtraDetails } from '../../../../src/html-pages/search-results-page/construct-view-model/fetch-extra-details';

describe('fetch-extra-details', () => {
  const numberOfPages = arbitraryNumber(0, 10);

  describe('given a found article', () => {
    it('returns a correct view model', async () => {
      const group = arbitraryGroup();
      const articleId = arbitraryArticleId();
      const pageNumber = arbitraryNumber(2, 5);
      const latestVersionDate = new Date();
      const earlierPublicationDate = new Date('1970');
      const laterPublicationDate = new Date('2020');
      const ports: Ports = {
        getAllEvents: T.of([
          groupJoined(
            group.id,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          ),
          evaluationRecorded(group.id, articleId, arbitraryReviewId(), [], laterPublicationDate, arbitraryDate()),
          evaluationRecorded(group.id, articleId, arbitraryReviewId(), [], earlierPublicationDate, arbitraryDate()),
        ]),
        getFollowers: () => [],
        getGroup: () => O.some(arbitraryGroup()),
        getLatestArticleVersionDate: () => T.of(O.some(latestVersionDate)),
        selectAllListsOwnedBy: shouldNotBeCalled,
        getActivityForDoi: (a) => ({
          articleId: a,
          latestActivityDate: O.some(laterPublicationDate),
          evaluationCount: 2,
          listMembershipCount: 0,
        }),
      };

      const matches = {
        query: '',
        evaluatedOnly: false,
        category: 'articles' as const,
        availableArticleMatches: 5,
        availableGroupMatches: 0,
        itemsToDisplay: [
          {
            _tag: 'Article' as const,
            articleId,
            server: 'biorxiv' as const,
            title: pipe('', toHtmlFragment, sanitise),
            authors: O.some([]),
          },
        ],
        nextCursor: O.none,
        pageNumber,
        numberOfPages,
      };
      const viewModel = await fetchExtraDetails(ports)(matches)();

      expect(viewModel).toStrictEqual({
        query: '',
        evaluatedOnly: false,
        category: 'articles',
        availableArticleMatches: 5,
        availableGroupMatches: 0,
        itemsToDisplay: [
          expect.objectContaining({
            evaluationCount: 2,
            latestVersionDate: O.some(latestVersionDate),
            latestActivityDate: O.some(laterPublicationDate),
          }),
        ],
        nextCursor: O.none,
        pageNumber,
        numberOfPages,
      });
    });
  });

  describe('given a found group', () => {
    describe('when the details can be fetched', () => {
      it('returns a correct view model', async () => {
        const pageNumber = arbitraryNumber(2, 5);
        const group = arbitraryGroup();
        const ports: Ports = {
          getAllEvents: T.of([groupJoined(
            group.id,
            group.name,
            group.avatarPath,
            group.descriptionPath,
            group.shortDescription,
            group.homepage,
            group.slug,
          )]),
          getFollowers: () => [],
          getGroup: () => O.some(group),
          getLatestArticleVersionDate: shouldNotBeCalled,
          selectAllListsOwnedBy: () => [],
          getActivityForDoi: (a) => ({
            articleId: a,
            latestActivityDate: O.none,
            evaluationCount: 0,
            listMembershipCount: 0,
          }),
        };
        const matches = {
          query: '',
          evaluatedOnly: false,
          category: 'groups' as const,
          availableArticleMatches: 0,
          availableGroupMatches: 5,
          itemsToDisplay: [
            {
              _tag: 'Group' as const,
              id: group.id,
            },
          ],
          nextCursor: O.none,
          pageNumber,
          numberOfPages,
        };
        const viewModel = await fetchExtraDetails(ports)(matches)();

        expect(viewModel).toStrictEqual({
          query: '',
          evaluatedOnly: false,
          category: 'groups',
          availableArticleMatches: 0,
          availableGroupMatches: 5,
          itemsToDisplay: [
            expect.objectContaining({
              evaluationCount: 0,
              followerCount: 0,
            }),
          ],
          nextCursor: O.none,
          pageNumber,
          numberOfPages,
        });
      });
    });

    describe('when the details cannot be fetched', () => {
      it('removes the group from the list', async () => {
        const pageNumber = arbitraryNumber(2, 5);
        const ports: Ports = {
          getAllEvents: T.of([]),
          getFollowers: () => [],
          getGroup: () => O.none,
          getLatestArticleVersionDate: shouldNotBeCalled,
          selectAllListsOwnedBy: shouldNotBeCalled,
          getActivityForDoi: (a) => ({
            articleId: a,
            latestActivityDate: O.none,
            evaluationCount: 0,
            listMembershipCount: 0,
          }),
        };
        const matches = {
          query: '',
          evaluatedOnly: false,
          category: 'groups' as const,
          availableArticleMatches: 0,
          availableGroupMatches: 0,
          itemsToDisplay: [
            {
              _tag: 'Group' as const,
              id: arbitraryGroupId(),
            },
          ],
          nextCursor: O.none,
          pageNumber,
          numberOfPages,
        };
        const viewModel = await fetchExtraDetails(ports)(matches)();

        expect(viewModel).toStrictEqual(expect.objectContaining({
          query: '',
          category: 'groups',
          availableArticleMatches: 0,
          availableGroupMatches: 0,
          itemsToDisplay: [],
          pageNumber,
          numberOfPages,
        }));
      });
    });
  });
});
