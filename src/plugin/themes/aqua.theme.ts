import type { PartialDeep } from '@eztrip/types';
import type { Theme } from '../interfaces/theme.interface';

export const AquaTheme: PartialDeep<Theme> = {
    name: 'aqua',
    colors: {
        primary: '#09ecf3',
        'primary-content': '#005355',
        secondary: '#966fb3',
        accent: '#ffe999',
        neutral: '#3b8ac4',
        'base-100': '#345da7',
        info: '#2563eb',
        success: '#16a34a',
        warning: '#d97706',
        error: '#dc2626',
    },
};
