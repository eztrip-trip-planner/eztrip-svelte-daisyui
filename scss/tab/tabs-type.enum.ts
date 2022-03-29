import { EnumKeysAsString } from '../../utils/enum-keys-as-string.type';

export enum TabsType {
    Bordered = 'bordered',
    Lifted = 'lifted',
    Boxed = 'boxed',
}

export type TabsTypeKey = EnumKeysAsString<typeof TabsType>;
