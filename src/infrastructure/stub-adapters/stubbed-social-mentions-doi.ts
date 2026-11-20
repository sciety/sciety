import * as EDOI from '../../types/expression-doi';
import * as PH from '../../types/publishing-history';

const stubbedSocialMentionsDoi = EDOI.fromValidatedString('10.1101/2024.05.01.592000');

export const hasStubbedSocialMentions = (history: PH.PublishingHistory): boolean => (
  PH.getAllExpressionDois(history).includes(stubbedSocialMentionsDoi)
);
