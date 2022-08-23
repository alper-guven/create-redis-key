"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelimiter = exports.validateRedisKeyConfig = exports.validateScope = exports.isValidScope = exports.isScopeLike = exports.validateRedisKeyTemplate = exports.isRedisKeyTemplate = exports.isRedisKeyParam = void 0;
const isRedisKeyParam = (templateMember) => {
    if (typeof templateMember === 'object' && templateMember.name) {
        return true;
    }
    if (typeof templateMember === 'string') {
        return false;
    }
    return false;
};
exports.isRedisKeyParam = isRedisKeyParam;
const isRedisKeyTemplate = (possibleTemplate) => {
    return (Array.isArray(possibleTemplate) &&
        possibleTemplate.every((templateMember) => (0, exports.isRedisKeyParam)(templateMember) || typeof templateMember === 'string'));
};
exports.isRedisKeyTemplate = isRedisKeyTemplate;
const validateRedisKeyTemplate = (possibleTemplate) => {
    if ((0, exports.isRedisKeyTemplate)(possibleTemplate) === false) {
        throw new Error(`Redis Template Array must be an array of strings or Redis Key Param objects`);
    }
};
exports.validateRedisKeyTemplate = validateRedisKeyTemplate;
const isScopeLike = (possibleScope) => {
    return (possibleScope != null &&
        typeof possibleScope === 'object' &&
        Object.keys(possibleScope).includes('SCOPE_FIRST_PART'));
};
exports.isScopeLike = isScopeLike;
const isValidScope = (scope) => {
    if ((0, exports.isScopeLike)(scope)) {
        for (const [key, value] of Object.entries(scope)) {
            if (key === 'SCOPE_FIRST_PART') {
                if ((0, exports.isRedisKeyTemplate)(value) === false) {
                    return false;
                }
            }
            else if (Array.isArray(value)) {
                if ((0, exports.isRedisKeyTemplate)(value)) {
                    continue;
                }
                else {
                    return false;
                }
            }
            else if ((0, exports.isScopeLike)(value)) {
                if ((0, exports.isValidScope)(value)) {
                    continue;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        return true;
    }
    return false;
};
exports.isValidScope = isValidScope;
const validateScope = (scope, parentPath) => {
    try {
        if ((0, exports.isScopeLike)(scope)) {
            for (const [key, value] of Object.entries(scope)) {
                const keyPath = parentPath ? `${parentPath}.${key}` : '';
                if (key === 'SCOPE_FIRST_PART') {
                    (0, exports.validateRedisKeyTemplate)(value);
                }
                else if (Array.isArray(value)) {
                    (0, exports.validateRedisKeyTemplate)(value);
                }
                else if ((0, exports.isScopeLike)(value)) {
                    (0, exports.validateScope)(value, keyPath);
                }
                else {
                    throw new Error(`Invalid Redis Key Scope on Path: <${keyPath}>`);
                }
            }
        }
        else {
            if (parentPath == null) {
                throw new Error(`Config Object itself is not a valid Redis Key Scope`);
            }
            else {
                throw new Error(`Invalid Redis Key Scope on Path: <${parentPath}>`);
            }
        }
    }
    catch (error) {
        let message = 'unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        throw new Error(message);
    }
};
exports.validateScope = validateScope;
const validateRedisKeyConfig = (redisKeyConfig) => {
    try {
        (0, exports.validateScope)(redisKeyConfig, null);
    }
    catch (error) {
        let message = 'unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        throw new Error('Redis Key Config is not valid: ' + message);
    }
};
exports.validateRedisKeyConfig = validateRedisKeyConfig;
const validateDelimiter = (delimiter) => {
    if (typeof delimiter !== 'string') {
        throw new Error('Delimiter must be a string');
    }
    if (delimiter === '' || delimiter.length === 0) {
        throw new Error('Delimiter cannot be empty string');
    }
    if (delimiter === '%') {
        throw new Error('Invalid delimiter. Delimiter cannot be "%". This is used for params in Redis Key templates.');
    }
};
exports.validateDelimiter = validateDelimiter;
