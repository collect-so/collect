# PNPM monorepo example

## Workflow

[Publish to registry](https://adevait.com/software/publish-private-npm-packages-with-github-package-registry)

### Adding new changesets

To generate a new changeset, run `pnpm changeset` in the root of the repository. The generated markdown files in the .changeset directory should be committed to the repository.

### Releasing changes

1. Run `pnpm run version`. This will bump the versions of the packages previously specified with pnpm changeset (and any dependents of those) and update the changelog files.
2. Run `pnpm i`. This will update the lockfile and rebuild packages.
   Commit the changes.
3. Run `pnpm run publish`. This command will publish all packages that have bumped versions not yet present in the registry.

### Consuming registry

1. Create `.pnpmrc` file with following contents

```
@kumomiX:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_AUTH_TOKEN}
```

2. Run `pnpm i @kumomix/ui-kit-a`.
