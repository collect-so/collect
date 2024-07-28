<div align="center">

![Collect Logo](https://raw.githubusercontent.com/collect-so/collect/main/collect-logo.svg)

# Collect SDK

> The Collect.so SDK for JavaScript and TypeScript

[![NPM Version](https://img.shields.io/npm/v/%40collect.so%2Fjavascript-sdk)](https://www.npmjs.com/package/@collect.so/javascript-sdk)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license "Go to license section")

![NPM Downloads](https://img.shields.io/npm/dw/%40collect.so%2Fjavascript-sdk)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40collect.so%2Fjavascript-sdk)


[![Made with Node](https://img.shields.io/badge/dynamic/json?label=node&query=%24.engines%5B%22node%22%5D&url=https%3A%2F%2Fraw.githubusercontent.com%2Fcollect-so%2Fcollect%2Fmaster%2Fpackage.json)](https://nodejs.org "Go to Node.js homepage")
[![Package - Typescript](https://img.shields.io/github/package-json/dependency-version/collect-so/collect/dev/typescript?logo=typescript&logoColor=white)](https://www.npmjs.com/package/typescript "Go to TypeScript on NPM")

[Homepage](https://collect.so) — [Blog](https://collect.so/blog) — [Platform](https://app.collect.so) — [Docs](https://docs.collect.so) — [Examples](https://github.com/collect-so/examples)
</div>

## Features

---
- **Automatic Type Inference**: Enjoy seamless type safety with automatic TypeScript inference.
- **Isomorphic Architecture**: Fully compatible with both server and browser environments.
- **Zero Dependencies**: Lightweight and efficient with no external dependencies.
- **No Configuration Needed**: Plug-and-play design requires no setup or configuration.


## Installation

---
NPM:
```bash
npm install @collect.so/javascript-sdk
```

YARN:
```bash
yarn add @collect.so/javascript-sdk
```

PNPM:
```bash
pnmp add @collect.so/javascript-sdk
```


## Usage

---

1. **Obtain Collect API Token**: Grab your API token from the [Dashboard](https://app.collect.so).
2. **Setup Collect Instance**: Initialize your Collect instance with obtained token.
3. **(Optional) Define Data Models**: Tailor your data models to fit your needs.
4. **Manage Your Data**: Push, link, fetch, and manage your data effortlessly.

### TLDR;
```ts
/* ./your-app/src/collect.ts */

import CollectSDK, { CollectModel } from '@collect.so/sdk'

// Setup Collect instance
const Collect = new CollectSDK("API_TOKEN")

// Optionaly define Model
export const UserRepo = new CollectModel(
    'USER',
    {
        name: { type: 'string' },
        email: { type: 'string', uniq: true },
        verified: { type: 'boolean', default: false },
        hobbies: { type: 'string', multiple: true, requiered: false },
        rating: { type: 'number', default: 1 },
        created: { type: 'datetime', default: () => new Date().toISOString() },
        password: { type: 'string' }
    },
    Collect
)

// Create new Record
const newUser = await UserRepo.create({
    name: "John Galt",
    email: 'john.g@example.com',
    hobbies: ['Programming', 'Hiking'],
    password: '********'
})

// Find Records by specific criteria
const matchedUsers = await UserRepo.find({
    where: {
        email: { $ne: 'john.g@example.com' },
        hobbies: { $in: ['Hiking'] },
        rating: { $gte: 1.5 }
    }
})
```

<div align="center">
<b>You're Awesome!</b>  🚀
</div>

---

<div align="center" style="margin-top: 20px">

> Check the [Docs](https://docs.collect.so) and [Examples Repository](https://github.com/collect-so/examples) to learn more 🤓


</div>


## Contributing

---
See [CONTRIBUTING.md](CONTRIBUTING.md).

