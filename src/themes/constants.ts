import type { Theme } from './theme.interface';

export const COLOR_NAMES: Record<string, { content: boolean; focus: boolean }> =
    {
        primary: {
            content: true,
            focus: true,
        },
        secondary: {
            content: true,
            focus: true,
        },
        accent: {
            content: true,
            focus: true,
        },
        success: {
            content: true,
            focus: true,
        },
        info: {
            content: true,
            focus: true,
        },
        warning: {
            content: true,
            focus: true,
        },
        error: {
            content: true,
            focus: true,
        },
        neutral: {
            content: true,
            focus: true,
        },
    };
export const DEFAULT_MAIN_THEME = 'light';
export const DEFAULT_DARK_THEME = 'dark';
export const DEFAULT_THEME = {
    colors: {
        primary: '#570df8',
        secondary: '#f000b8',
        accent: '#37cdbe',
        info: '#3abff8',
        success: '#36d399',
        warning: '#fbbd23',
        error: '#f87272',
        neutral: '#3d4451',
        'base-100': '#ffffff',
    },
    variables: {
        box: {
            'border-radius': '1rem',
        },
        button: {
            'border-radius': '0.5rem',
            'border-width': '1px',
            'text-transform': 'uppercase',
            'focus-scale': '0.95',
            'animation-duration': '0.25s',
        },
        input: {
            'animation-duration': '0.2s',
        },
        badge: {
            'border-radius': '1.9rem',
        },
        tab: {
            'border-radius': '0.5rem',
            'border-width': '1px',
        },
    },
} as Theme;
