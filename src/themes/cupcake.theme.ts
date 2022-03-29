import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const CupcakeTheme: Theme = {
    cupcake: {
        name: 'cupcake',
        type: ThemeType.Light,
        colors: {
            primary: '#65c3c8',
            secondary: '#ef9fbc',
            accent: '#eeaf3a',
            neutral: '#291334',
            'base-100': '#faf7f5',
            'base-200': '#efeae6',
            'base-300': '#e7e2df',
            'base-content': '#291334',
        },
        variables: {
            'button-border-radius': '1.9rem',
            'tab-border-width': '2px',
            'tab-border-radius': '.5rem',
        },
    },
};
