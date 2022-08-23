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

export const validateRedisKeyTemplate = (
	possibleTemplate: ScopeOrKeyTemplate
): void => {
	if (isRedisKeyTemplate(possibleTemplate) === false) {
		throw new Error(
			`Redis Template Array must be an array of strings or Redis Key Param objects`
		);
	}
};

export const isScopeLike = (
	possibleScope: unknown
): possibleScope is RedisKeyScope => {
	return (
		possibleScope != null &&
		typeof possibleScope === 'object' &&
		Object.keys(possibleScope).includes('SCOPE_FIRST_PART')
	);
};

export const isValidScope = (scope: unknown): scope is RedisKeyScope => {
	if (isScopeLike(scope)) {
		for (const [key, value] of Object.entries(scope)) {
			if (key === 'SCOPE_FIRST_PART') {
				if (isRedisKeyTemplate(value) === false) {
					return false;
				}
			} else if (Array.isArray(value)) {
				if (isRedisKeyTemplate(value)) {
					continue;
				} else {
					return false;
				}
			} else if (isScopeLike(value)) {
				if (isValidScope(value)) {
					continue;
				} else {
					return false;
				}
			} else {
				// Any other type is invalid
				return false;
			}
		}

		return true;
	}

	return false;
};

export const validateScope = (
	scope: unknown,
	parentPath: string | null
): void => {
	try {
		if (isScopeLike(scope)) {
			for (const [key, value] of Object.entries(scope)) {
				const keyPath = parentPath ? `${parentPath}.${key}` : '';

				if (key === 'SCOPE_FIRST_PART') {
					validateRedisKeyTemplate(value);
				} else if (Array.isArray(value)) {
					validateRedisKeyTemplate(value);
				} else if (isScopeLike(value)) {
					validateScope(value, keyPath);
				} else {
					// Any other type is invalid
					throw new Error(`Invalid Redis Key Scope on Path: <${keyPath}>`);
				}
			}
		} else {
			if (parentPath == null) {
				throw new Error(`Config Object itself is not a valid Redis Key Scope`);
			} else {
				throw new Error(`Invalid Redis Key Scope on Path: <${parentPath}>`);
			}
		}
	} catch (error) {
		let message = 'unknown error';

		if (error instanceof Error) {
			message = error.message;
		}

		throw new Error(message);
	}
};

export const validateRedisKeyConfig = (redisKeyConfig: unknown): void => {
	try {
		validateScope(redisKeyConfig, null);
	} catch (error) {
		let message = 'unknown error';

		if (error instanceof Error) {
			message = error.message;
		}

		throw new Error('Redis Key Config is not valid: ' + message);
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
