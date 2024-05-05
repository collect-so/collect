import { CollectModel } from '@collect.so/javascript-sdk'
import { userSchema } from '@/models/user/user.schema'

export const userModel = new CollectModel('user', userSchema)
