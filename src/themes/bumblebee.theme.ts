import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const BumblebleeTheme: Theme = {
    bumbleblee: {
        name: 'bumbleblee',
        type: ThemeType.Light,
        colors: {
            primary: '#e0a82e',
            'primary-content': '#181830',
            secondary: '#f9d72f',
            'secondary-content': '#181830',
            accent: '#181830',
            neutral: '#181830',
            'base-100': '#ffffff',
        },
    },
};
