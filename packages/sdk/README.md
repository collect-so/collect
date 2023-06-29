# Collect SDK

```ts
// lib/db.js
export const collect = new Collect().init({ token: env.token })

collect.registerModel('Movie', object({ name: string() }))

// features/movies.js
import { collect } from 'lib/db'

const createMovie = async () => {
  const movie = await collect.create('Movie', { name: 'Forrest Gump' })
  await movie.update('Movie', {})
}
```
