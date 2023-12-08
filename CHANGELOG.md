# 2023/12/08
_For all: update dependencies_

### Utils (0.0.6)
* add common `DatabaseLike` type.

### Core (0.0.14)
* function `createRattusContext` for unified usage in integrations;

### Vuex (0.0.13), Pinia (0.0.5)
* use new `createRattusContext` in plugin, add ability to customize database.

### React Signals (0.0.1)
* introducing React integration with React Signals.


# 2023/12/07
### Utils (0.0.5)
* add common `RattusOrmInstallerOptions` type.

### Core (0.0.13)
* add `RattusContext` class for unified context management.

### Vuex (0.0.12)
* add `useRattusContext` composable;
* refactor plugin to work with `RattusContext` from core;
* `installRattusORM` plugin now uses `RattusOrmInstallerOptions` type.

### Pinia (0.0.4)
* rename plugin function: `rattusOrmPiniaVuePlugin` => `installRattusOrm`;
* plugin function now uses `RattusOrmInstallerOptions` type.

# 2023/12/01
### Utils (0.0.3)
* remove "main" entries from package.json.

### Core (0.0.11)
* bye-bye Normalizr.js, internal normalization;
* refactor orderBy in query.

### Vuex (0.0.10), Pinia (0.0.2)
* use new core

# 2023/11/29
### Utils (0.0.2)
* basic types moved to Utils package;
* enable code-split for bundle.

### Core (0.0.10)
* types adjust for Utils package;
* package.json reviewed.

### Vuex (0.0.9)
* types adjust for Utils package;
* package.json reviewed.

### Pinia (0.0.1)
* introducing Pinia integration.

# 2023/11/26
### Utils (0.0.1)
* introduce utils package

### Core (0.0.9)
* apply test for ObjectDataProvider;
* use `@rattus-orm/utils`.

### Vuex (0.0.8)
* use `@rattus-orm/utils`.

# 2023/11/24
### Core (0.0.8):
* Introduce DataProviderHelpers utility class;
* cleaner types for DataProvider interface;
* ObjectDataProvider matches updated interface.

### Vuex (0.0.7):
* remove "destroy" mutation as it duplicates "delete";
* prevent VuexDataProvider from registering modules twice;
* VuexDataProvider matches updated interface.

### Docs:
* update docs about Data provider;
* fix typo.

# 2023/11/23
* Project started
