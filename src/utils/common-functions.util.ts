export async function convertDtoToObjectPlain<T>(dto: T): Promise<any> {
    return Promise.resolve(Object.assign({}, dto));
}