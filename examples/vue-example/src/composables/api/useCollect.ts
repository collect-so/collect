import Collect, { CollectModel } from '@collect.so/javascript-sdk'
import { createInjectionState } from '@vueuse/core'
import { userSchema } from '@/models/user/user.schema'
import { postSchema } from '@/models/post/post.schema'
import { postModel, userModel } from '@/models'
import type { CollectTransaction } from '@collect.so/javascript-sdk/types/sdk/transaction'

const COLLECT_SDK_TOKEN =
  '34349973e77ab1b40f3edcb40ed0708fnXIdbKDFUBGksR2hsLH12pJGb8BSPiOfAEG0ZbX303OnoApMHIW73cZRL+UnGTET'

const [useProvideCollect, useCollectInjection] = createInjectionState(() => {
  const collectInstance = new Collect(COLLECT_SDK_TOKEN, {
    url: 'http://localhost'
  })

  // @TODO: how to export type into d.ts?
  // Common question: what to do if ur collect instance is in component lifecycle
  const userRepo = collectInstance.registerModel(userModel)
  const postRepo = collectInstance.registerModel(postModel)

  async function getUserById(id: string, tx?: CollectTransaction) {
    return userRepo.findById(id, tx)
  }

  return {
    collect: collectInstance,
    user: {
      repo: userRepo,
      getById: getUserById
    },
    post: postRepo
  }
})

export function useCollect() {
  const collect = useCollectInjection()

  if (!collect) {
    throw new Error('Please call `useProvideCollect` on the parent component')
  }

  return collect
}

export { useProvideCollect }
