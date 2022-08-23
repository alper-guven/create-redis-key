/* eslint-disable @typescript-eslint/no-unused-vars */
import { assert, expect } from 'chai';
import {
	createRedisKey,
	createRedisKeyParam,
	createRedisKeysMap,
	RedisKeysConfig,
} from '../src';
import { IsReadonlyConfig } from '../src/types/create-redis-key/crk-redis-key-config';

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

// Type checks as tests
type IsNever<T, K extends [T] extends [never] ? true : false> = [T] extends [
	never
]
	? true
	: false;

type YesOrNo<T, K extends 'yes' extends T ? 'yes' : 'no'> = 'x';

// // ? Valid config & readonly (which is what's needed for the map)
// const customObj = {
// 	SCOPE_FIRST_PART: ['1111'],
// 	asdlasds: ['asdasd'],
// 	scope: {
// 		SCOPE_FIRST_PART: ['2222'],
// 		asdasd: ['asdasd'],
// 	},
// } as const;
// type isReadonly_1 = YesOrNo<IsReadonlyConfig<typeof customObj>, 'yes'>;
// const map1 = createRedisKeysMap(customObj);
// type isValidCFG_1 = IsNever<typeof map1, false>;

// // ? Valid config but is not readonly (so it's not valid for the map)
// const customObj2 = {
// 	SCOPE_FIRST_PART: ['1111'],
// 	qwelxqwe: 'qweqwe',
// };
// type isReadonly_2 = YesOrNo<IsReadonlyConfig<typeof customObj2>, 'no'>;
// const map2 = createRedisKeysMap(customObj2);
// type isValidCFG_2 = IsNever<typeof map2, true>;

// // ? Invalid config (so it's not valid for the map)
// const customObj3 = {
// 	ajkdjkasjkd: 'asdasd',
// };
// type isReadonly_3 = YesOrNo<IsReadonlyConfig<typeof customObj3>, 'no'>;
// const map3 = createRedisKeysMap(customObj3);
// type isValidCFG_3 = IsNever<typeof map3, true>;

describe('Create Redis Key', function () {
	describe('Only Key Creator', function () {
		it('should return empty string', function () {
			assert.equal(createRedisKey('', null), '');
		});

		it('should return test', function () {
			assert.equal(createRedisKey('test', null), 'test');
		});

		it('should return my:redis:key:1234', function () {
			assert.equal(
				createRedisKey('my:redis:key:%KeyID%', {
					KeyID: '1234',
				}),
				'my:redis:key:1234'
			);
		});

		it('should throw error when an empty string given as param value', function () {
			expect(() =>
				createRedisKey('my:redis:key:%KeyID%', {
					KeyID: '',
				})
			).to.throw(
				'Redis Key Template String has param named <KeyID>, but given value <> is invalid.'
			);
		});
	});

	describe('Redis Keys Templates Map Creation', function () {
		it('should throw error when given an empty string as delimiter', function () {
			expect(() => createRedisKeysMap(redisKeysConfig, '')).to.throw(
				'Delimiter cannot be empty string'
			);
		});

		it('should throw error when given % as delimiter', function () {
			expect(() => createRedisKeysMap(redisKeysConfig, '%')).to.throw(
				'Invalid delimiter. Delimiter cannot be "%". This is used for params in Redis Key templates.'
			);
		});

		it('should throw error when given a non string param value as delimiter', function () {
			// @ts-expect-error : Testing invalid input
			expect(() => createRedisKeysMap(redisKeysConfig, 1)).to.throw(
				'Delimiter must be a string'
			);
		});

		it('should throw error when given an invalid config (invalid prop)', function () {
			const randomObject = {
				SCOPE_FIRST_PART: [],
				asddasd: 'asdasd',
				asdasd: 'asdasd',
				asdasd123123: 1,
			};

			expect(() => {
				const testRandomObject = createRedisKeysMap(randomObject);
			}).to.throw('Redis Key Config is not valid');
		});

		it('should throw error when given an invalid config (no SCOPE_FIRST_PART)', function () {
			const randomObject = {
				key1: ['key1'],
				key2: ['key2'],
			};

			expect(() => {
				const testRandomObject = createRedisKeysMap(randomObject);
			}).to.throw(
				'Redis Key Config is not valid: Config Object itself is not a valid Redis Key Scope'
			);
		});

		it('should throw error when given an invalid config (invalid SCOPE_FIRST_PART)', function () {
			const randomObject = {
				SCOPE_FIRST_PART: 1,
				key1: ['key1'],
				key2: ['key2'],
			};

			expect(() => {
				const testRandomObject = createRedisKeysMap(randomObject);
			}).to.throw(
				'Redis Key Config is not valid: Redis Template Array must be an array of strings or Redis Key Param objects'
			);
		});
	});

	describe('Use Valid Config to Create Key (Without Optional Delimiter)', function () {
		const redisKeysMap = createRedisKeysMap(redisKeysConfig);

		it('should return key app-status', function () {
			assert.equal(createRedisKey(redisKeysMap.appStatus, null), 'app-status');
		});

		it('should return key for restaurants by category', function () {
			assert.equal(
				createRedisKey(redisKeysMap.restaurants.byCategory, {
					CategoryID: '1234',
				}),
				'RESTAURANTS:by-category:1234'
			);
		});

		it('should return key for restaurants by city', function () {
			assert.equal(
				createRedisKey(redisKeysMap.restaurants.byCity, {
					CityID: '1234',
				}),
				'RESTAURANTS:1234'
			);
		});

		// previous deliveries of courier with id 1234
		it('should return key for previous deliveries of courier with id 1234', function () {
			assert.equal(
				createRedisKey(redisKeysMap.couriers.byID.PreviousDeliveries, {
					CourierID: '1234',
				}),
				'couriers:by-id:1234:previous-deliveries'
			);
		});

		// orders of user with id 1234
		it('should NOT return key for orders of user with id 1234', function () {
			assert.notEqual(
				createRedisKey(redisKeysMap.orders.byUser, {
					UserID: '1234',
				}),
				'orders:of-user:'
			);
		});
	});

	describe('Use Valid Config to Create Key (With Optional Delimiter)', function () {
		it('should return key for restaurants by category with given delimiter (.)', function () {
			const redisKeysMap_WithCustomDelimiter = createRedisKeysMap(
				redisKeysConfig,
				'.'
			);

			assert.equal(
				createRedisKey(
					redisKeysMap_WithCustomDelimiter.restaurants.byCategory,
					{
						CategoryID: '1234',
					}
				),
				'RESTAURANTS.by-category.1234'
			);
		});
	});
});
