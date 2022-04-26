import tailwindPlugin, { type TailwindPluginFn } from 'tailwindcss/plugin';
import type { Theme } from '../themes/theme.interface';
import type { TailwindConfig } from 'tailwindcss/tailwind-config';
import { TAILWIND_CONFIG } from '../configs/tailwind.config';
import { ThemeProcessor } from '../themes/theme-processor';

const tailwindFunction: TailwindPluginFn = ({ config, addBase }) => {
    const mainTheme = config('daisyui.mainTheme') as string;
    const darkTheme = config('daisyui.darkTheme') as string;
    const enabledDefaultThemes = config(
        'daisyui.enabledDefaultThemes',
    ) as Array<string>;
    const customThemes = config('daisyui.customThemes') as Array<Theme>;

    const themeProcessor = new ThemeProcessor(
        mainTheme,
        darkTheme,
        enabledDefaultThemes,
        customThemes,
    );
    const generatedJsStyles = themeProcessor.generate();
    addBase(generatedJsStyles);

    console.log('DaisyUI: TailwindCSS plugin loaded');
};

export default tailwindPlugin(tailwindFunction, {
    theme: TAILWIND_CONFIG.theme,
} as TailwindConfig);
