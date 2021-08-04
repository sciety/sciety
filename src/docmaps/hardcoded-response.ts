import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Doi } from '../types/doi';
import { Group } from '../types/group';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

type FindReviewsForArticleDoi = (articleDoi: Doi) => T.Task<ReadonlyArray<{
  reviewId: ReviewId,
  groupId: GroupId,
  occurredAt: Date,
}>>;

type GetGroup = (groupId: GroupId) => TO.TaskOption<Group>;

type Ports = {
  findReviewsForArticleDoi: FindReviewsForArticleDoi,
  getGroup: GetGroup,
};

type Hardcodedreviewcommonsarticle = (ports: Ports) => (articleId: string) => T.Task<Record<string, unknown>>;

export const hardcodedReviewCommonsArticle: Hardcodedreviewcommonsarticle = (ports) => (articleId) => pipe(
  new Doi(articleId),
  ports.findReviewsForArticleDoi,
  T.map(([{ groupId }]) => groupId),
  T.chain(ports.getGroup),
  T.map(O.getOrElse(() => ({
    id: '',
    name: '',
    avatarPath: '',
    descriptionPath: '',
    shortDescription: '',
    homepage: '',
  }))),
  T.map(({ id, avatarPath, homepage }) => ({
    record: {
      'first-step': '_:b-336d69dd-06d2-484b-8866-256ea5bbc384',
      provider: 'https://sciety.org',
      created: '2021-06-21T15:59:56.000Z',
      generatedAt: '2021-07-11T21:57:43.171Z',
      publisher: {
        id: homepage,
        logo: `https://sciety.org${avatarPath}`,
        homepage,
        account: {
          id: `https://sciety.org/groups/${id}`,
          service: 'https://sciety.org',
        },
      },
      id: 'https://sciety.org/docmaps/v1/articles/10.1101/2021.04.25.441302.docmap.json',
      type: 'docmap',
      steps: {
        '_:b-78200b4c-48b8-4d64-b0d0-bfc99453d5f0': {
          assertions: [],
          actions: [{
            outputs: {
              published: '2021-06-18T23:16:27.418601+00:00',
              type: 'author-response',
              uri: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NRboUNCLEeusR-de0blrmA',
              content: [{
                type: 'web-page',
                url: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NRboUNCLEeusR-de0blrmA',
              }],
            },
            participants: [{ actor: { firstName: 'Magdalini', type: 'person', familyName: 'Polymenidou' }, role: 'author' }, { actor: { firstName: 'Mathias', type: 'person', familyName: 'Jucker' }, role: 'author' }, { actor: { firstName: 'Regina', type: 'person', familyName: 'Reimann' }, role: 'author' }, { actor: { firstName: 'Kelvin', type: 'person', familyName: 'Luk' }, role: 'author' }, { actor: { firstName: 'Melanie', type: 'person', familyName: 'Barth' }, role: 'author' }, { actor: { firstName: 'Simone', type: 'person', familyName: 'Hornemann' }, role: 'author' }, { actor: { firstName: 'Philipp J.', type: 'person', familyName: 'Kahle' }, role: 'author' }, { actor: { firstName: 'Matthias M.', type: 'person', familyName: 'Schneider' }, role: 'author' }, { actor: { firstName: 'Mehtap', type: 'person', familyName: 'Bacioglu' }, role: 'author' }, { actor: { firstName: 'Therese W.', type: 'person', familyName: 'Herling' }, role: 'author' }, { actor: { firstName: 'Nora', type: 'person', familyName: 'Bengoa-Vergniory' }, role: 'author' }, { actor: { firstName: 'Ronald', type: 'person', familyName: 'Melki' }, role: 'author' }, { actor: { firstName: 'Andr\u00e8s', type: 'person', familyName: 'Gonzalez-Guerra' }, role: 'author' }, { actor: { firstName: 'Natalie', type: 'person', familyName: 'Landeck' }, role: 'author' }, { actor: { firstName: 'Merve', type: 'person', familyName: 'Avar' }, role: 'author' }, { actor: { firstName: 'Marc', type: 'person', familyName: 'Emmenegger' }, role: 'author' }, { actor: { firstName: 'Tuomas P. J.', type: 'person', familyName: 'Knowles' }, role: 'author' }, { actor: { firstName: 'Pierre', type: 'person', familyName: 'de Rossi' }, role: 'author' }, { actor: { firstName: 'Alice', type: 'person', familyName: 'Kaganovich' }, role: 'author' }, { actor: { firstName: 'Adriano', type: 'person', familyName: 'Aguzzi' }, role: 'author' }, { actor: { firstName: 'Lisa M.', type: 'person', familyName: 'H\u00e4sler' }, role: 'author' }, { actor: { firstName: 'Rebekah G.', type: 'person', familyName: 'Langston' }, role: 'author' }, { actor: { firstName: 'Elena', type: 'person', familyName: 'De Cecco' }, role: 'author' }, { actor: { firstName: 'Elena', type: 'person', familyName: 'Tantardini' }, role: 'author' }, { actor: { firstName: 'Naunehal S.', type: 'person', familyName: 'Matharu' }, role: 'author' }, { actor: { firstName: 'Timo', type: 'person', familyName: 'Eninger' }, role: 'author' }, { actor: { firstName: 'Daniel', type: 'person', familyName: 'Heinzer' }, role: 'author' }, { actor: { firstName: 'Marian', type: 'person', familyName: 'Hruska-Plochan' }, role: 'author' }, { actor: { firstName: 'Mark R.', type: 'person', familyName: 'Cookson' }, role: 'author' }],
          }],
          inputs: [{ uri: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NLvJytCLEeu80AcUa4ddWQ' },
            { uri: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NHzJFNCLEeuVtHPfNKpeXA' },
            { uri: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NFUoPNCLEeun7-eddskxjg' }],
        },
        '_:b-336d69dd-06d2-484b-8866-256ea5bbc384': {
          'next-step': '_:b-78200b4c-48b8-4d64-b0d0-bfc99453d5f0',
          assertions: [{ item: 'https://doi.org/10.1101/2021.04.25.441302', status: 'reviewed' }],
          actions: [{
            outputs: [{
              published: '2021-06-18T23:16:26.146515+00:00',
              type: 'review',
              uri: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NLvJytCLEeu80AcUa4ddWQ',
              content: [{ type: 'web-page', url: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NLvJytCLEeu80AcUa4ddWQ' }],
            }],
            participants: [{ actor: { name: 'anonymous', type: 'person' }, role: 'peer-reviewer' }],
          }, {
            outputs: [{
              published: '2021-06-18T23:16:26.845853+00:00',
              type: 'review',
              uri: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NHzJFNCLEeuVtHPfNKpeXA',
              content: [{ type: 'web-page', url: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NHzJFNCLEeuVtHPfNKpeXA' }],
            }],
            participants: [{ actor: { name: 'anonymous', type: 'person' }, role: 'peer-reviewer' }],
          }, {
            outputs: [{
              published: '2021-06-18T23:16:26.414609+00:00',
              type: 'review',
              uri: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NFUoPNCLEeun7-eddskxjg',
              content: [{ type: 'web-page', url: 'https://sciety.org/articles/activity/10.1101/2021.04.25.441302#hypothesis:NFUoPNCLEeun7-eddskxjg' }],
            }],
            participants: [{ actor: { name: 'anonymous', type: 'person' }, role: 'peer-reviewer' }],
          }],
          inputs: [{
            published: '2021-04-26T00:00:00Z',
            uri: 'https://doi.org/10.1101/2021.04.25.441302',
            doi: '10.1101/2021.04.25.441302',
          }],
        },
      },
    },
  })),
);
