import { EnumKeysAsString } from './enum-keys-as-string.type';

export enum VerticalAlignment {
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom',
}

export type VerticalAlignmentKey = EnumKeysAsString<typeof VerticalAlignment>;
