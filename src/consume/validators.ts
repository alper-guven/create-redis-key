export const isParamValueValid = (paramValue: unknown): boolean => {
	if (typeof paramValue === 'string' && paramValue.length > 0) {
		return true;
	}

	return false;
};
