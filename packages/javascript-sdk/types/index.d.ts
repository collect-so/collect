declare module '@collect.so/javascript-sdk' {
  import { CollectRestAPI, UserProvidedConfig } from '../src/types'
  import { Result } from '../src/core/result'
  export namespace Collect {}

  export class Collect extends Result {
    static Collect: typeof Collect;

    constructor(token: string, config?: UserProvidedConfig);
    public api: CollectRestAPI
  }

  export default Collect;
}