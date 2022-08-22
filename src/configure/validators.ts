import {
	RedisKeyParam,
	RedisKeyScope,
	RedisKeyTemplateArray,
	ScopeOrKeyTemplate,
} from '../types/create-redis-key/crk-redis-key-config';

export const isRedisKeyParam = (
	templateMember: string | RedisKeyParam
): templateMember is RedisKeyParam => {
	if (typeof templateMember === 'object' && templateMember.name) {
		return true;
	}

	if (typeof templateMember === 'string') {
		return false;
	}

	return false;
};

export const isRedisKeyTemplate = (
	possibleTemplate: ScopeOrKeyTemplate
): possibleTemplate is RedisKeyTemplateArray => {
	return (
		Array.isArray(possibleTemplate) &&
		possibleTemplate.every(
			(templateMember) =>
				isRedisKeyParam(templateMember) || typeof templateMember === 'string'
		)
	);
};

export const isScope = (
	possibleScope: unknown
): possibleScope is RedisKeyScope => {
	return (
		possibleScope != null &&
		typeof possibleScope === 'object' &&
		Object.keys(possibleScope).includes('SCOPE_FIRST_PART') != null
	);
};

export const isValidScope = (scope: unknown): scope is RedisKeyScope => {
	if (isScope(scope)) {
		for (const [key, value] of Object.entries(scope)) {
			if (key === 'SCOPE_FIRST_PART') {
				if (isRedisKeyTemplate(value) === false) {
					return false;
				}
			} else if (Array.isArray(value)) {
				if (
					value.every(
						(templateMember) =>
							isRedisKeyParam(templateMember) ||
							typeof templateMember === 'string'
					)
				) {
					continue;
				} else {
					return false;
				}
			} else if (isScope(value)) {
				if (isValidScope(value)) {
					continue;
				} else {
					return false;
				}
			}
		}

		return true;
	}

	return false;
};

export const validateRedisKeyConfig = (redisKeyConfig: unknown): void => {
	if (isValidScope(redisKeyConfig)) {
		return;
	} else {
		throw new Error('Redis Key Config is not valid');
	}
};

export const validateDelimiter = (delimiter: unknown): void => {
	if (typeof delimiter !== 'string') {
		throw new Error('Delimiter must be a string');
	}

	if (delimiter === '' || delimiter.length === 0) {
		throw new Error('Delimiter cannot be empty string');
	}

	if (delimiter === '%') {
		throw new Error(
			'Invalid delimiter. Delimiter cannot be "%". This is used for params in Redis Key templates.'
		);
	}
};
