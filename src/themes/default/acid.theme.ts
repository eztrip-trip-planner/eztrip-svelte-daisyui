import type { PartialDeep } from '@eztrip/types';
import type { Theme } from '../theme.interface';

export const AcidTheme: PartialDeep<Theme> = {
    name: 'acid',
    colors: {
        primary: '#ff00f4',
        secondary: '#ff7400',
        accent: '#cbfd03',
        neutral: '#191A3f',
        'base-100': '#fafafa',
        info: '#3194f6',
        success: '#5fc992',
        warning: '#f7De2d',
        error: '#e60300',
    },
    variables: {
        box: {
            'border-radius': '1.25rem',
        },
        button: {
            'border-radius': '1rem',
        },
        badge: {
            'border-radius': '1rem',
        },
    },
};
