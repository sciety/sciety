import * as O from 'fp-ts/Option';
import * as t from 'io-ts';
import { ValidationRecovery } from '../../../html-pages/validation-recovery/validation-recovery';
import { FormBody, userEditableFormFieldsCodec } from './form-body';

export const constructValidationRecovery = (
  formBody: FormBody,
): ValidationRecovery<t.TypeOf<typeof userEditableFormFieldsCodec>> => (
  {
    annotation: {
      userInput: formBody.annotation,
      error: formBody.annotation.content.length > 4000 ? O.some('Your annotation may not exceed 4000 characters') : O.none,
    },
  }
);
