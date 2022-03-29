import type { ThemeType } from './theme-type.enum';

export interface Theme {
    [name: string]: {
        name: string;
        type: ThemeType;
        font?: {
            // Font Family
            'font-family'?: string;
        };
        colors: {
            // Brand Colors
            primary?: string;
            'primary-content'?: string;
            'primary-focus'?: string;
            secondary?: string;
            'secondary-content'?: string;
            'secondary-focus'?: string;
            accent?: string;
            'accent-content'?: string;
            'accent-focus'?: string;

            // Functional Colors
            success?: string;
            'success-content'?: string;
            'success-focus'?: string;
            info?: string;
            'info-content'?: string;
            'info-focus'?: string;
            warning?: string;
            'warning-content'?: string;
            'warning-focus'?: string;
            error?: string;
            'error-content'?: string;
            'error-focus'?: string;

            // Base Colors
            'base-100'?: string;
            'base-200'?: string;
            'base-300'?: string;
            'base-content'?: string;

            // Neutral
            neutral?: string;
            'neutral-content'?: string;
            'neutral-focus'?: string;
        };
        variables?: {
            // Variables
            'box-border-radius'?: string;
            'button-border-radius'?: string;
            'button-border-width'?: string;
            'button-text-case'?: 'lowercase' | 'uppercase';
            'button-focus-scale'?: string;
            'button-animation-duration'?: string;
            'input-animation-duration'?: string;
            'badge-border-radius'?: string;
            'tab-border-radius'?: string;
            'tab-border-width'?: string;
        };
    };
}
