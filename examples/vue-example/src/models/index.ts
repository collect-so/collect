import { userModel } from '@/models/user/user.model'
import { postModel } from '@/models/post/post.model'

export type Models = {
  user: typeof userModel.schema
  post: typeof postModel.schema
}

export { userModel, postModel }
