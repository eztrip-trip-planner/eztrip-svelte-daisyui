<script lang="ts">
    import { BrandColor, BrandColorKey } from '../../../utils/brand-color.enum';
    import { FunctionalColor, FunctionalColorKey } from '../../../utils/functional-color.enum';
    import { Maybe } from '../../../utils/maybe.type';
    import { Position, PositionKey } from '../../../utils/position.enum';

    // Props
    export let forceOpen: Maybe<boolean> = null;
    export let position: PositionKey = 'Top';
    export let type: Maybe<BrandColorKey | FunctionalColorKey> = null;
    let className: string = '';
    export { className as class };

    // Classes
    const classes: string[] = [];

    classes.push('tooltip');
    if (forceOpen) classes.push('tooltip-open');
    classes.push(Position[position]);
    if (type) {
        const colors = { ...BrandColor, ...FunctionalColor };
        classes.push(`tooltip-${colors[type]}`);
    }

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);

    const finalClass = classes.join(' ');
</script>

<div class={finalClass}>
    <div class="tooltip-content">
        <slot name="content" />
    </div>
    <slot />
</div>

<style lang="less">
    @import 'Tooltip.less';
</style>
