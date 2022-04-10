import { array, object, string } from 'joi';
import { DEFAULT_DARK_THEME, DEFAULT_MAIN_THEME } from '../daisyui-constants';
import type { DaisyUIConfig } from '../interfaces/daisyui-config.interface';
import { DefaultThemes } from '../themes';
import { CustomThemeSchema } from './custom-theme.schema';

export const DaisyUIConfigSchema = object<DaisyUIConfig>({
    mainTheme: string().default(DEFAULT_MAIN_THEME),
    darkTheme: string().default(DEFAULT_DARK_THEME),
    enabledDefaultThemes: array()
        .items(string())
        .default(DefaultThemes.map((theme) => theme.name)),
    customThemes: array().items(CustomThemeSchema).default([]),
});
