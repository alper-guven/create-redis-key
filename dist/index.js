"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisKeysMap = exports.createRedisKeyParam = exports.createRedisKey = void 0;
const isRedisKeyParam = (templateMember) => {
    if (typeof templateMember === 'object' && templateMember.name) {
        return true;
    }
    if (typeof templateMember === 'string') {
        return false;
    }
    return false;
};
const isRedisKeyTemplate = (possibleTemplate) => {
    return Array.isArray(possibleTemplate);
};
const isScope = (possibleScope) => {
    return possibleScope.SCOPE_FIRST_PART != null;
};
const createRedisKey = (redisKeyTemplateString, params) => {
    let newString = String(redisKeyTemplateString).toString();
    if (newString.length === 0) {
        return '';
    }
    if (newString.includes('%') === false) {
        return newString;
    }
    if (params == null) {
        throw new Error('RedisKeyTemplateString has params, but no params were provided.');
    }
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
exports.createRedisKey = createRedisKey;
const createRedisKeyParam = (name) => {
    return {
        name,
    };
};
exports.createRedisKeyParam = createRedisKeyParam;
const createTemplateStringFormTemplateArray = (templateArray, delimeter) => {
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
const createTemplateLeaf = (parentTemplateString, leafKeyTemplateArray, delimiter) => {
    if (isRedisKeyTemplate(leafKeyTemplateArray) === false) {
        throw new Error('Invalid leaf key template');
    }
    const templateString = createTemplateStringFormTemplateArray(leafKeyTemplateArray, delimiter);
    return [parentTemplateString, templateString].join(delimiter);
};
const createTemplateScope = (parentTemplateString, scope, delimiter) => {
    const scopeTemplate = {};
    for (const [key, value] of Object.entries(scope)) {
        if (key === 'SCOPE_FIRST_PART') {
            continue;
        }
        const scopeFirstPartString = createTemplateStringFormTemplateArray(scope.SCOPE_FIRST_PART, delimiter);
        let templateString;
        if (parentTemplateString) {
            templateString = [parentTemplateString, scopeFirstPartString].join(delimiter);
        }
        else {
            templateString = scopeFirstPartString;
        }
        if (Array.isArray(value)) {
            scopeTemplate[key] = createTemplateLeaf(templateString, value, delimiter);
        }
        else if (isScope(value)) {
            scopeTemplate[key] = createTemplateScope(templateString, value, delimiter);
        }
    }
    console.log(scopeTemplate);
    return scopeTemplate;
};
const createRedisKeysMap = (redisKeyTemplate, optionalDelimiter) => {
    if (optionalDelimiter === '') {
        throw new Error('Delimiter cannot be empty string');
    }
    if (optionalDelimiter === '%') {
        throw new Error('Invalid delimiter. Delimiter cannot be "%". This is used for params.');
    }
    const delimiter = optionalDelimiter || ':';
    const map = createTemplateScope(null, redisKeyTemplate, delimiter);
    return map;
};
exports.createRedisKeysMap = createRedisKeysMap;
