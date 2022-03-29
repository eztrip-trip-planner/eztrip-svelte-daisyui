<script lang="ts">
    import { Maybe } from '../../utils/maybe.type';

    export let href: Maybe<string> = null;
    let className: string = '';
    export { className as class };

    const classes: string[] = [];

    classes.push('breadcrumb-item');

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);

    const finalClass = classes.join(' ');
</script>

<li class={finalClass}>
    {#if href}
        <a {href}><slot /></a>
    {:else}
        <slot />
    {/if}
</li>

<style global lang="less">
    @import 'BreadcrumbItem.less';
</style>
