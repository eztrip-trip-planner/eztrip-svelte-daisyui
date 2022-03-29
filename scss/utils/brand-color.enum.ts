import { EnumKeysAsString } from './enum-keys-as-string.type';

export enum BrandColor {
    Primary = 'primary',
    Secondary = 'secondary',
    Accent = 'accent',
}

export type BrandColorKey = EnumKeysAsString<typeof BrandColor>;
