<script lang="ts">
    import { BrandColor, type BrandColorKey } from '$components/utils/brand-color.enum';
    import { FunctionalColor, type FunctionalColorKey } from '$components/utils/functional-color.enum';
    import type { Maybe } from '$components/utils/maybe.type';
    import { Size, type SizeKey } from '$components/utils/size.enum';
    import { ButtonShape, type ButtonShapeKey } from './button-shape.enum';
    import type { EnumKeysAsString } from '$components/utils/enum-keys-as-string.type';

    const AdditionalColor = { Ghost: 'ghost', Link: 'link' };
    type AdditionalColorKey = EnumKeysAsString<typeof AdditionalColor>;

    // Props
    export let color: Maybe<BrandColorKey | FunctionalColorKey | AdditionalColorKey> = null;
    export let size: Maybe<SizeKey> = null;
    export let shape: Maybe<ButtonShapeKey> = null;
    export let active: boolean = false;
    export let block: boolean = false;
    export let outline: boolean = false;
    export let loading: boolean = false;
    export let disabled: boolean = false;
    export let noAnim: boolean = false;
    let className: string = '';
    export { className as class };

    // Classes
    const classes: string[] = [];

    classes.push('btn');
    if (color) classes.push(`btn-${{ ...BrandColor, ...FunctionalColor, ...AdditionalColor }[color]}`);
    if (size) classes.push(`btn-${Size[size]}`);
    if (shape) classes.push(`btn-${ButtonShape[shape]}`);
    if (active) classes.push('btn-active');
    if (block && !shape) classes.push('btn-block');
    if (outline) classes.push('btn-outline');
    if (loading) classes.push('btn-loading');
    if (noAnim) classes.push('btn-no-animation');

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);

    const finalClass = classes.join(' ');
</script>

<button on:click class={finalClass} {disabled}>
    <slot />
</button>

<style lang="scss">
    @import 'Button.scss';
</style>
