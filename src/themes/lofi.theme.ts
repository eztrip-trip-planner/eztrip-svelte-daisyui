import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const LofiTheme: Theme = {
    lofi: {
        name: 'lofi',
        type: ThemeType.Light,
        colors: {
            primary: '#0d0d0d',
            'primary-content': '#ffffff',
            secondary: '#1a1919',
            'secondary-content': '#ffffff',
            accent: '#262626',
            'accent-content': '#ffffff',
            neutral: '#000000',
            'neutral-content': '#ffffff',
            'base-100': '#ffffff',
            'base-200': '#f2f2f2',
            'base-300': '#e6e5e5',
            'base-content': '#000000',
            info: '#0070f3',
            'info-content': '#ffffff',
            success: '#21cc51',
            'success-content': '#ffffff',
            warning: '#ff6154',
            'warning-content': '#ffffff',
            error: '#de1c8d',
            'error-content': '#ffffff',
        },
        variables: {
            'box-border-radius': '0.25rem',
            'button-border-radius': '0.125rem',
            'badge-border-radius': '0.125rem',
            'button-animation-duration': '0',
            'input-animation-duration': '0',
            'button-focus-scale': '1',
            'tab-border-radius': '0',
        },
    },
};
