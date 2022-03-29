import { EnumKeysAsString } from '../../utils/enum-keys-as-string.type';

export enum StackDirection {
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Right = 'right',
    UpLeft = 'upleft',
    UpRight = 'upright',
    DownLeft = 'downleft',
    DownRight = 'downright',
}

export type StackDirectionKey = EnumKeysAsString<typeof StackDirection>;
