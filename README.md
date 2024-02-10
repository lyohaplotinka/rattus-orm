<p align="center">
  <img style="margin-right: -15px" width="192px" src="./assets/logo.svg" alt="Rattus ORM">
</p>

<h1 align="center">Rattus ORM</h1>

<p align="center">
  <img alt="bundle size (core)" src="https://img.shields.io/bundlephobia/minzip/%40rattus-orm%2Fcore">
  <img alt="npm version (core)" src="https://img.shields.io/npm/v/%40rattus-orm%2Fcore">
</p>

> **Note**: Rattus ORM is currently in its early stages of development. We welcome feedback and contributions to help improve and evolve the package.

Rattus ORM is a versatile JavaScript/TypeScript package that offers an Object-Relational Mapping (ORM) like experience for JS/TS applications. It is developed based on the source code of "vuex-orm-next", ensuring compatibility with its API while broadening its applicability beyond specific state managers.

### Features

- **Zero-dependency**: no Normalizr or other libraries.
- **Flexible Integration**: Designed to work with any front-end state management library, providing a versatile solution for state handling.
- **Source Code Foundation**: Built upon the source code of ["vuex-orm-next"](https://next.vuex-orm.org/) – the next iteration of Vuex ORM.
- **Intuitive Syntax**: Simplifies the handling of complex data structures in front-end applications with an ORM-like approach.
- **TypeScript Support**: Offers full TypeScript support for type safety and an enhanced development experience.
- **Efficient Data Management**: Optimized for front-end data operations, ensuring efficient and reactive state management.

### Packages
#### Integrations:
* [@rattus-orm/core](./packages/core): core of Rattus ORM
* [@rattus-orm/vuex](./packages/vuex): vuex data provider (vue)
* [@rattus-orm/pinia](./packages/pinia): pinia data provider (vue)
* [@rattus-orm/react-redux](./packages/react-redux): redux data provider (react)
* [@rattus-orm/react-mobx](./packages/react-mobx): mobx data provider (react)
* [@rattus-orm/react-signals](./packages/react-signals): signals data provider (react)
* [@rattus-orm/solidjs](./packages/react-signals): Solid.js data provider
* [@rattus-orm/local-storage](./packages/local-storage): localStorage data provider

#### Plugins:
* [@rattus-orm/plugin-zod-validate](./packages/plugin-zod-validate): validate your data with Zod

### Documentation
For more detailed usage and API documentation, please visit [Rattus ORM Documentation](https://lyohaplotinka.github.io/rattus-orm/).

### Contributing
Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details 
on our code of conduct, and the process for submitting pull requests.

### License
Rattus ORM is open-sourced software licensed under the [MIT License](./LICENSE).
