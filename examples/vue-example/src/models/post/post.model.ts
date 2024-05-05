import { CollectModel } from '@collect.so/javascript-sdk'
import { postSchema } from '@/models/post/post.schema'

export const postModel = new CollectModel('post', postSchema)
