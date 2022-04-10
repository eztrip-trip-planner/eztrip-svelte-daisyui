import { object, string, type PartialSchemaMap } from 'joi';
import { COLOR_NAMES, DEFAULT_THEME } from '../daisyui-constants';
import type { Theme } from '../interfaces/theme.interface';

const colorSchemaMap: PartialSchemaMap = {};
const colorRegex = /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/i;

for (const color in COLOR_NAMES) {
    colorSchemaMap[`${color}`] = string().regex(colorRegex);
    colorSchemaMap[`${color}-focus`] = string().regex(colorRegex);
    colorSchemaMap[`${color}-content`] = string().regex(colorRegex);
}

for (let i = 100; i <= 300; i += 100) colorSchemaMap[`base-${i}`] = string().regex(colorRegex);
colorSchemaMap[`base-content`] = string().regex(colorRegex);

export const CustomThemeSchema = object<Theme>({
    name: string().required(),
    'font-family': string(),
    colors: object(colorSchemaMap).required(),
    variables: object({
        box: object({
            'border-radius': string().default(DEFAULT_THEME.variables.box['border-radius']),
        }).default(DEFAULT_THEME.variables.box),
        button: object({
            'border-radius': string().default(DEFAULT_THEME.variables.button['border-radius']),
            'border-width': string().default(DEFAULT_THEME.variables.button['border-width']),
            'text-transform': string()
                .valid('lowercase', 'uppercase')
                .default(DEFAULT_THEME.variables.button['text-transform']),
            'focus-scale': string().default(DEFAULT_THEME.variables.button['focus-scale']),
            'animation-duration': string().default(DEFAULT_THEME.variables.button['animation-duration']),
        }).default(DEFAULT_THEME.variables.button),
        input: object({
            'animation-duration': string().default(DEFAULT_THEME.variables.input['animation-duration']),
        }).default(DEFAULT_THEME.variables.input),
        badge: object({
            'border-radius': string().default(DEFAULT_THEME.variables.badge['border-radius']),
        }).default(DEFAULT_THEME.variables.badge),
        tab: object({
            'border-radius': string().default(DEFAULT_THEME.variables.tab['border-radius']),
            'border-width': string().default(DEFAULT_THEME.variables.tab['border-width']),
        }).default(DEFAULT_THEME.variables.tab),
    }).default(DEFAULT_THEME.variables),
});
