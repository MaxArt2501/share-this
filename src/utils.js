export function camelize(string) {
    return string.replace(/(?:^|-)([a-z])/g, (_, char) => char.toUpperCase());
}

// eslint-disable-next-line consistent-return
export function findByName(array, name) {
    // I would have used
    //    for (const item of array) {
    // but transpilers generate A LOT of code in this specific case.
    for (let i = 0; i < array.length; i++) {
        const item = array[i];
        if (item.name === name) {
            return item;
        }
    }
}

export function extend(dest, source) {
    if (source && typeof source === "object") {
        // eslint-disable-next-line guard-for-in
        for (const prop in source) {
            // eslint-disable-next-line no-param-reassign
            dest[prop] = source[prop];
        }
    }

    return dest;
};
