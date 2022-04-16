function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function null_to_empty(value) {
    return value == null ? '' : value;
}
function append(target, node) {
    target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
        const style = element('style');
        style.id = style_sheet_id;
        style.textContent = styles;
        append_stylesheet(append_styles_to, style);
    }
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        while (flushidx < dirty_components.length) {
            const component = dirty_components[flushidx];
            flushidx++;
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

const AdditionalColor = {
    ghost: 'ghost',
    link: 'link',
};

const BrandColor = {
    primary: 'primary',
    secondary: 'secondary',
    accent: 'accent',
};

const FunctionalColor = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
};

const Size = {
    tiny: 'xs',
    small: 'sm',
    medium: 'md',
    large: 'lg',
};

const ButtonShape = {
    square: 'square',
    circle: 'circle',
};

/**
 * @template T
 * @typedef {null | undefined | T} Nullable
 */

/**
 * @typedef ClassPropData
 * @prop {Nullable<boolean>} condition
 * @prop {Nullable<string>} key
 * @prop {string | Record<string, string>} value
 */

/**
 * @typedef ClassProps
 * @prop {Record<string, ClassPropData>} name
 */

/**
 *
 * @param {string} prefix
 * @param {ClassProps} classProps
 * @param {*} restClass
 * @returns
 */
function classes(prefix, classProps, restClass) {
    const classList = [prefix];

    for (const prop in classProps) {
        const { condition, key, value } = classProps[prop];
        if (!condition) continue;
        if (key && typeof value !== 'string' && value[key]) classList.push(`${prefix}-${value[key]}`);
        else classList.push(`${prefix}-${value}`);
    }

    if (restClass && typeof restClass === 'string' && restClass.length > 0) {
        const restClassList = restClass.split(' ');
        classList.push(...restClassList);
    }

    return classList.join(' ');
}

/* src/components/button/Button.svelte generated by Svelte v3.47.0 */

function add_css(target) {
	append_styles(target, "svelte-1yayxv3", ".btn.svelte-1yayxv3{display:inline-flex;flex-shrink:0;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;flex-wrap:wrap;align-items:center;justify-content:center;border-color:transparent;text-align:center;transition-property:color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;transition-duration:200ms;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);height:3rem;padding-left:1rem;padding-right:1rem;font-size:0.875rem;line-height:1.25rem;font-weight:600;text-transform:uppercase;line-height:1em;border-radius:0.5rem;border-width:1px;-webkit-animation:svelte-1yayxv3-button-pop var(--animation-btn, 0.25s) ease-out;animation:svelte-1yayxv3-button-pop var(--animation-btn, 0.25s) ease-out}.btn.svelte-1yayxv3:disabled{--tw-border-opacity:0;background-color:hsl(var(--neutral) / var(--tw-bg-opacity));--tw-bg-opacity:0.2;color:hsl(var(--base-content) / var(--tw-text-opacity));--tw-text-opacity:0.2;pointer-events:none}.btn.btn-no-animation.svelte-1yayxv3{--animation-btn:0;--btn-focus-scale:1}.btn.svelte-1yayxv3:active:hover,.btn.svelte-1yayxv3:active:focus{-webkit-animation:none;animation:none;transform:var(--btn-focus-scale, 0.95)}.btn.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--neutral) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--neutral) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--neutral-content) / var(--tw-text-opacity))}.btn.svelte-1yayxv3:hover,.btn.btn-active.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--neutral-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--neutral-focus) / var(--tw-bg-opacity))}.btn.svelte-1yayxv3:focus-visible{outline:2px solid rgb(var(--neutral-focus));outline-offset:2px}.btn.btn-primary.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--primary) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--primary) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--primary-content) / var(--tw-text-opacity))}.btn.btn-primary.svelte-1yayxv3:hover,.btn.btn-primary.btn-active.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--primary-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--primary-focus) / var(--tw-bg-opacity))}.btn.btn-primary.svelte-1yayxv3:focus-visible{outline:2px solid rgb(var(--primary))}.btn.btn-secondary.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--secondary) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--secondary) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--secondary-content) / var(--tw-text-opacity))}.btn.btn-secondary.svelte-1yayxv3:hover,.btn.btn-secondary.btn-active.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--secondary-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--secondary-focus) / var(--tw-bg-opacity))}.btn.btn-secondary.svelte-1yayxv3:focus-visible{outline:2px solid rgb(var(--secondary))}.btn.btn-accent.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--accent) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--accent) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--accent-content) / var(--tw-text-opacity))}.btn.btn-accent.svelte-1yayxv3:hover,.btn.btn-accent.btn-active.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--accent-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--accent-focus) / var(--tw-bg-opacity))}.btn.btn-accent.svelte-1yayxv3:focus-visible{outline:2px solid rgb(var(--accent))}.btn.btn-info.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--info) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--info) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--info-content) / var(--tw-text-opacity))}.btn.btn-info.svelte-1yayxv3:hover,.btn.btn-info.btn-active.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--info-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--info-focus) / var(--tw-bg-opacity))}.btn.btn-info.svelte-1yayxv3:focus-visible{outline:2px solid rgb(var(--info))}.btn.btn-success.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--success) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--success) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--success-content) / var(--tw-text-opacity))}.btn.btn-success.svelte-1yayxv3:hover,.btn.btn-success.btn-active.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--success-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--success-focus) / var(--tw-bg-opacity))}.btn.btn-success.svelte-1yayxv3:focus-visible{outline:2px solid rgb(var(--success))}.btn.btn-warning.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--warning) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--warning) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--warning-content) / var(--tw-text-opacity))}.btn.btn-warning.svelte-1yayxv3:hover,.btn.btn-warning.btn-active.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--warning-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--warning-focus) / var(--tw-bg-opacity))}.btn.btn-warning.svelte-1yayxv3:focus-visible{outline:2px solid rgb(var(--warning))}.btn.btn-error.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--error) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--error) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--error-content) / var(--tw-text-opacity))}.btn.btn-error.svelte-1yayxv3:hover,.btn.btn-error.btn-active.svelte-1yayxv3{--tw-border-opacity:1;border-color:hsl(var(--error-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--error-focus) / var(--tw-bg-opacity))}.btn.btn-error.svelte-1yayxv3:focus-visible{outline:2px solid rgb(var(--error))}.btn.btn-xs.svelte-1yayxv3{height:1.5rem;padding-left:0.5rem;padding-right:0.5rem;min-height:1.5rem;font-size:0.75rem}.btn.btn-sm.svelte-1yayxv3{height:2rem;padding-left:0.75rem;padding-right:0.75rem;min-height:2rem;font-size:0.875rem}.btn.btn-md.svelte-1yayxv3{height:3rem;padding-left:1rem;padding-right:1rem;min-height:3rem;font-size:0.875rem}.btn.btn-lg.svelte-1yayxv3{height:4rem;padding-left:1.5rem;padding-right:1.5rem;min-height:4rem;font-size:1.125rem}.btn.btn-block.svelte-1yayxv3{width:100%}.btn.btn-square.svelte-1yayxv3{height:3rem;width:3rem;padding:0px}.btn.btn-square.btn-xs.svelte-1yayxv3{height:1.5rem;width:1.5rem;padding:0px}.btn.btn-square.btn-sm.svelte-1yayxv3{height:2rem;width:2rem;padding:0px}.btn.btn-square.btn-md.svelte-1yayxv3{height:3rem;width:3rem;padding:0px}.btn.btn-square.btn-lg.svelte-1yayxv3{height:4rem;width:4rem;padding:0px}.btn.btn-circle.svelte-1yayxv3{height:3rem;width:3rem;border-radius:9999px;padding:0px}.btn.btn-circle.btn-xs.svelte-1yayxv3{height:1.5rem;width:1.5rem;border-radius:9999px;padding:0px}.btn.btn-circle.btn-sm.svelte-1yayxv3{height:2rem;width:2rem;border-radius:9999px;padding:0px}.btn.btn-circle.btn-md.svelte-1yayxv3{height:3rem;width:3rem;border-radius:9999px;padding:0px}.btn.btn-circle.btn-lg.svelte-1yayxv3{height:4rem;width:4rem;border-radius:9999px;padding:0px}.btn.btn-loading.svelte-1yayxv3,.btn.btn-loading.svelte-1yayxv3:hover{pointer-events:none}.btn.btn-loading.svelte-1yayxv3:before{margin-right:0.5rem;height:1rem;width:1rem;border-radius:9999px;border-width:2px;-webkit-animation:svelte-1yayxv3-spin 2s linear infinite;animation:svelte-1yayxv3-spin 2s linear infinite;content:\"\";border-top-color:transparent;border-left-color:transparent;border-bottom-color:currentColor;border-right-color:currentColor}.btn.btn-loading.btn-square.svelte-1yayxv3:before,.btn.btn-loading.btn-circle.svelte-1yayxv3:before{margin-right:0px}.btn.btn-loading.btn-xl.svelte-1yayxv3:before,.btn.btn-loading.btn-lg.svelte-1yayxv3:before{height:1.25rem;width:1.25rem}.btn.btn-loading.btn-sm.svelte-1yayxv3:before,.btn.btn-loading.btn-xs.svelte-1yayxv3:before{height:0.75rem;width:0.75rem}@media(prefers-reduced-motion: reduce){.btn.btn-loading.svelte-1yayxv3::before{-webkit-animation:svelte-1yayxv3-spin 10s linear infinite;animation:svelte-1yayxv3-spin 10s linear infinite}}.btn.btn-ghost.svelte-1yayxv3{border-width:1px;border-color:transparent;background-color:transparent;color:currentColor}.btn.btn-ghost.svelte-1yayxv3:hover,.btn.btn-ghost.btn-active.svelte-1yayxv3{--tw-border-opacity:0;background-color:hsl(var(--base-content) / var(--tw-bg-opacity));--tw-bg-opacity:0.2}.btn.btn-ghost.svelte-1yayxv3:focus-visible{outline:2px solid 0 0 2px currentColor}.btn.btn-link.svelte-1yayxv3{border-color:transparent;background-color:transparent;--tw-text-opacity:1;color:hsl(var(--primary) / var(--tw-text-opacity))}.btn.btn-link.svelte-1yayxv3:hover,.btn.btn-link.btn-active.svelte-1yayxv3{border-color:transparent;background-color:transparent;-webkit-text-decoration-line:underline;text-decoration-line:underline}.btn.btn-link.svelte-1yayxv3:focus-visible{outline:2px solid 0 0 2px currentColor}.btn.btn-outline.svelte-1yayxv3{border-color:currentColor;background-color:transparent;--tw-text-opacity:1;color:hsl(var(--base-content) / var(--tw-text-opacity))}.btn.btn-outline.svelte-1yayxv3:hover{--tw-border-opacity:1;border-color:hsl(var(--base-content) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--base-content) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--base-100) / var(--tw-text-opacity))}.btn.btn-outline.svelte-1yayxv3:hover>.badge{--tw-border-opacity:1;border-color:hsl(var(--base-200) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--base-200) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--base-content) / var(--tw-text-opacity))}.btn.btn-outline.svelte-1yayxv3:hover>.badge:global(.badge-outline){--tw-border-opacity:1;border-color:hsl(var(--base-200) / var(--tw-border-opacity));--tw-text-opacity:1;color:hsl(var(--neutral-content) / var(--tw-text-opacity))}.btn.btn-outline.svelte-1yayxv3>.badge{--tw-border-opacity:1;border-color:hsl(var(--neutral-focus) / var(--tw-border-opacity));--tw-text-opacity:1;color:hsl(var(--neutral-content) / var(--tw-text-opacity))}.btn.btn-outline.svelte-1yayxv3>.badge:global(.badge-outline){--tw-border-opacity:1;border-color:hsl(var(--neutral-focus) / var(--tw-border-opacity));background-color:transparent}.btn.btn-outline.btn-primary.svelte-1yayxv3{--tw-text-opacity:1;color:hsl(var(--primary) / var(--tw-text-opacity))}.btn.btn-outline.btn-primary.svelte-1yayxv3:hover{--tw-border-opacity:1;border-color:hsl(var(--primary-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--primary-focus) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--primary-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-primary.svelte-1yayxv3>.badge{--tw-border-opacity:1;border-color:hsl(var(--primary) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--primary) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--primary-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-primary.svelte-1yayxv3>.badge:hover{--tw-border-opacity:1;border-color:hsl(var(--primary-content) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--primary-content) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--primary) / var(--tw-text-opacity))}.btn.btn-outline.btn-primary.svelte-1yayxv3>.badge:hover:global(.badge-outline){--tw-border-opacity:1;border-color:hsl(var(--primary-content) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--primary-focus) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--primary-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-primary.svelte-1yayxv3>.badge:global(.badge-outline){--tw-border-opacity:1;border-color:hsl(var(--primary) / var(--tw-border-opacity));background-color:transparent;--tw-text-opacity:1;color:hsl(var(--primary) / var(--tw-text-opacity))}.btn.btn-outline.btn-secondary.svelte-1yayxv3{--tw-text-opacity:1;color:hsl(var(--secondary) / var(--tw-text-opacity))}.btn.btn-outline.btn-secondary.svelte-1yayxv3:hover{--tw-border-opacity:1;border-color:hsl(var(--secondary-focus) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--secondary-focus) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--secondary-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-secondary.svelte-1yayxv3>.badge{--tw-border-opacity:1;border-color:hsl(var(--secondary) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--secondary) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--secondary-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-secondary.svelte-1yayxv3>.badge:hover{--tw-border-opacity:1;border-color:hsl(var(--secondary-content) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--secondary-content) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--secondary) / var(--tw-text-opacity))}.btn.btn-outline.btn-secondary.svelte-1yayxv3>.badge:hover:global(.badge-outline){--tw-border-opacity:1;border-color:hsl(var(--secondary-content) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--secondary-focus) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--secondary-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-secondary.svelte-1yayxv3>.badge:global(.badge-outline){--tw-border-opacity:1;border-color:hsl(var(--secondary) / var(--tw-border-opacity));background-color:transparent;--tw-text-opacity:1;color:hsl(var(--secondary) / var(--tw-text-opacity))}.btn.btn-outline.btn-accent.svelte-1yayxv3{--tw-text-opacity:1;color:hsl(var(--accent) / var(--tw-text-opacity))}.btn.btn-outline.btn-accent.svelte-1yayxv3:hover{--tw-border-opacity:1;border-color:hsl(var(--accent) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--accent) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--accent-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-accent.svelte-1yayxv3>.badge{--tw-border-opacity:1;border-color:hsl(var(--accent) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--accent) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--accent-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-accent.svelte-1yayxv3>.badge:hover{--tw-border-opacity:1;border-color:hsl(var(--accent-content) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--accent-content) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--accent) / var(--tw-text-opacity))}.btn.btn-outline.btn-accent.svelte-1yayxv3>.badge:hover:global(.badge-outline){--tw-border-opacity:1;border-color:hsl(var(--accent-content) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--accent-focus) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--accent-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-accent.svelte-1yayxv3>.badge:global(.badge-outline){--tw-border-opacity:1;border-color:hsl(var(--accent) / var(--tw-border-opacity));background-color:transparent;--tw-text-opacity:1;color:hsl(var(--accent) / var(--tw-text-opacity))}.btn.btn-outline.btn-success.svelte-1yayxv3{--tw-text-opacity:1;color:hsl(var(--success-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-success.svelte-1yayxv3:hover{--tw-border-opacity:1;border-color:hsl(var(--success) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--success) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--success-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-info.svelte-1yayxv3{--tw-text-opacity:1;color:hsl(var(--info-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-info.svelte-1yayxv3:hover{--tw-border-opacity:1;border-color:hsl(var(--info) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--info) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--info-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-warning.svelte-1yayxv3{--tw-text-opacity:1;color:hsl(var(--warning-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-warning.svelte-1yayxv3:hover{--tw-border-opacity:1;border-color:hsl(var(--warning) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--warning) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--warning-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-error.svelte-1yayxv3{--tw-text-opacity:1;color:hsl(var(--error-content) / var(--tw-text-opacity))}.btn.btn-outline.btn-error.svelte-1yayxv3:hover{--tw-border-opacity:1;border-color:hsl(var(--error) / var(--tw-border-opacity));--tw-bg-opacity:1;background-color:hsl(var(--error) / var(--tw-bg-opacity));--tw-text-opacity:1;color:hsl(var(--error-content) / var(--tw-text-opacity))}@-webkit-keyframes svelte-1yayxv3-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes svelte-1yayxv3-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1yayxv3-button-pop{0%{transform:scale(var(--btn-focus-scale, 0.95))}40%{transform:scale(1.02)}100%{transform:scale(1)}}@keyframes svelte-1yayxv3-button-pop{0%{transform:scale(var(--btn-focus-scale, 0.95))}40%{transform:scale(1.02)}100%{transform:scale(1)}}");
}

function create_fragment(ctx) {
	let button;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[12].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

	return {
		c() {
			button = element("button");
			if (default_slot) default_slot.c();
			attr(button, "class", "" + (null_to_empty(/*classNames*/ ctx[1]) + " svelte-1yayxv3"));
			button.disabled = /*disabled*/ ctx[0];
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (default_slot) {
				default_slot.m(button, null);
			}

			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[13]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[11],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*disabled*/ 1) {
				button.disabled = /*disabled*/ ctx[0];
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(button);
			if (default_slot) default_slot.d(detaching);
			mounted = false;
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { color = null } = $$props;
	let { size = null } = $$props;
	let { shape = null } = $$props;
	let { active = false } = $$props;
	let { block = false } = $$props;
	let { outline = false } = $$props;
	let { loading = false } = $$props;
	let { disabled = false } = $$props;
	let { noAnim = false } = $$props;
	let { class: className = null } = $$props;

	// -----------------------------------------------------------
	//                          Classes
	// -----------------------------------------------------------
	const classNames = classes(
		'btn',
		{
			color: {
				condition: !!color,
				key: color,
				value: {
					...BrandColor,
					...FunctionalColor,
					...AdditionalColor
				}
			},
			size: {
				condition: !!size,
				key: size,
				value: Size
			},
			shape: {
				condition: !!shape,
				key: shape,
				value: ButtonShape
			},
			active: { condition: active, value: 'active' },
			block: {
				condition: block && !shape,
				value: 'block'
			},
			outline: { condition: outline, value: 'outline' },
			loading: { condition: loading, value: 'loading' },
			noAnim: { condition: noAnim, value: 'no-animation' }
		},
		className
	);

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	$$self.$$set = $$props => {
		if ('color' in $$props) $$invalidate(2, color = $$props.color);
		if ('size' in $$props) $$invalidate(3, size = $$props.size);
		if ('shape' in $$props) $$invalidate(4, shape = $$props.shape);
		if ('active' in $$props) $$invalidate(5, active = $$props.active);
		if ('block' in $$props) $$invalidate(6, block = $$props.block);
		if ('outline' in $$props) $$invalidate(7, outline = $$props.outline);
		if ('loading' in $$props) $$invalidate(8, loading = $$props.loading);
		if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
		if ('noAnim' in $$props) $$invalidate(9, noAnim = $$props.noAnim);
		if ('class' in $$props) $$invalidate(10, className = $$props.class);
		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
	};

	return [
		disabled,
		classNames,
		color,
		size,
		shape,
		active,
		block,
		outline,
		loading,
		noAnim,
		className,
		$$scope,
		slots,
		click_handler
	];
}

class Button extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				color: 2,
				size: 3,
				shape: 4,
				active: 5,
				block: 6,
				outline: 7,
				loading: 8,
				disabled: 0,
				noAnim: 9,
				class: 10
			},
			add_css
		);
	}
}

export { Button };
//# sourceMappingURL=index.js.map
