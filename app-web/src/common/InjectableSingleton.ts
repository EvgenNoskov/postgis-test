import { Panic } from "./Panic";


export interface InjectableSingleton<T> {
    /**
     * Gets injected singleton object or panics if none object was injected.
     */
    (): T;

    /**
     * Injects the value.
     * @param value Value to inject.
     */
    Inject(value: T): T;
};



export type SingletonOptions<T> = {
    value?: T;
    label: string,
    mutable: boolean
};

/**
 * Creates injectable singleton.
 * @param options Singleton options.
 * @returns Injectable sinbleton function.
 */
export function InjectableSingleton<T>(options?: Partial<SingletonOptions<T>>): InjectableSingleton<T> {
    const data = new SingletonData(options);

    return Object.assign(data.Get.bind(data), { Inject: data.Inject.bind(data) });
}

class SingletonData<T> {
    private _value?: T;
    private _label: string;
    private _mutable: boolean;

    constructor(options?: Partial<SingletonOptions<T>>) {
        this._value = options?.value;
        this._label = options?.label ?? "";
        this._mutable = options?.mutable ?? false;
    }

    Get(): T {
        return this._value ?? Panic(`Singleton ${this._label} isn't injected.`);
    }

    Inject(value: T): T {
        if (!this._mutable && this._value !== undefined)
            Panic(`Singleton ${this._label} isn't mutable and already injected.`);
        return this._value = value;
    }
}