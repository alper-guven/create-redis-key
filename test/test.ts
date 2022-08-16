import assert from 'assert';
import { createRedisKey } from '../src';

describe('Create Redis Key', function () {
  describe('placeholder', function () {
    it('should return Create Redis Key', function () {
      assert.equal(createRedisKey(), 'Create Redis Key');
    });
  });
});
