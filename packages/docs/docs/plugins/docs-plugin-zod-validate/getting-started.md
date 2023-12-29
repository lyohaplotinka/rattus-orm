---

sidebar_position: 1

---

# Introduction

`@rattus-orm/plugin-zod-validate` is a plugin for Rattus ORM, designed to validate your data in models using the [Zod](https://zod.dev/) library.

Key features:
1. Works with any Data Provider;
2. Automatically creates Zod types for basic field types: string, number, boolean;
3. Strict mode - throws an error on unsuccessful validation (default is a warning in the console);
4. Option to configure strict mode for specific models;
5. Ability to define a custom validator for fields;
6. Supports decorators for fields.
