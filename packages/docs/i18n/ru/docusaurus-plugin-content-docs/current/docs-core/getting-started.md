---
sidebar_position: 1
---

# Начало работы

`@rattus-orm/core` предоставляет основной функционал
взаимодействия с данными. В простых словах, можно
сказать, что есть всего 4 основных понятия: 
* База данных – объект, связывающий все части вместе;
* Модель – класс, описывающий поля определенной сущности;
* Репозиторий – сервис для управления данными конкретной Модели;
* Запрос (query) – сервис для составления комплексных запросов.

Каждый из них полагается Data Provider – отдельный
класс, реализующий связь с каким-либо хранилищем.
Пакет "core" включает в себя провайдер для работы
с обычным JavaScript-объектом (`ObjectDataProvider`). 

С помощью data provider можно связать ORM с любым
синхронным хранилищем данных. Основные операции 
записи и чтения происходят с его помощью. 

Оптимизация взаимодействия с конкретным хранилищем
также происходит на уровне data provider. Все методы
других частей приложения так или иначе обращаются к нему. 



