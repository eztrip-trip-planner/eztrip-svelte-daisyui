import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const EmeraldTheme: Theme = {
    emerald: {
        name: 'emerald',
        type: ThemeType.Light,
        colors: {
            primary: '#66cc8a',
            'primary-content': '#223d30',
            secondary: '#377cfb',
            'secondary-content': '#f9fafb',
            accent: '#ea5234',
            'accent-content': '#f9fafb',
            neutral: '#333c4d',
            'neutral-content': '#f9fafb',
            'base-100': '#ffffff',
            'base-content': '#333c4d',
        },
        variables: {
            'button-animation-duration': '0',
            'input-animation-duration': '0',
            'button-focus-scale': '1',
        },
    },
};
