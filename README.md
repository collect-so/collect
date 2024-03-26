# Collect

### Adding new changesets

To generate a new changeset, run `pnpm changeset` in the root of the repository. The generated markdown files in the .changeset directory should be committed to the repository.

### Releasing changes

1. Run `pnpm run version`. This will bump the versions of the packages previously specified with pnpm changeset (and any dependents of those) and update the changelog files.
2. Run `pnpm i`. This will update the lockfile and rebuild packages.
   Commit the changes.
3. Run `pnpm run publish`. This command will publish all packages that have bumped versions not yet present in the registry.

