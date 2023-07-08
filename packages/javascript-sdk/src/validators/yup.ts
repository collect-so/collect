import { ValidationError } from 'yup'

import type { Validator } from '../types'

export const yupValidator: Validator = (schema) => async (values) => {
  try {
    await schema.validate(values)
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new Error(error.message, {
        cause: error.cause
      })
    } else {
      throw error
    }
  }
}
