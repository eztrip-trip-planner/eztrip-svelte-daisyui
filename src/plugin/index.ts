import tailwindPlugin, { type TailwindPluginFn } from 'tailwindcss/plugin';
import { DaisyUIConfigSchema } from './schemas/daisyui-config.schema';
import type { Theme } from './interfaces/theme.interface';
import { DefaultThemes } from './themes';
import { COLOR_NAMES, DEFAULT_DARK_THEME, DEFAULT_MAIN_THEME, DEFAULT_THEME } from './daisyui-constants';
import { CustomThemeSchema } from './schemas/custom-theme.schema';
import type { StringKeyOf } from '@eztrip/types';
import { colord, extend, type HslColor } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import { TAILWIND_COLORS } from './tailwind-colors';
import type { TailwindConfig } from 'tailwindcss/tailwind-config';

extend([
    mixPlugin,
    (ColordClass) => {
        ColordClass.prototype.saturate = function saturate(amount: number = 0.1) {
            const hsl = this.toHsl();
            hsl.s += hsl.s * amount;
            return new ColordClass(hsl);
        };
        ColordClass.prototype.darken = function darken(amount: number = 0.1) {
            const hsl = this.toHsl();
            hsl.l -= hsl.l * amount;
            return new ColordClass(hsl);
        };
    },
]);

/**
 *
 */
const formatHslString = (hsl: HslColor) => `${hsl.h} ${hsl.s}% ${hsl.l}%`;

/**
 *
 * @param theme
 * @returns
 */
const processTheme = (theme: Theme) => {
    const processedTheme = {} as Record<string, string>;

    for (const colorName in COLOR_NAMES) {
        const color = colorName as StringKeyOf<typeof COLOR_NAMES>;
        // Main color
        const mainColor = colord(theme.colors[color] ?? DEFAULT_THEME.colors[color]);
        processedTheme[`--${color}`] = formatHslString(mainColor.toHsl());
        // Content color
        let colorContent = colord(
            theme.colors[`${color}-content`] ??
                (mainColor.isDark()
                    ? mainColor.mix('#ffffff', 0.8).saturate(10)
                    : mainColor.mix('#000000', 0.8).saturate(10)),
        );
        processedTheme[`--${color}-content`] = formatHslString(colorContent.toHsl());
        // Focus color
        const colorFocus = theme.colors[`${color}-focus`]
            ? colord(theme.colors[`${color}-focus`])
            : mainColor.darken(0.2);
        processedTheme[`--${color}-focus`] = formatHslString(colorFocus.toHsl());
    }

    // Base color
    const baseColor = colord(theme.colors['base-100'] ?? DEFAULT_THEME.colors['base-100']);
    processedTheme['--base-100'] = formatHslString(baseColor.toHsl());
    processedTheme['--base-200'] = formatHslString(baseColor.darken(0.1).toHsl());
    processedTheme['--base-300'] = formatHslString(baseColor.darken(0.1).darken(0.1).toHsl());
    processedTheme['--base-content'] = formatHslString(
        colord(
            theme.colors['base-content'] ??
                (baseColor.isDark()
                    ? baseColor.mix('#ffffff', 0.8).saturate(10)
                    : baseColor.mix('#000000', 0.8).saturate(10)),
        ).toHsl(),
    );

    if (!theme.variables) return processedTheme;

    for (const [section, sectionVars] of Object.entries(theme.variables))
        for (const [key, value] of Object.entries(sectionVars)) processedTheme[`--${section}-${key}`] = value as string;

    return processedTheme;
};

/**
 *
 */
const tailwindFunction: TailwindPluginFn = ({ config, addBase }) => {
    const includedThemes = [] as Theme[];

    // Validating the config
    const { error, value: validatedConfig } = DaisyUIConfigSchema.validate({
        mainTheme: config('daisyui.mainTheme') as string,
        darkTheme: config('daisyui.darkTheme') as string,
        enabledDefaultThemes: config('daisyui.enabledDefaultThemes') as string[],
        customThemes: config('daisyui.customThemes') as Theme[],
    });
    if (error) return console.log(error.message);
    if (!validatedConfig) return;

    // let { mainTheme, darkTheme } = value;
    // const { enabledDefaultThemes, customThemes } = value;

    // Including default themes
    for (const defaultThemeName of validatedConfig.enabledDefaultThemes) {
        const defaultTheme = DefaultThemes.find((theme) => theme.name === defaultThemeName);
        if (!defaultTheme) continue;

        const validatedTheme = CustomThemeSchema.validate(defaultTheme);
        if (validatedTheme.error) continue;

        includedThemes.push(validatedTheme.value);
    }
    // Including custom themes
    includedThemes.push(...validatedConfig.customThemes);
    // Finding the main and dark themes
    let mainTheme = includedThemes.find((theme) => theme.name === validatedConfig.mainTheme) as Theme;
    let darkTheme = includedThemes.find((theme) => theme.name === validatedConfig.darkTheme) as Theme;

    if (!mainTheme) {
        validatedConfig.mainTheme = DEFAULT_MAIN_THEME;
        mainTheme = includedThemes.find((theme) => theme.name === validatedConfig.mainTheme) as Theme;
    }
    if (!darkTheme) {
        validatedConfig.darkTheme = DEFAULT_DARK_THEME;
        darkTheme = includedThemes.find((theme) => theme.name === validatedConfig.darkTheme) as Theme;
    }

    // Processing the included themes and adding them to base
    addBase({
        [':root']: processTheme(mainTheme),
    });
    addBase({
        ['@media (prefers-color-scheme: dark)']: {
            [':root']: processTheme(darkTheme),
        },
    });

    for (const theme of includedThemes) {
        const processedTheme = processTheme(theme);
        addBase({
            [`[data-theme="${theme.name}"]`]: processedTheme,
        });
    }

    console.log('DaisyUI: TailwindCSS plugin loaded');
};

/**
 *
 */
export default tailwindPlugin(tailwindFunction, {
    theme: { extend: { colors: TAILWIND_COLORS } },
} as TailwindConfig);
