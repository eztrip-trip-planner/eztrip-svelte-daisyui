import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const WinterTheme: Theme = {
    winter: {
        name: 'winter',
        type: ThemeType.Light,
        colors: {
            primary: '#047aff',
            secondary: '#463aa2',
            accent: '#c148ac',
            neutral: '#021431',
            'base-100': '#ffffff',
            'base-200': '#f2f7ff',
            'base-300': '#e3e9f4',
            'base-content': '#394e6a',
            info: '#93e7fb',
            success: '#81cfd1',
            warning: '#efd7bb',
            error: '#e58b8b',
        },
    },
};