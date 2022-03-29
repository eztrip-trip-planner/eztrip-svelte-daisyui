import { EnumKeysAsString } from './enum-keys-as-string.type';

export enum BaseColor {
    'Base-100' = '100',
    'Base-200' = '200',
    'Base-300' = '300',
}

export type BaseColorKey = EnumKeysAsString<typeof BaseColor>;
