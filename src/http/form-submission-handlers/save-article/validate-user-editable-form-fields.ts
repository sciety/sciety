import * as O from 'fp-ts/Option';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { ValidationRecovery } from '../../../html-pages/validation-recovery/validation-recovery';
import { FormBody, userEditableFormFieldsCodec } from './form-body';
import { rawUserInput } from '../../../read-side';

const validateConflictOfInterestContent = (formBody: FormBody) => {
  if (O.isNone(formBody.conflictOfInterest)) {
    return O.none;
  }
  if (formBody.conflictOfInterest.value === 'yes' && formBody.conflictOfInterestContent.content.length === 0) {
    return O.some('Enter details of your competing interest');
  }
  if (formBody.conflictOfInterestContent.content.length > 5) {
    return O.some('The details about your competing interest must be 5 characters or less');
  }
  return O.none;
};

export const validateUserEditableFormFields = (
  formBody: FormBody,
): ValidationRecovery<t.TypeOf<typeof userEditableFormFieldsCodec>> => (
  {
    annotation: {
      userInput: formBody.annotation,
      error: formBody.annotation.content.length > 4000 ? O.some('Your annotation may not exceed 4000 characters') : O.none,
    },
    conflictOfInterest: {
      userInput: pipe(
        formBody.conflictOfInterest,
        O.getOrElse(() => ''),
        rawUserInput,
      ),
      error: O.isNone(formBody.conflictOfInterest) ? O.some('Select if you have a conflict of interest') : O.none,
    },
    conflictOfInterestContent: {
      userInput: formBody.conflictOfInterestContent,
      error: validateConflictOfInterestContent(formBody),
    },
  }
);
