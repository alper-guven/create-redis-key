# Create Redis Key

A Redis key creation utility.

Create `Redis Key Templates`, which include parameters, using a nested config object & use your `Redis Key Template` strings to create Redis Keys.

> This package heavily uses [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) which is available since [TypeScript 4.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html) so you need at least this version of Typescript for this package to properly work.

| ![npm](https://img.shields.io/npm/dm/create-redis-key?style=for-the-badge) | [![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/) | [!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/alperguven) |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |

## Examples

[See it on action (StackBlitz)](https://stackblitz.com/edit/create-redis-key?file=src/index.ts&view=editor)

Check [How to Use](#usage) section to see explanations of usage options on examples.

## Sections

- [Installation](#installation)
- [How It Works](#how-it-works)
- [How to Use](#usage)
  - [Option 1 (Recommended)](#option-1-recommended)
  - [Option 2](#option-2)
  - [Option 3 (Basic)](#option-2)
- [Documentation](#documentation)
  - [Terms](#documentation---terms)
  - [Functions](#documentation---functions)
- [FAQ](#faq)
- [Running Tests](#running-tests)
- [Local Development](#local-development)
- [Contributing](#contributing)

## Installation

Install [create-redis-key](https://www.npmjs.com/package/create-redis-key) with npm

```bash
  npm install create-redis-key
```

Type definitions? Included!

## How It Works

Eventual purpose of this library is to create a `Redis Key` (which is basically a string) using a template which we call in this library a `Redis Key Template`.

There is a function called `createRedisKey()` which takes a `Redis Key Template` and an object which includes values for the params in the `Redis Key Template`, then replaces parameters in template with the given values.

Most basic usage is as follows:

```typescript
const blogPostRK = createRedisKey('posts:%PostID%', {
	PostID: '1',
});
```

This creates a `string` which equals to `posts:1`

There are 3 ways you can use this library.

- Create a `Redis Key Templates Map` using `createRedisKeysMap()` to use it in conjunction with `createRedisKey()` to create Redis keys.
- Create an object which has keys shaped as a `Redis Key Template` and use it in conjunction with `createRedisKey()` to create Redis keys.
- Just use `createRedisKey()` function by writing your `Redis Key Template` as parameter to create a Redis key.

There are detailed explanations for each of them down below.

## Usage

There are 3 ways you can use this library. Examples for different options show how you can get the same output using different methods.

> You will get parameter suggestions on your IDE based on the `Redis Key Template` you provided to `createRedisKey()` function.

> All params on a `Redis Key Template` are required. You will get type errors if you don't provide all of them.

First of all, import needed functions as follows:

```typescript
import {
	createRedisKeyParam,
	createRedisKeysMap,
	createRedisKey,
} from 'create-redis-key';
```

or using require

```javascript
var CRK = require('create-redis-key');

const { createRedisKeyParam, createRedisKeysMap, createRedisKey } = CRK;
```

### Option 1 (Recommended)

Create a `Redis Keys Config` object.

> You should write `as const` at the end of the object for things to properly work.

```typescript
const redisKeysConfig = {
	SCOPE_FIRST_PART: [],

	appStatus: ['app-status'],

	restaurants: {
		SCOPE_FIRST_PART: ['RESTAURANTS'],
		byCategory: ['by-category', createRedisKeyParam('CategoryID')],
		byCity: [createRedisKeyParam('CityID')],
	},

	categories: {
		SCOPE_FIRST_PART: ['categories'],
		byID: [createRedisKeyParam('CategoryID')],
	},

	users: {
		SCOPE_FIRST_PART: ['users'],
		online: ['online'],
		withActiveOrder: ['with-active-order'],
		byID: ['by-id', createRedisKeyParam('UserID')],
	},

	couriers: {
		SCOPE_FIRST_PART: ['couriers'],
		Online: ['online'],
		OnDelivery: ['on-delivery'],
		byID: {
			SCOPE_FIRST_PART: ['by-id', createRedisKeyParam('CourierID')],
			PreviousDeliveries: ['previous-deliveries'],
		},
	},

	orders: {
		SCOPE_FIRST_PART: ['orders'],
		byUser: ['of-user', createRedisKeyParam('UserID')],
		byCity: {
			SCOPE_FIRST_PART: ['by-city', createRedisKeyParam('CityName')],
			byCourier: ['of-courier', createRedisKeyParam('CourierID')],
		},
	},
} as const;
```

Then create a `Redis Keys Templates Map` using the config:

> If you give an invalid config, return type will be `never`. I explained why it works this way at [FAQ](#faq) section.

```typescript
const RedisKeysMap = createRedisKeysMap(exampleRedisKeysConfig);
```

It will create a `Redis Keys Templates Map`

```js
{
  appStatus: 'app-status',
  restaurants: {
    byCategory: 'RESTAURANTS:by-category:%CategoryID%',
    byCity: 'RESTAURANTS:%CityID%',
  },
  categories: {
    byID: 'categories:%CategoryID%',
  },
  users: {
    online: 'users:online',
    withActiveOrder: 'users:with-active-order',
    byID: 'users:by-id:%UserID%',
  },
  couriers: {
    Online: 'couriers:online',
    OnDelivery: 'couriers:on-delivery',
    byID: {
      PreviousDeliveries: 'couriers:by-id:%CourierID%:previous-deliveries',
    },
  },
  orders: {
    byUser: 'orders:of-user:%UserID%',
    byCity: {
      byCourier: 'orders:by-city:%CityName%:of-courier:%CourierID%',
    },
  },
}
```

You can then use this map to create a Redis key when needed:

This will produce `couriers:by-id:1234:previous-deliveries`

```typescript
const previousDeliveriesOfCourierRK = createRedisKey(
	RedisKeysMap.couriers.byID.PreviousDeliveries,
	{
		CourierID: '1234',
	}
);
```

Create another key using map:

This will produce `orders:by-city:istanbul:of-courier:1234`

```typescript
const latestOrdersOfCourierInCityRK = createRedisKey(
	RedisKeysMap.orders.byCity.byCourier,
	{
		CourierID: '1234',
		CityName: 'istanbul',
	}
);
```

### Option 2

Instead of creating a `Redis Keys Templates Map` using `createRedisKeysMap()` with a config, you can write it yourself.

> You should write `as const` at the end of the object for things to properly work.

> When you write `Redis Key Templates` manually, be aware that it is much more error prone than using `Option 1`.

```typescript
const DeliveryServiceRedisKeyTemplatesMap = {
	appStatus: 'app-status',
	restaurantsByCategory: 'RESTAURANTS:by-category:%CategoryID%',
	users: 'users:with-active-order',
	previousDeliveriesOfCourier: 'couriers:by-id:%CourierID%:previous-deliveries',
	latestOrdersOfCourierInCity:
		'orders:by-city:%CityName%:of-courier:%CourierID%',
} as const;
```

Then you can use it just like shown on Option 1:

This will produce `orders:by-city:istanbul:of-courier:1234`

```typescript
const latestOrdersOfCourierInCityRK = createRedisKey(
	DeliveryServiceRedisKeyTemplatesMap.latestOrdersOfCourierInCity,
	{
		CourierID: '1234',
		CityName: 'istanbul',
	}
);
```

### Option 3

This is most basic usage of this package.

You can just write your `Redis Key Template` as a parameter:

This will produce `orders:by-city:istanbul:of-courier:1234`

```typescript
const latestOrdersOfCourierInCityRK = createRedisKey(
	'orders:by-city:%CityName%:of-courier:%CourierID%',
	{
		CourierID: '1234',
		CityName: 'istanbul',
	}
);
```

## Documentation

### Documentation - Terms

#### Redis Key Template

A string to be used as a template to create a Redis key.

Format: `a-key-part:%ParamName1%:another-key-part:%ParamName2%`

#### Redis Key Param

A part of `Redis Key Template` which represents a variable part of the key.

Format: `%ParamName%`

#### Redis Key Part

A part of `Redis Key Template` which is either a `Redis Key Param` or a `string`

Formats: `%ParamName%` | `random-text`

#### Redis Keys Config Template Array

An array of `Redis Key Part`

```typescript
const exampleTemplateArray = ['key1', createRedisKeyParam('Param1')];
```

#### Redis Keys Config Scope

Main building block of the a `Redis Keys Config`.

- It has to have a key named `SCOPE_FIRST_PART` which is a `Redis Keys Config Template Array`
- Other keys can be either a `Redis Keys Config Template Array` or a `Redis Keys Config Scope`

```typescript
const exampleScope = {
	SCOPE_FIRST_PART: [],
	key0: ['key0'],
	key1: ['key1', createRedisKeyParam('Param1')],
	key2: ['key2', createRedisKeyParam('Param2')],
	aNestedScope: {
		SCOPE_FIRST_PART: ['a-nested-scope', createRedisKeyParam('Param3')],
		scopedKey1: ['a-key-1'],
		scopedKey2: ['a-key-2', createRedisKeyParam('KeyParam')],
	},
};
```

#### Redis Keys Config

A config object to create `Redis Keys Template Map`

- This is actually a `Redis Keys Config Scope`

```typescript
const exampleRedisKeysConfig = {
	SCOPE_FIRST_PART: [],
	key1: ['a-random-text-1', createRedisKeyParam('Param1')],
	key2: ['another-text', createRedisKeyParam('Param2')],
	aNestedScope: {
		SCOPE_FIRST_PART: ['a-nested-scope', createRedisKeyParam('Param3')],
		scopedKey1: ['a-key-1', createRedisKeyParam('KeyParam')],
	},
} as const;
```

#### Redis Keys Template Map

This is the product of `createRedisKeysMap()` function.

Given the following config to `createRedisKeysMap()` function:

```typescript
const exampleRedisKeysConfig = {
	SCOPE_FIRST_PART: [],
	key1: ['a-random-text-1', createRedisKeyParam('Param1')],
	key2: ['another-text', createRedisKeyParam('Param2')],
	aNestedScope: {
		SCOPE_FIRST_PART: ['a-nested-scope', createRedisKeyParam('Param3')],
		scopedKey1: ['a-key-1', createRedisKeyParam('KeyParam')],
	},
} as const;
```

When you use this config to create a map:

```typescript
createRedisKeysMap(exampleRedisKeysConfig);
```

It will produce this object which is a `Redis Keys Template Map`:

```javascript
{
	key1: 'a-random-text-1:%Param1%';
	key2: 'another-text:%Param2%';
	aNestedScope: {
		scopedKey1: 'a-nested-scope:%Param3%:a-key-1:%KeyParam%';
	}
}
```

You can then use it with `createRedisKey()` to create Redis keys as needed.

### Documentation - Functions

#### createRedisKeyParam

`createRedisKeyParam(paramName: string)`

Creates a `Redis Key Param` object.

It can be used in a `Redis Keys Config Template Array` when creating `Redis Keys Config`

```typescript
const exampleRedisKeysConfig = {
	SCOPE_FIRST_PART: ['micro-service', createRedisKeyParam('ServiceID')],
	key1: ['a-random-text-1', createRedisKeyParam('Param1')],
	key2: [
		'another-text',
		createRedisKeyParam('Param2'),
		'another-part',
		createRedisKeyParam('Param3'),
	],
} as const;
```

#### createRedisKeysMap

```typescript
createRedisKeysMap(
  redisKeysConfig: Record<string, any>,
  optionalDelimiter: string | null
)
```

Creates a `Redis Keys Template Map` using a `Redis Keys Config` object.

Default delimiter is colon (`:`)

If you don't want to use a delimiter, give an empty string (`''`) to `optionalDelimiter` parameter.

> For most cases (like 95% of them), you will use a delimiter. Therefore I chose the most commonly used one (colon `:`), which is also used in official Redis tutorials, as the default delimiter.

> `redisKeysConfig` should be given as the example below. Otherwise you won't get suggestions on `createRedisKey()` and also Typescript will give an error when you try to provide parameter values.

> `readonly RedisKeysConfig` does not work. Only way is to write `as const` at the end of the config object.

Given the config following config:

```typescript
// a Redis Keys Config
const exampleRedisKeysConfig = {
	SCOPE_FIRST_PART: [],
	key1: ['a-random-text-1', createRedisKeyParam('Param1')],
	key2: ['another-text', createRedisKeyParam('Param2')],
	aNestedScope: {
		SCOPE_FIRST_PART: ['a-nested-scope', createRedisKeyParam('Param3')],
		scopedKey1: ['a-key-1', createRedisKeyParam('KeyParam')],
	},
} as const;
```

And called as follows:

```typescript
const exampleRedisKeysTemplateMap = createRedisKeysMap(exampleRedisKeysConfig);
```

It will produce this object which is a `Redis Keys Template Map`:

```javascript
{
	key1: 'a-random-text-1:%Param1%';
	key2: 'another-text:%Param2%';
	aNestedScope: {
		scopedKey1: 'a-nested-scope:%Param3%:a-key-1:%KeyParam%';
	}
}
```

#### createRedisKey

```typescript
createRedisKey(
  redisKeyTemplateString: string,
  params: Record<string, string>
): string
```

Creates a Redis key using a `Redis Key Template` and replacing parameters on template with given parameter values.

```typescript
const blogPostCommentRepliesRK = createRedisKey(
	'posts:%PostID%:comments:%CommentID%:replies',
	{
		PostID: '1234',
		CommentID: '9876',
	}
);
```

This creates a `string` which equals to `posts:1234:comments:9876:replies`

## FAQ

#### When I give a config object to `createRedisKeysMap()` it's output type is `never`. Why?

When you give an invalid config object to it, it returns `never` as a result type. Since I need your config as a readonly object, I can't make the parameter type `RedisKeysConfig` directly. So I need to accept an object, check if it is valid & make the return type `never` in order to make you aware that there is something wrong.

I now that it's a bad developer experience but I'm not sure if there is a way to solve this. Feel free to open an Issue to discuss this.

## Running Tests

To run tests, run the following command:

```bash
  npm run test
```

## Local Development

This an NPM package.

- When you make changes,
  - Build the project.
  - Create a new empty project.
  - [Link the local build to your test project](https://docs.npmjs.com/cli/v8/commands/npm-link).
  - Use your development version on your test project to see if it is working.
  - Write tests to verify that your new feature is working properly and also doesn't break anything.

## Contributing

Contributions are always welcome!

There are some basic rules though.

- **Be sure you don't break any existing type definitions.**
  - Developer Experience of this library depends on Typescript types.
  - Any change you make on type definitions might cause performance issues.
- **If you create a new Typescript type, write tests for it.**
  - Yes, really. Typescript is complicated and it isn't enough if it seems like it's working.
  - Check [TSD](https://www.npmjs.com/package/tsd) package to see how you can test types.
- **Write tests for your new feature.**
  - I won't accept any PR without additional tests.
  - I won't accept any PR if it can't pass existing tests.

## Authors

- [@alper-guven](https://www.github.com/alper-guven)

## License

[MIT](https://choosealicense.com/licenses/mit/)
