import type { EnumKeysAsString } from '../utils/enum-keys-as-string.type';

export enum SwapAnim {
    Rotate = 'rotate',
    Flip = 'flip',
}

export type SwapAnimKey = EnumKeysAsString<typeof SwapAnim>;
