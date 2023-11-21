---
sidebar_position: 1
---

# Getting Started

`@rattus-orm/core` provides the essential functionality for data interaction. In simple terms, there are four main concepts:
* **Database** – an object that ties all parts together;
* **Model** – a class describing the fields of a specific entity;
* **Repository** – a service for managing data of a particular Model;
* **Query** – a service for creating complex queries.

Each of these relies on a Data Provider – a separate class that establishes a connection with a storage system. The "core" package includes a provider for working with a standard JavaScript object (`ObjectDataProvider`).

With a data provider, you can connect the ORM to any synchronous data storage. It facilitates the main operations of reading and writing.

The optimization of interaction with a specific storage system also occurs at the data provider level. All methods of other parts of the application, in one way or another, refer to it.


