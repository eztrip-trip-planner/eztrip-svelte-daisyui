<script lang="ts">
    import { DropdownPosition } from './dropdown-position.enum';

    // Props
    export let position: keyof typeof DropdownPosition = 'Bottom';
    export let end: boolean = false;
    let className: string = '';
    export { className as class };

    // Classes
    const classes: string[] = [];

    classes.push('dropdown');
    classes.push(DropdownPosition[position]);
    if (end) classes.push('dropdown-end');

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);
</script>

<div class={classes.join(' ')}>
    <slot name="dropdown-focus" />
    <div class="dropdown-content">
        <slot name="dropdown-content" />
        <slot />
    </div>
</div>

<style lang="less">
    @import 'Dropdown.less';
</style>
