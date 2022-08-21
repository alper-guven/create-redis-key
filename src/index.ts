import {
	getRequiredParamsFromTemplateString,
	RedisKeyParam,
	RedisKeyScope,
	RedisKeyTemplateArray,
	ScopeOrKeyTemplate,
	ScopeToKeys,
} from './types/create-redis-key-types';

const isRedisKeyParam = (
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

const isRedisKeyTemplate = (
	possibleTemplate: ScopeOrKeyTemplate
): possibleTemplate is RedisKeyTemplateArray => {
	return Array.isArray(possibleTemplate);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isScope = (possibleScope: any): possibleScope is RedisKeyScope => {
	return possibleScope.SCOPE_FIRST_PART != null;
};

export const createRedisKey = <T extends string>(
	redisKeyTemplateString: T,
	params: getRequiredParamsFromTemplateString<T>
): string => {
	let newString = String(redisKeyTemplateString).toString();

	// Check if template string is empty
	if (newString.length === 0) {
		return '';
	}

	// Check if template string has no params
	if (newString.includes('%') === false) {
		return newString;
	}

	if (params == null) {
		throw new Error(
			'RedisKeyTemplateString has params, but no params were provided.'
		);
	}

	/**
	 * Good to go.
	 * Replace params in template string with values.
	 */

	console.log(redisKeyTemplateString);
	for (const [paramName, paramValue] of Object.entries(params)) {
		console.log(paramName, paramValue);

		if (typeof paramValue === 'string') {
			newString = newString.replace(`%${paramName}%`, paramValue);
		}

		console.log(newString);
	}

	return newString;
};

export const createRedisKeyParam = <T extends string>(
	name: T
): RedisKeyParam<T> => {
	return {
		name,
	};
};

const createTemplateStringFormTemplateArray = (
	templateArray: RedisKeyTemplateArray,
	delimeter: string
): string => {
	const templateString = templateArray
		.map((templateMember) => {
			if (isRedisKeyParam(templateMember)) {
				return `%${templateMember.name}%`;
			}

			return templateMember;
		})
		.join(delimeter);

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

type keyTemplateScope = {
	[key: string]: string | Record<string, string | keyTemplateScope>;
};

const createTemplateScope = (
	parentTemplateString: string | null,
	scope: RedisKeyScope,
	delimiter: string
): keyTemplateScope => {
	const scopeTemplate: keyTemplateScope = {};

	for (const [key, value] of Object.entries(scope)) {
		if (key === 'SCOPE_FIRST_PART') {
			continue;
		}

		const scopeFirstPartString = createTemplateStringFormTemplateArray(
			scope.SCOPE_FIRST_PART,
			delimiter
		);

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

	console.log(scopeTemplate);

	return scopeTemplate;
};

export const createRedisKeysMap = <
	T extends Record<string, any>,
	Delimiter extends string = ':'
>(
	redisKeyTemplate: T,
	optionalDelimiter?: Delimiter
): ScopeToKeys<T> => {
	if (optionalDelimiter === '') {
		throw new Error('Delimiter cannot be empty string');
	}

	if (optionalDelimiter === '%') {
		throw new Error(
			'Invalid delimiter. Delimiter cannot be "%". This is used for params.'
		);
	}

	const delimiter = optionalDelimiter || ':';

	const map: keyTemplateScope = createTemplateScope(
		null,
		redisKeyTemplate as unknown as RedisKeyScope,
		delimiter
	);

	return map as ScopeToKeys<T>;
};
