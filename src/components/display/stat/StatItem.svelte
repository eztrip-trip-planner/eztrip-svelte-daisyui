<script lang="ts">
    import { BrandColor } from '../../../utils/brand-color.enum';
    import { EnumKeysAsString } from '../../../utils/enum-keys-as-string.type';
    import { FunctionalColor } from '../../../utils/functional-color.enum';
    import { Maybe } from '../../../utils/maybe.type';

    // Props
    export let title: Maybe<string> = null;
    export let value: Maybe<string> = null;
    export let description: Maybe<string> = null;
    export let background: Maybe<EnumKeysAsString<typeof BrandColor & typeof FunctionalColor>> = null;
    let className: string = '';
    export { className as class };

    // Classes
    const classes: string[] = [];

    classes.push('stat');
    if (background) {
        const colors = { ...BrandColor, ...FunctionalColor };
        classes.push(`stat-${colors[background]}`);
    }

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);

    const finalClass = classes.join(' ');
</script>

<div class={finalClass}>
    {#if $$slots.figure}
        <div class="stat-figure">
            <slot name="figure" />
        </div>
    {/if}
    {#if $$slots.title || title}
        <div class="stat-title">
            {#if $$slots.title}
                <slot name="title" />
            {:else if title}
                {title}
            {/if}
        </div>
    {/if}
    {#if $$slots.value || value}
        <div class="stat-value">
            {#if $$slots.value}
                <slot name="value" />
            {:else if value}
                {value}
            {/if}
        </div>
    {/if}
    {#if $$slots.description || description}
        <div class="stat-desc">
            {#if $$slots.description}
                <slot name="description" />
            {:else if description}
                {description}
            {/if}
        </div>
    {/if}
    {#if $$slots.actions}
        <div class="stat-actions">
            <slot name="actions" />
        </div>
    {/if}
</div>
