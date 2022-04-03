import { EnumKeysAsString } from '../../utils/enum-keys-as-string.type';

export enum ArtboardSize {
    Phone1 = 'phone-1',
    Phone2 = 'phone-2',
    Phone3 = 'phone-3',
    Phone4 = 'phone-4',
    Phone5 = 'phone-5',
    Phone6 = 'phone-6',
}

export type ArtboardSizeKey = EnumKeysAsString<typeof ArtboardSize>;
