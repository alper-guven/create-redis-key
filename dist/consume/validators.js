"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isParamValueValid = void 0;
const isParamValueValid = (paramValue) => {
    if (typeof paramValue === 'string' && paramValue.length > 0) {
        return true;
    }
    return false;
};
exports.isParamValueValid = isParamValueValid;
