<script lang="ts">
    import { BrandColor, BrandColorKey } from '../../utils/brand-color.enum';
    import { FunctionalColor, FunctionalColorKey } from '../../utils/functional-color.enum';
    import { Maybe } from '../../utils/maybe.type';

    // Props
    export let hover: boolean = false;
    export let type: Maybe<BrandColorKey | FunctionalColorKey> = null;
    export let href: string = '';
    let className: string = '';
    export { className as class };

    // Classes
    const classes: string[] = [];

    classes.push('link');
    if (type) {
        const color = { ...BrandColor, ...FunctionalColor };
        classes.push(`link-${color[type]}`);
    }
    if (hover) classes.push('link-hover');

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);

    const finalClass = classes.join(' ');
</script>

<a {href} class={finalClass}>
    <slot />
</a>

<style global lang="less">
    @import 'Link.less';
</style>
