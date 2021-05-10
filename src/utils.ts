export function snakeToCamel<T extends Record<string, any>, R extends Record<string, any>>(obj: T): R {
    Object.keys(obj).forEach((snakeKey: string) => {
        let camelKey: keyof T = snakeKey.replace(
            /([-_][a-z])/g,
            (group) => group.toUpperCase().replace('_', '')
        )
        obj[camelKey] = obj[snakeKey]
        if (camelKey !== snakeKey) {
            delete obj[snakeKey]
        }
    });
    return obj as R;
}

export function camelToSnake<T extends Record<string, any>, R extends Record<string, any>>(obj: T): R {
    Object.keys(obj).forEach((camelKey: string) => {
        let snakeKey: keyof T = camelKey.replace(
            /([A-Z])/g,
            (group) => '_' + group.toLowerCase()
        )
        obj[snakeKey] = obj[camelKey]
        if (camelKey !== snakeKey) {
            delete obj[camelKey]
        }
    });
    return obj as R;
}

export function fillUrl(url: string, args: Record<string, string>): string {
    let finalUrl = url;
    Object.keys(args).forEach((key: string, index: number) => {
        finalUrl = finalUrl.replace(new RegExp(`\{${key}\}`), args[key])
    })
    return finalUrl
}

export function getAuthHeaders(accessToken: string): { Authorization: string } {
    return { Authorization: "Bearer " + accessToken }
}