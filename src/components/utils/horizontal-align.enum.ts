import { EnumKeysAsString } from './enum-keys-as-string.type';

export enum HorizontalAlignment {
    Start = 'start',
    Center = 'center',
    End = 'end',
}

export type HorizontalAlignmentKey = EnumKeysAsString<typeof HorizontalAlignment>;
