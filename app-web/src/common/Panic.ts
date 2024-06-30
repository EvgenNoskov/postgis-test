
export type PanicMessage = string | Error | (() => string);
/**
 * Throws new error.
 * @param messageOrError Optional error message or error instance.
 */
export function Panic(messageOrError?: PanicMessage): never {
    if (messageOrError instanceof Error)
        throw messageOrError;
    throw new Error(typeof messageOrError === "function" ? messageOrError() : messageOrError);
}