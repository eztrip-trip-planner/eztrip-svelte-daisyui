import { EnumKeysAsString } from './enum-keys-as-string.type';

export enum Alignment {
    Horizontal = 'horizontal',
    Vertical = 'vertical',
}

export type AlignmentKey = EnumKeysAsString<typeof Alignment>;
