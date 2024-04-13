import type { CollectSchema } from '@collect.so/javascript-sdk'

// temp disabled
// export const postSchema: CollectSchema = {
export const postSchema = {
  created: { type: 'datetime', default: () => new Date().toISOString() },
  title: { type: 'string' },
  content: { type: 'string' },
  rating: { type: 'number', required: false }
} as const
