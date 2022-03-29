import type { EnumKeysAsString } from '../utils/enum-keys-as-string.type';

export enum ButtonShape {
    Square = 'square',
    Circle = 'circle',
}

export type ButtonShapeKey = EnumKeysAsString<typeof ButtonShape>;
