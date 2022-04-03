<script lang="ts">
    import { BrandColor, BrandColorKey } from '../../utils/brand-color.enum';
    import { FunctionalColor, FunctionalColorKey } from '../../utils/functional-color.enum';
    import { Maybe } from '../../utils/maybe.type';

    // Props
    export let type: Maybe<BrandColorKey | FunctionalColorKey> = null;
    let className: string = '';
    export { className as class };

    // Classes
    const classes: string[] = [];

    classes.push('step');
    if (type) {
        const colors = { ...BrandColor, ...FunctionalColor };
        classes.push(`step-${colors[type]}`);
    }

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);

    const finalClass = classes.join(' ');
</script>

<div class={finalClass}>
    <slot />
</div>
