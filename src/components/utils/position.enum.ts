import { EnumKeysAsString } from './enum-keys-as-string.type';

export enum Position {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
}

export type PositionKey = EnumKeysAsString<typeof Position>;
