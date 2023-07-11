import { UpdateEvaluationCommand } from '../write-side/commands';
import { CommandHandler } from '../types/command-handler';

export type UpdateEvaluation = CommandHandler<UpdateEvaluationCommand>;
