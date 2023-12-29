---
sidebar_position: 1
---

# Введение

`@rattus-orm/plugin-zod-validate` - это плагин для Rattus ORM, позволяющий валидировать ваши данные
в моделях при помощи библиотеки [Zod](https://zod.dev/).

Основные возможности: 
1. Работает с любым Data Provider;
2. Автоматическое создание типов Zod для базовых типов полей: string, number, boolean;
3. Строгий режим - выбрасывает ошибку при неудачной валидации (по умолчанию - warning в консоль);
4. Возможность настроить строгий режим для конкретных моделей;
5. Возможность определить свой валидатор для полей;
6. Поддержка декораторов для полей.