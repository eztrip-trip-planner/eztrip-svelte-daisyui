import type { Theme } from './theme.interface';

export interface DaisyUIConfig {
    mainTheme: string;
    darkTheme: string;
    enabledDefaultThemes: string[];
    customThemes: Theme[];
}
