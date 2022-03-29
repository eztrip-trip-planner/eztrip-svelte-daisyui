import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const CmykTheme: Theme = {
    cmyk: {
        name: 'cmyk',
        type: ThemeType.Light,
        colors: {
            primary: '#45AEEE',
            secondary: '#E8488A',
            accent: '#FFF232',
            neutral: '#1a1a1a',
            'base-100': '#ffffff',
            info: '#4AA8C0',
            success: '#823290',
            warning: '#EE8133',
            error: '#E93F33',
        },
    },
};
