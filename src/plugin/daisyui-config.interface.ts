import type { Theme } from '../themes/theme.interface';

export interface DaisyUIConfig {
    mainTheme: string;
    darkTheme: string;
    enabledDefaultThemes: string[];
    customThemes: Theme[];
}
