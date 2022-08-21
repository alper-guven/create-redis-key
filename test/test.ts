import assert from 'assert';
import {
	createRedisKey,
	createRedisKeyParam,
	createRedisKeysMap,
} from '../src';

const redisKeysConfig = {
	SCOPE_FIRST_PART: [],
	restaurants: {
		SCOPE_FIRST_PART: ['RESTAURANTS'],
		byCategory: ['by_category', createRedisKeyParam('CategoryID')],
		byCity: [createRedisKeyParam('CityID')],
	},

	categories: {
		SCOPE_FIRST_PART: ['categories'],
		byID: [createRedisKeyParam('CategoryID')],
	},

	users: {
		SCOPE_FIRST_PART: ['users'],
		online: ['online'],
		byID: ['by_id', createRedisKeyParam('UserID')],
	},

	couriers: {
		SCOPE_FIRST_PART: ['couriers'],
		Online: ['online'],
		OnDelivery: ['on-delivery'],
		byID: {
			SCOPE_FIRST_PART: ['by_id', createRedisKeyParam('CourierID')],
			PreviousDeliveries: ['previous-deliveries'],
		},
	},

	orders: {
		SCOPE_FIRST_PART: ['orders'],
		byUser: ['of_user', createRedisKeyParam('UserID')],
		byCity: {
			SCOPE_FIRST_PART: [createRedisKeyParam('CityName')],
			byCourier: ['of_courier', createRedisKeyParam('CourierID')],
		},
	},
} as const;

const redisKeysMap = createRedisKeysMap(redisKeysConfig);

const redisKeysMapWithCustomDelimiter = createRedisKeysMap(
	redisKeysConfig,
	'-'
);

describe('Create Redis Key', function () {
	describe('Config Agnostic', function () {
		it('should return empty string', function () {
			assert.equal(createRedisKey('', null), '');
		});

		it('should return test', function () {
			assert.equal(createRedisKey('test', null), 'test');
		});
	});

	describe('Config Specific', function () {
		it('should return key for product by category', function () {
			assert.equal(
				createRedisKey(redisKeysMap.restaurants.byCategory, {
					CategoryID: '1234',
				}),
				'RESTAURANTS:by_category:1234'
			);
		});

		it('should return key for product by category with given delimiter (-)', function () {
			assert.equal(
				createRedisKey(redisKeysMapWithCustomDelimiter.restaurants.byCategory, {
					CategoryID: '1234',
				}),
				'RESTAURANTS-by_category-1234'
			);
		});

		it('should return key for product by city', function () {
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
				'couriers:by_id:1234:previous-deliveries'
			);
		});

		// orders of user with id 1234
		it('should NOT return key for orders of user with id 1234', function () {
			assert.notEqual(
				createRedisKey(redisKeysMap.orders.byUser, {
					UserID: '1234',
				}),
				'orders:of_user:'
			);
		});
	});
});
