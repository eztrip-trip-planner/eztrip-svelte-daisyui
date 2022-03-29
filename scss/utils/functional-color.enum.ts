import { EnumKeysAsString } from './enum-keys-as-string.type';

export enum FunctionalColor {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}

export type FunctionalColorKey = EnumKeysAsString<typeof FunctionalColor>;
