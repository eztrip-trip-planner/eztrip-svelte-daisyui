import { EnumKeysAsString } from './enum-keys-as-string.type';

export enum Size {
    Tiny = 'xs',
    Small = 'sm',
    Medium = 'md',
    Large = 'lg',
}

export type SizeKey = EnumKeysAsString<typeof Size>;
