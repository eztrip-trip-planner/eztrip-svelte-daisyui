import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const CoffeeTheme: Theme = {
    coffee: {
        name: 'coffee',
        type: ThemeType.Dark,
        colors: {
            primary: '#DB924B',
            secondary: '#263E3F',
            accent: '#10576D',
            neutral: '#120C12',
            'base-100': '#20161F',
            'base-content': '#756E63',
            info: '#8DCAC1',
            success: '#9DB787',
            warning: '#FFD25F',
            error: '#FC9581',
        },
    },
};
