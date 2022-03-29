import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const AutumnTheme: Theme = {
    autumn: {
        name: 'autumn',
        type: ThemeType.Light,
        colors: {
            primary: '#8c0327',
            secondary: '#d85251',
            accent: '#d59b6a',
            neutral: '#826a5c',
            'base-100': '#f1f1f1',
            info: '#42adbb',
            success: '#499380',
            warning: '#e97f14',
            error: '#df1a2f',
        },
    },
};
