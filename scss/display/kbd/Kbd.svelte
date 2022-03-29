<script lang="ts">
    import { Maybe } from '../../../utils/maybe.type';
    import { Size, SizeKey } from '../../../utils/size.enum';

    // Props
    export let size: Maybe<SizeKey> = null;
    let className: string = '';
    export { className as class };

    // Classes
    const classes: string[] = [];

    classes.push('kbd');
    if (size) classes.push(`kbd-${Size[size]}`);

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);

    const finalClass = classes.join(' ');
</script>

<kbd class={finalClass}>
    <slot />
</kbd>

<style global lang="less">
    @import 'Kbd.less';
</style>
