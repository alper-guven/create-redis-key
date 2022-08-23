import { ScopeToKeys } from '../types/create-redis-key/crk-config-mapper';
import {
	IsReadonlyConfig,
	IsValidRedisKeysConfig2,
	RedisKeysConfigParam,
	RedisKeysConfigScope,
	RedisKeysConfigTemplateArray,
	RedisKeyTemplatesMapScope,
} from '../types/create-redis-key/crk-redis-key-config';
import {
	isRedisKeyParam,
	validateRedisKeyTemplate,
	isScopeLike,
	validateDelimiter,
	validateRedisKeyConfig,
} from './validators';

export const createRedisKeyParam = <T extends string>(
	name: T
): RedisKeysConfigParam<T> => {
	return {
		name,
	};
};

const createTemplateStringFormTemplateArray = (
	templateArray: RedisKeysConfigTemplateArray,
	delimiter: string
): string | null => {
	validateRedisKeyTemplate(templateArray);

	if (templateArray.length === 0) {
		return null;
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
	parentTemplateString: string | null,
	leafKeyTemplateArray: RedisKeysConfigTemplateArray,
	delimiter: string
): string | null => {
	validateRedisKeyTemplate(leafKeyTemplateArray);

	const templateString = createTemplateStringFormTemplateArray(
		leafKeyTemplateArray,
		delimiter
	);

	if (parentTemplateString != null && parentTemplateString.length > 0) {
		return [parentTemplateString, templateString].join(delimiter);
	}

	return templateString;
};

const createTemplateScope = (
	parentTemplateString: string | null,
	scope: RedisKeysConfigScope,
	delimiter: string
): RedisKeyTemplatesMapScope => {
	const scopeTemplate: RedisKeyTemplatesMapScope = {};

	const scopeFirstPartString = createTemplateStringFormTemplateArray(
		scope.SCOPE_FIRST_PART,
		delimiter
	);

	for (const [key, value] of Object.entries(scope)) {
		if (key === 'SCOPE_FIRST_PART') {
			continue;
		}

		let templateString: string | null = null;

		if (parentTemplateString != null && parentTemplateString.length > 0) {
			templateString = [parentTemplateString, scopeFirstPartString].join(
				delimiter
			);
		} else {
			templateString = scopeFirstPartString;
		}

		// is leaf
		if (Array.isArray(value)) {
			scopeTemplate[key] =
				createTemplateLeaf(templateString, value, delimiter) ||
				parentTemplateString ||
				'';
		} else if (isScopeLike(value)) {
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
	ReturnValue = 'valid' extends K
		? IsReadonlyConfig<T> extends 'yes'
			? ScopeToKeys<T>
			: ScopeToKeys<T>
		: never
>(
	redisKeysConfig: T,
	optionalDelimiter?: Delimiter
): ReturnValue => {
	if (optionalDelimiter != null) {
		validateDelimiter(optionalDelimiter);
	}

	const delimiter = optionalDelimiter || ':';

	validateRedisKeyConfig(redisKeysConfig);

	const map: RedisKeyTemplatesMapScope = createTemplateScope(
		null,
		redisKeysConfig as unknown as RedisKeysConfigScope,
		delimiter
	);

	return map as unknown as ReturnValue;
};
