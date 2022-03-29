import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const ForestTheme: Theme = {
    forest: {
        name: 'forest',
        type: ThemeType.Dark,
        colors: {
            primary: '#1eb854',
            secondary: '#1fd65f',
            accent: '#d99330',
            neutral: '#110e0e',
            'base-100': '#171212',
        },
        variables: {
            'button-border-radius': '1.9rem',
        },
    },
};
