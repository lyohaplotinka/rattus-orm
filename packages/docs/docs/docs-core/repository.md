---
sidebar_position: 6
---
# Repository

### Basics

:::info[Info]
This part of the documentation is written following `vuex-orm-next`.
However, Rattus ORM is more oriented towards working with
TypeScript and decorators.
:::

Like Vuex ORM, Rattus ORM supports the "Data
Mapper" pattern for interacting with the store. The
Data Mapper pattern is one of the traditional implementations of ORM.
Using the Data Mapper approach, you define all
query methods in separate classes called
"repositories", and retrieve, insert,
update, and delete objects using these repositories.

In Data Mapper, your models are almost ignorant — they just
define their properties and may have some
"dummy" methods. Simply put, Data Mapper is an approach to accessing your database in
repositories, not in models.

### Getting the Repository for a Model

To get a repository, the method of the
Database object is used:

```typescript
const userRepo = db.getRepository(User)
userRepo.save(...)
```

In the basic implementation of the repository, there are many methods
suitable for working with data. You can
familiarize yourself with them in the Vuex ORM Next documentation:

:::info[Info]
Remember that the documentation in the links below is based on
Vuex. Replace `store.$repo` with the result of the
`getRepository` method of the `Database` object.
:::

1. [Retrieving Data](https://next.vuex-orm.org/guide/repository/retrieving-data.html)
2. [Inserting Data](https://next.vuex-orm.org/guide/repository/inserting-data.html)
3. [Updating Data](https://next.vuex-orm.org/guide/repository/updating-data.html)
4. [Deleting Data](https://next.vuex-orm.org/guide/repository/deleting-data.html)

### Customizing the Repository

If you want to add your own methods to the repository, you
can inherit a class from the base implementation.
Link it to the model using the `use` property:

```typescript
import { Repository } from '@rattus-orm/core'
import Post from '@/models/Post'

export class PostRepository extends Repository<Post> {
  public use = Post
  
  public myMethod() {
    // ...
  }
}
```

You have two options for using a custom repository. The first is to 
directly create an instance of it, passing the database to the 
constructor, and then call the `initialize` method:
```typescript
const postRepository = new PostRepository(database).initialize()
postRepository.myMethod()
```

The second option is to register the repository in the database, so 
that you automatically get the desired class when calling the 
`getRepository` method:
```typescript
const db = createDatabase({
  dataProvider: new MyDataProvider(),
  connection: 'entities',
  customRepositories: [PostRepository]
}).start()

// or dynamically
database.registerCustomRepository(PostRepository)

const postRepository = db.getRepository<PostRepository>(Post)
postRepository.myMethod()
```
This will also work with the context (in integrations):
```typescript
const postRepository = useRattusContext().$repo<PostRepository>(Post)
postRepository.myMethod()
```

:::info[Important (for TypeScript)]
The `getRepository` method in the database and `$repo` in the context by default return the type `Repository<your_model>`. Don't forget to pass the type of your repository as a generic argument to the respective method.
:::

