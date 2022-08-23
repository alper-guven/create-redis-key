"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisKey = void 0;
const validators_1 = require("./validators");
const findParamNamesInTemplateString = (templateString) => {
    const paramNames = [];
    const regex = /%([a-zA-Z0-9_]+)%/g;
    let m;
    while ((m = regex.exec(templateString)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match) => {
            paramNames.push(match.replace(/%/g, ''));
        });
    }
    return paramNames;
};
function createRedisKey(redisKeyTemplateString, params) {
    let newString = String(redisKeyTemplateString).toString();
    if (newString.length === 0) {
        return '';
    }
    if (newString.includes('%') === false) {
        return newString;
    }
    if (params == null) {
        throw new Error('Redis Key Template String has params, but no params were provided.');
    }
    const paramsFoundInTemplateString = findParamNamesInTemplateString(newString);
    for (const paramName of paramsFoundInTemplateString) {
        const paramValue = params[paramName];
        if (paramValue == null) {
            throw new Error(`Redis Key Template String has param named <${paramName}>, but no value provided it.`);
        }
        if ((0, validators_1.isParamValueValid)(paramValue) === false) {
            throw new Error(`Redis Key Template String has param named <${paramName}>, but given value <${paramValue}> is invalid.`);
        }
        newString = newString.replace(new RegExp(`%${paramName}%`, 'g'), paramValue);
    }
    return newString;
}
exports.createRedisKey = createRedisKey;
