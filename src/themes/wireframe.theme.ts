import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const WireframeTheme: Theme = {
    wireframe: {
        name: 'wireframe',
        type: ThemeType.Light,
        font: {
            'font-family': 'Chalkboard,comic sans ms,"sanssecondaryerif"',
        },
        colors: {
            primary: '#b8b8b8',
            secondary: '#b8b8b8',
            accent: '#b8b8b8',
            neutral: '#ebebeb',
            'base-100': '#ffffff',
            'base-200': '#eeeeee',
            'base-300': '#dddddd',
            info: '#0000ff',
            success: '#008000',
            warning: '#a6a659',
            error: '#ff0000',
        },
        variables: {
            'box-border-radius': '0.2rem',
            'button-border-radius': '0.2rem',
            'badge-border-radius': '0.2rem',
            'tab-border-radius': '0.2rem',
        },
    },
};
