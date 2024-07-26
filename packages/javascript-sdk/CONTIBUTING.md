# Contributing

---
We need to keep every import with preserved `.js` extension.

Explicitly including the `.js` extension in ESM imports ensures that modules are correctly resolved in Node.js and browser
environments, complies with the ECMAScript module specification, and maintains consistency and compatibility across
different tools and platforms.

Here is regexp to match broken imports:
```bash
import\s+[^'"\n]*\s*['"][^'"\n]*(?<!\.js)['"]
```