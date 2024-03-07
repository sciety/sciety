/* eslint-disable jest/consistent-test-it */
/* eslint-disable jest/require-top-level-describe */
/* eslint-disable jest/require-hook */
import { URL } from 'url';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { Evaluation } from '../../../src/docmaps/docmap/evaluation';
import { anonymous } from '../../../src/docmaps/docmap/peer-reviewer';
import { publisherAccountId } from '../../../src/docmaps/docmap/publisher-account-id';
import { renderDocmap } from '../../../src/docmaps/docmap/render-docmap';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../helpers';
import { arbitraryGroup } from '../../types/group.helper';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { Docmap } from '../../../src/docmaps/docmap/docmap-type';
import { ExpressionDoi } from '../../../src/types/expression-doi';

const itIsAValidInput = (inputs: Docmap['steps'][number]['inputs'], doi: ExpressionDoi) => {
  it('has a single (deprecated) input', () => {
    expect(inputs).toHaveLength(1);
  });

  it('includes the uri', async () => {
    expect(inputs[0].url).toContain(doi);
  });

  it('includes the doi', async () => {
    expect(inputs[0].doi).toStrictEqual(doi);
  });
};

const expressionDoi = arbitraryExpressionDoi();

describe('render-docmap', () => {
  describe('docmap meta data', () => {
    const earlierEvaluationRecordedDate = new Date('1900');
    const laterEvaluationRecordedDate = new Date('2000');
    const group = arbitraryGroup();
    const result = renderDocmap({
      expressionDoi,
      group,
      evaluations: [
        {
          sourceUrl: new URL(arbitraryUri()),
          evaluationLocator: arbitraryEvaluationLocator(),
          recordedAt: earlierEvaluationRecordedDate,
          publishedAt: arbitraryDate(),
          authors: [],
        },
        {
          sourceUrl: new URL(arbitraryUri()),
          evaluationLocator: arbitraryEvaluationLocator(),
          recordedAt: laterEvaluationRecordedDate,
          publishedAt: arbitraryDate(),
          authors: [],
        },
      ],
      updatedAt: new Date(),
    });

    describe('the docmap id', () => {
      const anotherDocmap = renderDocmap({
        expressionDoi,
        group,
        evaluations: [
          {
            sourceUrl: new URL(arbitraryUri()),
            evaluationLocator: arbitraryEvaluationLocator(),
            recordedAt: arbitraryDate(),
            publishedAt: arbitraryDate(),
            authors: [],
          },
        ],
        updatedAt: new Date(),
      });

      it('is a valid URL', () => {
        expect(new URL(result.id).hostname).toBe('sciety.org');
      });

      it('includes the article id', () => {
        expect(result.id).toContain(expressionDoi);
      });

      it('includes the group slug', () => {
        expect(result.id).toContain(group.slug);
      });

      it('is the same for all docmaps generated with a given article id and group', () => {
        expect(anotherDocmap.id).toStrictEqual(result.id);
      });
    });

    it('includes the publisher properties', async () => {
      const publisher = result.publisher;

      expect(publisher.id).toStrictEqual(group.homepage);
      expect(publisher.name).toStrictEqual(group.name);
      expect(publisher.logo).toContain(group.avatarPath);
      expect(publisher.homepage).toStrictEqual(group.homepage);
      expect(publisher.account).toStrictEqual({
        id: publisherAccountId(group),
        service: 'https://sciety.org',
      });
    });

    it('sets created to the date the first evaluation was recorded', async () => {
      expect(result.created).toStrictEqual(earlierEvaluationRecordedDate.toISOString());
    });
  });

  describe('when there are multiple evaluations by the selected group', () => {
    const earlierEvaluationPublishedDate = new Date('1900');
    const laterEvaluationPublishedDate = new Date('2000');
    const earlierEvaluationLocator = arbitraryEvaluationLocator();
    const laterEvaluationLocator = arbitraryEvaluationLocator();
    const firstStep = '_:b0';
    const authorName = arbitraryString();
    const evaluations: RNEA.ReadonlyNonEmptyArray<Evaluation> = [
      {
        sourceUrl: new URL(`https://evaluations.example.com/${earlierEvaluationLocator}`),
        evaluationLocator: earlierEvaluationLocator,
        recordedAt: arbitraryDate(),
        publishedAt: earlierEvaluationPublishedDate,
        authors: [],
      },
      {
        sourceUrl: new URL(`https://evaluations.example.com/${laterEvaluationLocator}`),
        evaluationLocator: laterEvaluationLocator,
        recordedAt: arbitraryDate(),
        publishedAt: laterEvaluationPublishedDate,
        authors: [authorName],
      },
    ];
    const result = renderDocmap({
      expressionDoi,
      group: arbitraryGroup(),
      evaluations,
      updatedAt: new Date(),
    });

    it('returns a single step', () => {
      expect(Object.keys(result.steps)).toHaveLength(1);
    });

    describe('the step', () => {
      const theStep = result.steps[firstStep];

      it('has empty assertions', async () => {
        expect(theStep.assertions).toStrictEqual([]);
      });

      describe('the (deprecated) input', () => {
        itIsAValidInput(theStep.inputs, expressionDoi);
      });

      it('has one action per evaluation', () => {
        expect(theStep.actions).toHaveLength(evaluations.length);
      });

      describe('each action', () => {
        const action0 = theStep.actions[0];
        const action1 = theStep.actions[1];

        it('contains a single person actor as the participants', () => {
          expect(action0.participants[0].actor.name).toStrictEqual(anonymous);
          expect(action1.participants[0].actor.name).toStrictEqual(authorName);
        });

        describe('the input', () => {
          itIsAValidInput(action0.inputs, expressionDoi);
          itIsAValidInput(action1.inputs, expressionDoi);
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
                url: `https://sciety.org/articles/activity/${expressionDoi}#${earlierEvaluationLocator}`,
              }]),
            );
            expect(outputOfAction1.content).toStrictEqual(
              expect.arrayContaining([{
                type: 'web-page',
                url: `https://sciety.org/articles/activity/${expressionDoi}#${laterEvaluationLocator}`,
              }]),
            );
          });

          it('links to the original source of the evaluation', () => {
            expect(outputOfAction0.content).toStrictEqual(
              expect.arrayContaining([{
                type: 'web-page',
                url: `https://evaluations.example.com/${earlierEvaluationLocator}`,
              }]),
            );
            expect(outputOfAction1.content).toStrictEqual(
              expect.arrayContaining([{
                type: 'web-page',
                url: `https://evaluations.example.com/${laterEvaluationLocator}`,
              }]),
            );
          });

          it('has published date of corresponding evaluation', () => {
            expect(outputOfAction0.published).toStrictEqual(earlierEvaluationPublishedDate.toISOString());
            expect(outputOfAction1.published).toStrictEqual(laterEvaluationPublishedDate.toISOString());
          });

          it('has a fixed content field that always has the value `review-article`', () => {
            expect(outputOfAction0.type).toBe('review-article');
            expect(outputOfAction1.type).toBe('review-article');
          });
        });
      });
    });
  });
});
