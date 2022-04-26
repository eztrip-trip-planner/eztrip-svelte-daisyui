import joi from 'joi';
import { DEFAULT_DARK_THEME, DEFAULT_MAIN_THEME } from '../themes/constants';
import { CustomThemeSchema } from '../themes/custom-theme.schema';
import { DefaultThemes } from '../themes/default';
import type { DaisyUIConfig } from './daisyui-config.interface';

export const DaisyUIConfigSchema = joi.object<DaisyUIConfig>({
    mainTheme: joi.string().default(DEFAULT_MAIN_THEME),
    darkTheme: joi.string().default(DEFAULT_DARK_THEME),
    enabledDefaultThemes: joi
        .array()
        .items(joi.string())
        .default(DefaultThemes.map((theme) => theme.name)),
    customThemes: joi.array().items(CustomThemeSchema).default([]),
});
