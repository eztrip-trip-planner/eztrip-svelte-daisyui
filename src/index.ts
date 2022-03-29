import type { TailwindConfig } from 'tailwindcss/tailwind-config';
import type { Theme } from './themes/theme.interface';
// import { colord } from 'colord';
import tailwindColors from './tailwind-colors';
import plugin, { type TailwindPluginFn } from 'tailwindcss/plugin';
import { DefaultThemes } from './themes';

const colors = {
    primary: {
        focus: {},
        content: {},
    },
    secondary: {
        focus: {},
        content: {},
    },
    accent: {
        focus: {},
        content: {},
    },
    success: {
        focus: {},
        content: {},
    },
    info: {
        focus: {},
        content: {},
    },
    warning: {
        focus: {},
        content: {},
    },
    error: {
        focus: {},
        content: {},
    },
    neutral: {
        focus: {},
        content: {},
    },
    'base-100': {
        content: {},
    },
};

const processTheme = (theme: Theme) => {
    const processedTheme = { ...theme };

    for (const color in colors) {
        if (!theme[color as keyof typeof colors]) {
        }
    }

    return processedTheme;
};

const fn: TailwindPluginFn = ({ addBase, config }) => {
    // const includedThemes:  = [];
    const mainTheme = config('daisyui.mainTheme') as string;
    const darkTheme = config('daisyui.darkTheme') as string;

    const enabledThemes = config('daisyui.enabledThemes');
    const customThemes = config('daisyui.customThemes');

    // for (const [name, theme] of Object.entries(themes)) {
    //     const processedTheme = processTheme(theme);
    // }
};
const config: TailwindConfig = { theme: { extend: { colors: tailwindColors } } };

export default plugin(fn, config);
