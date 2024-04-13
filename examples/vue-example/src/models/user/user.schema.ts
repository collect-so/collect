import type { CollectSchema } from '@collect.so/javascript-sdk'
import { asyncRandomNumber } from '@/utils/utils'

// temp disabled
// export const userSchema: CollectSchema = {
export const userSchema = {
  age: { type: 'number' },
  dob: { required: false, type: 'datetime' },
  id: { type: 'number', default: asyncRandomNumber },
  married: { type: 'boolean' },
  username: { type: 'string', uniq: true }
} as const
