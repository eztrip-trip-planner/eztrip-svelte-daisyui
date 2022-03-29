import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const LightTheme: Theme = {
    light: {
        name: 'light',
        type: ThemeType.Light,
        colors: {
            primary: '#570df8',
            'primary-content': '#ffffff',
            secondary: '#f000b8',
            'secondary-content': '#ffffff',
            accent: '#37cdbe',
            'accent-content': '#163835',
            neutral: '#3d4451',
            'neutral-content': '#ffffff',
            'base-100': '#ffffff',
            'base-200': '#f2f2f2',
            'base-300': '#e5e6e6',
            'base-content': '#1f2937',
        },
    },
};
