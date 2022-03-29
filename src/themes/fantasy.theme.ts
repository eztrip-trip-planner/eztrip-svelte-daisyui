import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const FantasyTheme: Theme = {
    fantasy: {
        name: 'fantasy',
        type: ThemeType.Light,
        colors: {
            primary: '#6e0b75',
            secondary: '#007ebd',
            accent: '#f8860d',
            neutral: '#1f2937',
            'base-100': '#ffffff',
            'base-content': '#1f2937',
        },
    },
};
