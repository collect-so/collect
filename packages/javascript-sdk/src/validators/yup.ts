import { ValidationError } from 'yup';
import { Validator } from './types.js'

export const yupValidator: Validator = (schema) => async (values) => {
  try {
    await schema.validate(values);
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ValidationError(error.message)
    } else {
      throw error;
    }
  }
};