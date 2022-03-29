import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const AcidTheme: Theme = {
    acid: {
        name: 'acid',
        type: ThemeType.Light,
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
            'box-border-radius': '1.25rem',
            'button-border-radius': '1rem',
            'badge-border-radius': '1rem',
        },
    },
};
