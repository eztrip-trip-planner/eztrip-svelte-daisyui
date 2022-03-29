<script lang="ts">
    import { Alignment } from '../../../utils/alignment.enum';
    import { BrandColor } from '../../../utils/brand-color.enum';
    import { EnumKeysAsString } from '../../../utils/enum-keys-as-string.type';
    import { FunctionalColor } from '../../../utils/functional-color.enum';
    import { Maybe } from '../../../utils/maybe.type';

    // Props
    export let alignment: EnumKeysAsString<typeof Alignment> = 'Horizontal';
    export let background: Maybe<EnumKeysAsString<typeof BrandColor & typeof FunctionalColor>> = null;
    let className: string = '';
    export { className as class };

    // Classes
    const classes: string[] = [];

    classes.push('stats');
    if (alignment) classes.push(`stats-${Alignment[alignment]}`);
    if (background) {
        const color = { ...BrandColor, ...FunctionalColor };
        classes.push(`stats-${color[background]}`);
    }

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);

    const finalClass = classes.join(' ');
</script>

<div class={finalClass}>
    <slot />
</div>

<style global lang="less">
    @import 'Stats.less';
</style>
