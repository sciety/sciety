import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { anonymousReviewer } from '../../../src/docmaps/docmap/anonymous-reviewer';
import { Evaluation } from '../../../src/docmaps/docmap/evaluation';
import { publisherAccountId } from '../../../src/docmaps/docmap/publisher-account-id';
import { toDocmap } from '../../../src/docmaps/docmap/to-docmap';
import { arbitraryDate, arbitraryUri } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

const articleId = arbitraryDoi();

describe('to-docmap', () => {
  describe('docmap meta data', () => {
    const earlierDate = new Date('1900');
    const laterDate = new Date('2000');
    const group = arbitraryGroup();
    const result = toDocmap({
      articleId,
      group,
      inputPublishedDate: O.none,
      evaluations: [
        {
          sourceUrl: new URL(arbitraryUri()),
          reviewId: arbitraryReviewId(),
          occurredAt: earlierDate,
        },
        {
          sourceUrl: new URL(arbitraryUri()),
          reviewId: arbitraryReviewId(),
          occurredAt: laterDate,
        },
      ],
    });

    describe('the docmap id', () => {
      const anotherDocmap = toDocmap({
        articleId,
        group,
        inputPublishedDate: O.none,
        evaluations: [
          {
            sourceUrl: new URL(arbitraryUri()),
            reviewId: arbitraryReviewId(),
            occurredAt: arbitraryDate(),
          },
        ],
      });

      it('is a valid URL', () => {
        expect(new URL(result.id).hostname).toBe('sciety.org');
      });

      it('includes the article id', () => {
        expect(result.id).toContain(articleId.value);
      });

      it('includes the group slug', () => {
        expect(result.id).toContain(group.slug);
      });

      it('is the same for all docmaps generated with a given article id and group', () => {
        expect(anotherDocmap.id).toStrictEqual(result.id);
      });
    });

    it('includes the publisher properties', async () => {
      expect(result.publisher).toStrictEqual(expect.objectContaining({
        id: group.homepage,
        name: group.name,
        logo: expect.stringContaining(group.avatarPath),
        homepage: group.homepage,
        account: {
          id: publisherAccountId(group),
          service: 'https://sciety.org',
        },
      }));
    });

    it('sets created to the date of the first evaluation', async () => {
      expect(result.created).toStrictEqual(earlierDate.toISOString());
    });

    it('sets updated to the date of the last evaluation', async () => {
      expect(result.updated).toStrictEqual(laterDate.toISOString());
    });
  });

  describe('when there is an input published date', () => {
    const articleDate = arbitraryDate();
    const result = toDocmap({
      articleId,
      group: arbitraryGroup(),
      inputPublishedDate: O.some(articleDate),
      evaluations: [
        {
          sourceUrl: new URL(arbitraryUri()),
          reviewId: arbitraryReviewId(),
          occurredAt: arbitraryDate(),
        },
      ],
    });

    it('is included as the published date as an ISO string', () => {
      expect(result.steps['_:b0'].inputs).toStrictEqual([
        expect.objectContaining({ published: articleDate.toISOString() }),
      ]);
    });
  });

  describe('when there is no input published date', () => {
    const result = toDocmap({
      articleId,
      group: arbitraryGroup(),
      inputPublishedDate: O.none,
      evaluations: [
        {
          sourceUrl: new URL(arbitraryUri()),
          reviewId: arbitraryReviewId(),
          occurredAt: arbitraryDate(),
        },
      ],
    });

    it('there is no published date', async () => {
      expect(result.steps['_:b0'].inputs).toStrictEqual([
        expect.not.objectContaining({ published: expect.anything }),
      ]);
    });
  });

  describe('when there are multiple evaluations by the selected group', () => {
    const earlierDate = new Date('1900');
    const laterDate = new Date('2000');
    const earlierReviewId = arbitraryReviewId();
    const laterReviewId = arbitraryReviewId();
    const firstStep = '_:b0';
    const evaluations: RNEA.ReadonlyNonEmptyArray<Evaluation> = [
      {
        sourceUrl: new URL(`https://reviews.example.com/${earlierReviewId}`),
        reviewId: earlierReviewId,
        occurredAt: earlierDate,
      },
      {
        sourceUrl: new URL(`https://reviews.example.com/${laterReviewId}`),
        reviewId: laterReviewId,
        occurredAt: laterDate,
      },
    ];
    const result = toDocmap({
      articleId,
      group: arbitraryGroup(),
      inputPublishedDate: O.none,
      evaluations,
    });

    it('returns a single step', () => {
      expect(Object.keys(result.steps)).toHaveLength(1);
    });

    describe('the step', () => {
      const theStep = result.steps[firstStep];

      it('has empty assertions', async () => {
        expect(theStep.assertions).toStrictEqual([]);
      });

      describe('the inputs', () => {
        it('include the uri and doi', async () => {
          expect(theStep.inputs).toStrictEqual([
            expect.objectContaining(
              {
                doi: articleId.value,
                url: expect.stringContaining(articleId.value),
              },
            )]);
        });
      });

      it('has one action per evaluation', () => {
        expect(theStep.actions).toHaveLength(evaluations.length);
      });

      describe('each action', () => {
        const action0 = theStep.actions[0];
        const action1 = theStep.actions[1];

        it('contains a single anonymous person actor as the participants', () => {
          expect(action0.participants).toStrictEqual([anonymousReviewer]);
          expect(action1.participants).toStrictEqual([anonymousReviewer]);
        });

        it('has a single output', () => {
          expect(action0.outputs).toHaveLength(1);
          expect(action1.outputs).toHaveLength(1);
        });

        describe('the output', () => {
          const outputOfAction0 = action0.outputs[0];
          const outputOfAction1 = action1.outputs[0];

          it('links to the evaluation on sciety', () => {
            expect(outputOfAction0.content).toStrictEqual(
              expect.arrayContaining([{
                type: 'web-page',
                url: `https://sciety.org/articles/activity/${articleId.value}#${earlierReviewId}`,
              }]),
            );
            expect(outputOfAction1.content).toStrictEqual(
              expect.arrayContaining([{
                type: 'web-page',
                url: `https://sciety.org/articles/activity/${articleId.value}#${laterReviewId}`,
              }]),
            );
          });

          it('links to the original source of the evaluation', () => {
            expect(outputOfAction0.content).toStrictEqual(
              expect.arrayContaining([{
                type: 'web-page',
                url: `https://reviews.example.com/${earlierReviewId}`,
              }]),
            );
            expect(outputOfAction1.content).toStrictEqual(
              expect.arrayContaining([{
                type: 'web-page',
                url: `https://reviews.example.com/${laterReviewId}`,
              }]),
            );
          });

          it('has published date of corresponding evaluation', () => {
            expect(outputOfAction0.published).toStrictEqual(earlierDate.toISOString());
            expect(outputOfAction1.published).toStrictEqual(laterDate.toISOString());
          });

          it('has a fixed content field that always has the value `review-article`', () => {
            expect(outputOfAction0.type).toStrictEqual('review-article');
            expect(outputOfAction1.type).toStrictEqual('review-article');
          });
        });
      });
    });
  });
});
