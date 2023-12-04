declare module '@collect.so/javascript-sdk' {
  import { createApi } from '../src/core/api'
  import { UserProvidedConfig } from '../src/types'
  export namespace Collect {}

  export class Collect extends ReturnType<typeof createApi>{
    static Collect: typeof Collect;

    constructor(apiKey: string, config?: UserProvidedConfig);
  }

  export default Collect;
}