import {} from '@collect.so/javascript-sdk'
import { Models } from './src/models'

declare module '@collect.so/javascript-sdk' {
  export interface CollectModels extends Models {}
}
