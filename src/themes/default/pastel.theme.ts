import type { PartialDeep } from '@eztrip/types';
import type { Theme } from '../theme.interface';

export const PastelTheme: PartialDeep<Theme> = {
    name: 'pastel',
    colors: {
        primary: '#d1c1d7',
        secondary: '#f6cbd1',
        accent: '#b4e9d6',
        neutral: '#70acc7',
        'base-100': '#ffffff',
        'base-200': '#f9fafb',
        'base-300': '#d1d5db',
    },
    variables: {
        button: {
            'border-radius': '1.9rem',
        },
    },
};
