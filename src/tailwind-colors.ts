const withOpacityValue = (variable: string) => {
    return ({ opacityValue }: { opacityValue: string }) => {
        if (!opacityValue) return `rgb(var(${variable}))`;
        return `rgb(var(${variable}) / ${opacityValue})`;
    };
};

const tailwindColors = {
    primary: withOpacityValue('--primary'),
    'primary-focus': withOpacityValue('--primary-focus'),
    'primary-content': withOpacityValue('--primary-content'),
    secondary: withOpacityValue('--secondary'),
    'secondary-focus': withOpacityValue('--secondary-focus'),
    'secondary-content': withOpacityValue('--secondary-content'),
    accent: withOpacityValue('--accent'),
    'accent-focus': withOpacityValue('--accent-focus'),
    'accent-content': withOpacityValue('--accent-content'),
    neutral: withOpacityValue('--neutral'),
    'neutral-focus': withOpacityValue('--neutral-focus'),
    'neutral-content': withOpacityValue('--neutral-content'),
    'base-100': withOpacityValue('--base-100'),
    'base-200': withOpacityValue('--base-200'),
    'base-300': withOpacityValue('--base-300'),
    'base-content': withOpacityValue('--base-content'),
    info: withOpacityValue('--info'),
    'info-focus': withOpacityValue('--info-focus'),
    'info-content': withOpacityValue('--info-content'),
    success: withOpacityValue('--success'),
    'success-focus': withOpacityValue('--success-focus'),
    'success-content': withOpacityValue('--success-content'),
    warning: withOpacityValue('--warning'),
    'warning-focus': withOpacityValue('--warning-focus'),
    'warning-content': withOpacityValue('--warning-content'),
    error: withOpacityValue('--error'),
    'error-focus': withOpacityValue('--error-focus'),
    'error-content': withOpacityValue('--error-content'),
};

export default tailwindColors;
