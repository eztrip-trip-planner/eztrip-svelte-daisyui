import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const LuxuryTheme: Theme = {
    luxury: {
        name: 'luxury',
        type: ThemeType.Dark,
        colors: {
            primary: '#ffffff',
            secondary: '#152747',
            accent: '#513448',
            neutral: '#171618',
            'neutral-content': '#dca54c',
            'base-100': '#09090b',
            'base-200': '#171618',
            'base-300': '#2e2d2f',
            'base-content': '#dca54c',
            info: '#66c6ff',
            success: '#87d039',
            warning: '#e2d562',
            error: '#ff6f6f',
        },
    },
};
