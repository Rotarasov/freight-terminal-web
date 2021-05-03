export function snakeToCamel<T extends Record<string, any>>(obj: T): T {
    Object.keys(obj).forEach((snakeKey: string) => {
        let camelKey: keyof T = snakeKey.replace(
            /([-_][a-z])/g,
            (group) => group.toUpperCase().replace('_', '')
        )
        obj[camelKey] = obj[snakeKey]
        delete obj[snakeKey]
    });
    return obj;
}

export function camelToSnake<T extends Record<string, any>>(obj: T): T {
    Object.keys(obj).forEach((camelKey: string) => {
        let snakeKey: keyof T = camelKey.replace(
            /([A-Z])/g,
            (group) => '_' + group.toLowerCase()
        )
        obj[snakeKey] = obj[camelKey]
        delete obj[camelKey]
    });
    return obj;
}

export function fillUrl(url: string, args: Record<string, string>): string {
    let finalUrl = url;
    Object.keys(args).forEach((key: string, index: number) => {
        finalUrl = finalUrl.replace(new RegExp(`\{${key}\}`), args[key])
    })
    return finalUrl
}