import { ScopeToKeys } from '../types/create-redis-key/crk-config-mapper';
import {
	IsReadonlyConfig,
	IsValidRedisKeysConfig2,
	RedisKeyParam,
	RedisKeyScope,
	RedisKeyTemplateArray,
	RedisKeyTemplateScope,
} from '../types/create-redis-key/crk-redis-key-config';
import {
	isRedisKeyParam,
	isRedisKeyTemplate,
	isScope,
	validateDelimiter,
	validateRedisKeyConfig,
} from './validators';

export const createRedisKeyParam = <T extends string>(
	name: T
): RedisKeyParam<T> => {
	return {
		name,
	};
};

const createTemplateStringFormTemplateArray = (
	templateArray: RedisKeyTemplateArray,
	delimiter: string
): string => {
	if (isRedisKeyTemplate(templateArray) === false) {
		throw new Error(
			`Redis Template Array must be an array of strings or RedisKeyParam objects`
		);
	}

	const templateString = templateArray
		.map((templateMember) => {
			if (isRedisKeyParam(templateMember)) {
				return `%${templateMember.name}%`;
			}

			return templateMember;
		})
		.join(delimiter);

	return templateString;
};

const createTemplateLeaf = (
	parentTemplateString: string,
	leafKeyTemplateArray: RedisKeyTemplateArray,
	delimiter: string
): string => {
	if (isRedisKeyTemplate(leafKeyTemplateArray) === false) {
		throw new Error('Invalid leaf key template');
	}

	const templateString = createTemplateStringFormTemplateArray(
		leafKeyTemplateArray,
		delimiter
	);

	return [parentTemplateString, templateString].join(delimiter);
};

const createTemplateScope = (
	parentTemplateString: string | null,
	scope: RedisKeyScope,
	delimiter: string
): RedisKeyTemplateScope => {
	const scopeTemplate: RedisKeyTemplateScope = {};

	const scopeFirstPartString = createTemplateStringFormTemplateArray(
		scope.SCOPE_FIRST_PART,
		delimiter
	);

	for (const [key, value] of Object.entries(scope)) {
		if (key === 'SCOPE_FIRST_PART') {
			continue;
		}

		let templateString: string;

		if (parentTemplateString) {
			templateString = [parentTemplateString, scopeFirstPartString].join(
				delimiter
			);
		} else {
			templateString = scopeFirstPartString;
		}

		// is leaf
		if (Array.isArray(value)) {
			scopeTemplate[key] = createTemplateLeaf(templateString, value, delimiter);
		} else if (isScope(value)) {
			// is scope
			scopeTemplate[key] = createTemplateScope(
				templateString,
				value,
				delimiter
			);
		}
	}

	return scopeTemplate;
};

export const createRedisKeysMap = <
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Record<string, any>,
	Delimiter extends string = ':',
	K = IsValidRedisKeysConfig2<T> extends true ? 'valid' : 'invalid',
	R = IsReadonlyConfig<T> extends 'yes'
		? 'valid' extends K
			? ScopeToKeys<T>
			: never
		: never
>(
	redisKeysConfig: T,
	optionalDelimiter?: Delimiter
): R => {
	if (optionalDelimiter != null) {
		validateDelimiter(optionalDelimiter);
	}

	const delimiter = optionalDelimiter || ':';

	validateRedisKeyConfig(redisKeysConfig);

	const map: RedisKeyTemplateScope = createTemplateScope(
		null,
		redisKeysConfig as unknown as RedisKeyScope,
		delimiter
	);

	return map as unknown as R;
};
