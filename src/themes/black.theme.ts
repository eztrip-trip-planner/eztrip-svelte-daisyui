import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const BlackTheme: Theme = {
    black: {
        name: 'black',
        type: ThemeType.Dark,
        colors: {
            primary: '#343232',
            secondary: '#343232',
            accent: '#343232',
            'base-100': '#000000',
            'base-200': '#0D0D0D',
            'base-300': '#1A1919',
            neutral: '#272626',
            'neutral-focus': '#343232',
            info: '#0000ff',
            success: '#008000',
            warning: '#ffff00',
            error: '#ff0000',
        },
        variables: {
            'box-border-radius': '0',
            'button-border-radius': '0',
            'badge-border-radius': '0',
            'button-animation-duration': '0',
            'input-animation-duration': '0',
            'button-text-case': 'lowercase',
            'button-focus-scale': '1',
            'tab-border-radius': '0',
        },
    },
};
