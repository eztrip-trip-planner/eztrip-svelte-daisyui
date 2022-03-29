import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const CorporateTheme: Theme = {
    corporate: {
        name: 'corporate',
        type: ThemeType.Light,
        colors: {
            primary: '#4b6bfb',
            secondary: '#7b92b2',
            accent: '#67cba0',
            neutral: '#181a2a',
            'neutral-content': '#edf2f7',
            'base-100': '#ffffff',
            'base-content': '#181a2a',
        },
        variables: {
            'box-border-radius': '0.25rem',
            'button-border-radius': '.125rem',
            'badge-border-radius': '.125rem',
            'button-animation-duration': '0',
            'input-animation-duration': '0',
            'button-focus-scale': '1',
        },
    },
};
