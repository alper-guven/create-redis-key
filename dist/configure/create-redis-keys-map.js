"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisKeysMap = exports.createRedisKeyParam = void 0;
const validators_1 = require("./validators");
const createRedisKeyParam = (name) => {
    return {
        name,
    };
};
exports.createRedisKeyParam = createRedisKeyParam;
const createTemplateStringFormTemplateArray = (templateArray, delimiter) => {
    (0, validators_1.validateRedisKeyTemplate)(templateArray);
    if (templateArray.length === 0) {
        return null;
    }
    const templateString = templateArray
        .map((templateMember) => {
        if ((0, validators_1.isRedisKeyParam)(templateMember)) {
            return `%${templateMember.name}%`;
        }
        return templateMember;
    })
        .join(delimiter);
    return templateString;
};
const createTemplateLeaf = (parentTemplateString, leafKeyTemplateArray, delimiter) => {
    (0, validators_1.validateRedisKeyTemplate)(leafKeyTemplateArray);
    const templateString = createTemplateStringFormTemplateArray(leafKeyTemplateArray, delimiter);
    if (parentTemplateString != null && parentTemplateString.length > 0) {
        return [parentTemplateString, templateString].join(delimiter);
    }
    return templateString;
};
const createTemplateScope = (parentTemplateString, scope, delimiter) => {
    const scopeTemplate = {};
    const scopeFirstPartString = createTemplateStringFormTemplateArray(scope.SCOPE_FIRST_PART, delimiter);
    for (const [key, value] of Object.entries(scope)) {
        if (key === 'SCOPE_FIRST_PART') {
            continue;
        }
        let templateString = null;
        if (parentTemplateString != null && parentTemplateString.length > 0) {
            templateString = [parentTemplateString, scopeFirstPartString].join(delimiter);
        }
        else {
            templateString = scopeFirstPartString;
        }
        if (Array.isArray(value)) {
            scopeTemplate[key] =
                createTemplateLeaf(templateString, value, delimiter) ||
                    parentTemplateString ||
                    '';
        }
        else if ((0, validators_1.isScopeLike)(value)) {
            scopeTemplate[key] = createTemplateScope(templateString, value, delimiter);
        }
    }
    return scopeTemplate;
};
const createRedisKeysMap = (redisKeysConfig, optionalDelimiter) => {
    if (optionalDelimiter != null) {
        (0, validators_1.validateDelimiter)(optionalDelimiter);
    }
    const delimiter = optionalDelimiter || ':';
    (0, validators_1.validateRedisKeyConfig)(redisKeysConfig);
    const map = createTemplateScope(null, redisKeysConfig, delimiter);
    return map;
};
exports.createRedisKeysMap = createRedisKeysMap;
