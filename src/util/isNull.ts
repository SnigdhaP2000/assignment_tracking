function isNull(value: any) {
    if (Array.isArray(value)) {
        if (value.length == 0 || value === null) {
            return false;
        }
        return true;
    } else if (value instanceof Object) {
        return true;
    }
}