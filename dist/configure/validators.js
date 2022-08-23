"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelimiter = exports.validateRedisKeyConfig = exports.isValidScope = exports.isScope = exports.isRedisKeyTemplate = exports.isRedisKeyParam = void 0;
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
const isScope = (possibleScope) => {
    return (possibleScope != null &&
        typeof possibleScope === 'object' &&
        Object.keys(possibleScope).includes('SCOPE_FIRST_PART') != null);
};
exports.isScope = isScope;
const isValidScope = (scope) => {
    if ((0, exports.isScope)(scope)) {
        for (const [key, value] of Object.entries(scope)) {
            if (key === 'SCOPE_FIRST_PART') {
                if ((0, exports.isRedisKeyTemplate)(value) === false) {
                    return false;
                }
            }
            else if (Array.isArray(value)) {
                if (value.every((templateMember) => (0, exports.isRedisKeyParam)(templateMember) ||
                    typeof templateMember === 'string')) {
                    continue;
                }
                else {
                    return false;
                }
            }
            else if ((0, exports.isScope)(value)) {
                if ((0, exports.isValidScope)(value)) {
                    continue;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
};
exports.isValidScope = isValidScope;
const validateRedisKeyConfig = (redisKeyConfig) => {
    if ((0, exports.isValidScope)(redisKeyConfig)) {
        return;
    }
    else {
        throw new Error('Redis Key Config is not valid');
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
