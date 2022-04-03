<script lang="ts">
    import { AlignmentKey } from '../../utils/alignment.enum';
    import { BrandColorKey } from '../../utils/brand-color.enum';
    import { FunctionalColorKey } from '../../utils/functional-color.enum';
    import { Maybe } from '../../utils/maybe.type';

    // Props
    export let background: Maybe<BrandColorKey | FunctionalColorKey> = null;
    export let alignment: AlignmentKey = 'Vertical';
    export let compact: boolean = false;
    let className: string = '';
    export { className as class };

    // Classes
    const classes: string[] = [];

    classes.push('menu');

    const classNames = className.length > 0 ? className.split(' ') : [];
    classes.push(...classNames);

    const finalClass = classes.join(' ');
</script>

<ul class={finalClass}>
    <slot />
</ul>
