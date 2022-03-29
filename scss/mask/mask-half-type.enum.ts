import { EnumKeysAsString } from '../../utils/enum-keys-as-string.type';

export enum MaskHalfType {
    Half1 = 'half-1',
    Half2 = 'half-2',
}

export type MaskHalfTypeKey = EnumKeysAsString<typeof MaskHalfType>;
