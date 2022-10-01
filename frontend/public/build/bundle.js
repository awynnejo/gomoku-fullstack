
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function tick() {
        schedule_update();
        return resolved_promise;
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.49.0 */

    const { Error: Error_1, Object: Object_1, console: console_1$3 } = globals;

    // (267:0) {:else}
    function create_else_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(267:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (260:0) {#if componentParams}
    function create_if_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(260:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push$1(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    function restoreScroll(state) {
    	// If this exists, then this is a back navigation: restore the scroll position
    	if (state) {
    		window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
    	} else {
    		// Otherwise this is a forward navigation: scroll to top
    		window.scrollTo(0, 0);
    	}
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			restoreScroll(previousScrollState);
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push: push$1,
    		pop,
    		replace,
    		link,
    		restoreScroll,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // Create store for user
    const login_store = writable(null);
    // Create store to pass game size
    const gamesize_store = writable(null);
    // Create store to store game state
    const gamestate_store = writable(null);
    // Create store for game history
    const gamehistory_store = writable([]);
    const database = [
        {
            username: 'admin',
            password: 'admin'
        }
    ];

    /* components/Home.svelte generated by Svelte v3.49.0 */
    const file$7 = "components/Home.svelte";

    function create_fragment$7(ctx) {
    	let h1;
    	let t1;
    	let form;
    	let label;
    	let t3;
    	let input;
    	let t4;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Welcome to gomoku";
    			t1 = space();
    			form = element("form");
    			label = element("label");
    			label.textContent = "Select board size";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Start Game!";
    			add_location(h1, file$7, 14, 0, 317);
    			attr_dev(label, "for", "inp_board_size");
    			add_location(label, file$7, 17, 4, 356);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "id", "inp_board_size");
    			attr_dev(input, "min", "5");
    			attr_dev(input, "max", "20");
    			add_location(input, file$7, 18, 4, 414);
    			attr_dev(button, "type", "submit");
    			add_location(button, file$7, 19, 4, 500);
    			add_location(form, file$7, 16, 0, 345);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, label);
    			append_dev(form, t3);
    			append_dev(form, input);
    			set_input_value(input, /*boardsize*/ ctx[0]);
    			append_dev(form, t4);
    			append_dev(form, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[2]),
    					listen_dev(button, "click", /*start_game*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*boardsize*/ 1 && to_number(input.value) !== /*boardsize*/ ctx[0]) {
    				set_input_value(input, /*boardsize*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(form);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $gamesize_store;
    	let $login_store;
    	validate_store(gamesize_store, 'gamesize_store');
    	component_subscribe($$self, gamesize_store, $$value => $$invalidate(3, $gamesize_store = $$value));
    	validate_store(login_store, 'login_store');
    	component_subscribe($$self, login_store, $$value => $$invalidate(4, $login_store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let boardsize = 10;

    	function start_game() {
    		if ($login_store != null) {
    			set_store_value(gamesize_store, $gamesize_store = boardsize, $gamesize_store);
    			push$1('/Game');
    		} else {
    			push$1('/Login');
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		boardsize = to_number(this.value);
    		$$invalidate(0, boardsize);
    	}

    	$$self.$capture_state = () => ({
    		push: push$1,
    		login_store,
    		gamesize_store,
    		boardsize,
    		start_game,
    		$gamesize_store,
    		$login_store
    	});

    	$$self.$inject_state = $$props => {
    		if ('boardsize' in $$props) $$invalidate(0, boardsize = $$props.boardsize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [boardsize, start_game, input_input_handler];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* node_modules/svelte-use-form/components/Hint.svelte generated by Svelte v3.49.0 */
    const file$6 = "node_modules/svelte-use-form/components/Hint.svelte";
    const get_default_slot_changes = dirty => ({ value: dirty & /*value*/ 4 });
    const get_default_slot_context = ctx => ({ value: /*value*/ ctx[2] });

    // (43:0) {#if !(hideWhenRequired && requiredError) && !hideWhenError}
    function create_if_block$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = (/*touched*/ ctx[5] || /*showWhenUntouched*/ ctx[1]) && /*value*/ ctx[2] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((/*touched*/ ctx[5] || /*showWhenUntouched*/ ctx[1]) && /*value*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*touched, showWhenUntouched, value*/ 38) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(43:0) {#if !(hideWhenRequired && requiredError) && !hideWhenError}",
    		ctx
    	});

    	return block;
    }

    // (44:2) {#if (touched || showWhenUntouched) && value}
    function create_if_block_1$1(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-use-form-hint " + /*internalClass*/ ctx[6]);
    			add_location(div, file$6, 44, 4, 1628);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, value*/ 131076)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(44:2) {#if (touched || showWhenUntouched) && value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !(/*hideWhenRequired*/ ctx[0] && /*requiredError*/ ctx[3]) && !/*hideWhenError*/ ctx[4] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!(/*hideWhenRequired*/ ctx[0] && /*requiredError*/ ctx[3]) && !/*hideWhenError*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*hideWhenRequired, requiredError, hideWhenError*/ 25) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let touched;
    	let errors;
    	let hideWhenError;
    	let requiredError;
    	let value;
    	let $form;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hint', slots, ['default']);
    	var _a, _b, _c, _d;
    	let { on = "" } = $$props;
    	let { hideWhen = "" } = $$props;
    	let { hideWhenRequired = false } = $$props;
    	let { showWhenUntouched = false } = $$props;
    	let { for: name = "" } = $$props;
    	let internalClass = $$props.class;

    	// Tries to get the name from the parent HintGroup
    	if (!name) name = getContext("svelte-use-form_hint-group-name");

    	const form = getContext("svelte-use-form_form");
    	validate_store(form, 'form');
    	component_subscribe($$self, form, value => $$invalidate(16, $form = value));

    	$$self.$$set = $$new_props => {
    		$$invalidate(19, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('on' in $$new_props) $$invalidate(9, on = $$new_props.on);
    		if ('hideWhen' in $$new_props) $$invalidate(10, hideWhen = $$new_props.hideWhen);
    		if ('hideWhenRequired' in $$new_props) $$invalidate(0, hideWhenRequired = $$new_props.hideWhenRequired);
    		if ('showWhenUntouched' in $$new_props) $$invalidate(1, showWhenUntouched = $$new_props.showWhenUntouched);
    		if ('for' in $$new_props) $$invalidate(8, name = $$new_props.for);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		_b,
    		_c,
    		_d,
    		getContext,
    		on,
    		hideWhen,
    		hideWhenRequired,
    		showWhenUntouched,
    		name,
    		internalClass,
    		form,
    		errors,
    		value,
    		requiredError,
    		hideWhenError,
    		touched,
    		$form
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(19, $$props = assign(assign({}, $$props), $$new_props));
    		if ('_a' in $$props) $$invalidate(11, _a = $$new_props._a);
    		if ('_b' in $$props) $$invalidate(12, _b = $$new_props._b);
    		if ('_c' in $$props) $$invalidate(13, _c = $$new_props._c);
    		if ('_d' in $$props) $$invalidate(14, _d = $$new_props._d);
    		if ('on' in $$props) $$invalidate(9, on = $$new_props.on);
    		if ('hideWhen' in $$props) $$invalidate(10, hideWhen = $$new_props.hideWhen);
    		if ('hideWhenRequired' in $$props) $$invalidate(0, hideWhenRequired = $$new_props.hideWhenRequired);
    		if ('showWhenUntouched' in $$props) $$invalidate(1, showWhenUntouched = $$new_props.showWhenUntouched);
    		if ('name' in $$props) $$invalidate(8, name = $$new_props.name);
    		if ('internalClass' in $$props) $$invalidate(6, internalClass = $$new_props.internalClass);
    		if ('errors' in $$props) $$invalidate(15, errors = $$new_props.errors);
    		if ('value' in $$props) $$invalidate(2, value = $$new_props.value);
    		if ('requiredError' in $$props) $$invalidate(3, requiredError = $$new_props.requiredError);
    		if ('hideWhenError' in $$props) $$invalidate(4, hideWhenError = $$new_props.hideWhenError);
    		if ('touched' in $$props) $$invalidate(5, touched = $$new_props.touched);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$form, name, _a, _b*/ 71936) {
    			$$invalidate(5, touched = $$invalidate(12, _b = $$invalidate(11, _a = $form[name]) === null || _a === void 0
    			? void 0
    			: _a.touched) !== null && _b !== void 0
    			? _b
    			: {});
    		}

    		if ($$self.$$.dirty & /*$form, name, _c, _d*/ 90368) {
    			$$invalidate(15, errors = $$invalidate(14, _d = $$invalidate(13, _c = $form[name]) === null || _c === void 0
    			? void 0
    			: _c.errors) !== null && _d !== void 0
    			? _d
    			: {});
    		}

    		if ($$self.$$.dirty & /*hideWhen, errors*/ 33792) {
    			$$invalidate(4, hideWhenError = hideWhen ? errors[hideWhen] : "");
    		}

    		if ($$self.$$.dirty & /*errors*/ 32768) {
    			$$invalidate(3, requiredError = errors["required"]);
    		}

    		if ($$self.$$.dirty & /*errors, on*/ 33280) {
    			$$invalidate(2, value = errors[on]);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		hideWhenRequired,
    		showWhenUntouched,
    		value,
    		requiredError,
    		hideWhenError,
    		touched,
    		internalClass,
    		form,
    		name,
    		on,
    		hideWhen,
    		_a,
    		_b,
    		_c,
    		_d,
    		errors,
    		$form,
    		$$scope,
    		slots
    	];
    }

    class Hint extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			on: 9,
    			hideWhen: 10,
    			hideWhenRequired: 0,
    			showWhenUntouched: 1,
    			for: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hint",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get on() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set on(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideWhen() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideWhen(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideWhenRequired() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideWhenRequired(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showWhenUntouched() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showWhenUntouched(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get for() {
    		throw new Error("<Hint>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set for(value) {
    		throw new Error("<Hint>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const isChrome = () => /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const animationName = "svelte-use-form-webkit-autofill";
    const css = `
@keyframes ${animationName} {
    from {}
}

input:-webkit-autofill {
    animation-name: svelte-use-form-webkit-autofill;
}
`;
    function startAnimationWhenAutofilled() {
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
    function handleChromeAutofill(textElement, control, callback) {
        if (!isChrome())
            return;
        function handleAnimationStart(event) {
            if (event.animationName.includes(animationName)) {
                const currentValue = textElement.value;
                // If chrome did not actually fill the value of the input
                if (!currentValue) {
                    control.valid = true;
                    callback();
                }
            }
        }
        textElement.addEventListener("animationstart", handleAnimationStart);
        startAnimationWhenAutofilled();
    }

    /** A FormControl represents the state of a form member like (input, textarea...) */
    class FormControl {
        constructor(formControl) {
            /**
             * Returns an object containing possible ValidationErrors
             * ### Example (All validators are throwing an error)
             * `{ required: true, minLength: 4, maxLength: 20 }`
             * ### Example 2 (Only required is not valid)
             * `{ required: true }`
             */
            this.errors = {};
            /**
             * Contains a map of values, that will be shown
             * in place of the original validation error.
             */
            this.errorMap = {};
            /**
             * The DOM elements representing this control
             */
            this.elements = [];
            /** If the FormControl passed all given validators. */
            this.valid = true;
            /**
             * If the FormControl has been interacted with.
             * (triggered by blur event)
             */
            this._touched = false;
            this.formRef = formControl.formRef;
            this.validators = formControl.validators;
            this.errorMap = formControl.errorMap;
            this.initial = formControl.value;
            this.elements = formControl.elements;
            this.value = formControl.value;
        }
        get value() {
            return this._value;
        }
        get touched() {
            return this._touched;
        }
        /**
         * This will only change the internal value of the control, not the one displayed in the actual HTML-Element
         *
         * See `change(value: String)` for doing both
         */
        set value(value) {
            this._value = value;
            this.validate();
        }
        set touched(value) {
            this._touched = value;
            this.elements.forEach((element) => {
                if (value)
                    element.classList.add("touched");
                else
                    element.classList.remove("touched");
            });
        }
        /**
         * Set an error manually.
         *
         * The error will be removed after changes to the value or on validate()
         *
         * Used for setting an error that would be difficult to implement with a validator.
         * e.g. Backend Response returning Login failed
         * ``` typescript
         * function submit() {
         *    apiLogin($form.values).then(response => {})
         *    .catch(error => {
         *        if (error.status === 403) {
         *            $form.password.error({ login: "Password or username is incorrect" });
         *        }
         *    })
         * }
         * ```
         */
        error(errors) {
            this.errors = { ...errors, ...this.errors };
            this.valid = false;
            // Updating the $form
            this.formRef()["_notifyListeners"]();
        }
        /** Change the internal value and the value of all HTML-Elements associated with this control */
        change(value) {
            this.value = value;
            this.elements.forEach((element) => (element.value = value));
        }
        /** Validate the FormControl by querying through the given validators. */
        validate() {
            let valid = true;
            this.errors = {};
            for (const validator of this.validators) {
                const errors = validator(this._value, this.formRef());
                if (errors) {
                    valid = false;
                    for (const error of Object.entries(errors)) {
                        let [key, value] = error;
                        // If there is a map for the error, use it
                        const errorMap = this.errorMap[key];
                        if (errorMap) {
                            value = typeof errorMap === "function" ? errorMap(value) : errorMap;
                        }
                        this.errors[key] = value;
                    }
                }
            }
            this.valid = valid;
            this.elements.forEach((element) => element.setCustomValidity(valid ? "" : "Field is invalid"));
            return valid;
        }
        /** Reset the form control value to its initial value and untouch it */
        reset({ value = null } = {}) {
            const resetValue = value !== null ? value : this.initial;
            this.elements.forEach((element) => (element.value = resetValue));
            this.value = resetValue;
            this.touched = false;
            // Updating the $form
            this.formRef()["_notifyListeners"]();
        }
    }

    class Form {
        constructor(initialData, notifyListeners) {
            for (const [k, v] of Object.entries(initialData !== null && initialData !== void 0 ? initialData : {})) {
                this._addFormControl(k, v.initial, v.validators, [], v.errorMap);
            }
            this._notifyListeners = notifyListeners;
        }
        // @ts-expect-error - Due to index signature
        get valid() {
            let valid = true;
            this.forEachFormControl((formControl) => {
                if (!formControl.valid)
                    valid = false;
            });
            return valid;
        }
        // @ts-expect-error - Due to index signature
        get touched() {
            let touched = true;
            this.forEachFormControl((formControl) => {
                if (!formControl.touched)
                    touched = false;
            });
            return touched;
        }
        // @ts-expect-error - Due to index signature
        get values() {
            let values = {};
            this.forEachFormControl((formControl, key) => {
                values[key] = formControl.value;
            });
            return values;
        }
        // @ts-expect-error - Due to index signature
        set touched(value) {
            this.forEachFormControl((formControl) => {
                formControl.touched = value;
            });
            this._notifyListeners();
        }
        /** Reset the whole form */
        // @ts-expect-error - Due to index signature
        reset() {
            this.forEachFormControl((formControl) => formControl.reset());
        }
        // @ts-expect-error - Due to index signature
        _addFormControl(name, initial, validators, elements, errorMap) {
            this[name] = new FormControl({
                value: initial !== null && initial !== void 0 ? initial : "",
                validators: validators !== null && validators !== void 0 ? validators : [],
                errorMap: errorMap !== null && errorMap !== void 0 ? errorMap : {},
                elements: elements !== null && elements !== void 0 ? elements : [],
                formRef: () => this,
            });
        }
        // @ts-expect-error - Due to index signature
        forEachFormControl(callback) {
            for (const [key, value] of Object.entries(this)) {
                if (value instanceof FormControl) {
                    callback(value, key);
                }
            }
        }
    }

    function isTextElement(node) {
        return (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement);
    }
    function isFormMember(node) {
        return (node instanceof HTMLInputElement ||
            node instanceof HTMLTextAreaElement ||
            node instanceof HTMLSelectElement);
    }

    const formReferences = writable([]);

    /** Create a new form.
     *
     * You can either pass a default configuration for the form.
     *
     * ----
     * ``` svelte
     * <script>
     *   const form = useForm({
     *     firstName: { initial: "CACHED_NAME", validators: [required, maxLength(10)] }
     *   })
     * </script>
     *
     * <input name="firstName />
     * ```
     * ----
     * or handle everything directly in the form control
     *
     * ----
     *
     * ```svelte
     * <script>
     *   const form = useForm();
     * </script>
     *
     * <input name="firstName" value="CACHED_NAME" use:validators={[required, maxLength(10)]} />
     * ```
     */
    function useForm(properties) {
        properties = properties !== null && properties !== void 0 ? properties : {};
        const eventListeners = [];
        const subscribers = [];
        let state = new Form(properties, notifyListeners);
        let observer;
        action.subscribe = subscribe;
        action.set = set;
        // Passing state via context to subcomponents like Hint
        setContext("svelte-use-form_form", action);
        /**
         * ### The store and action of a form.
         *
         * Use the `$` prefix to access the state of the form;
         */
        function action(node) {
            // Bootstrap form
            setupForm(node);
            // Add form reference to global internal store
            formReferences.update((values) => [
                ...values,
                { node, form: state, notifyListeners },
            ]);
            return {
                update: () => { },
                destroy: () => {
                    unmountEventListeners();
                    observer.disconnect();
                },
            };
        }
        function setupForm(node) {
            const inputElements = [...node.getElementsByTagName("input")];
            const textareaElements = [...node.getElementsByTagName("textarea")];
            const textElements = [...inputElements, ...textareaElements];
            const selectElements = [...node.getElementsByTagName("select")];
            setupTextElements(textElements);
            setupSelectElements(selectElements);
            hideNotRepresentedFormControls([...textElements, ...selectElements]);
            setupFormObserver(node);
            notifyListeners();
        }
        function setupTextElements(textElements) {
            for (const textElement of textElements) {
                const name = textElement["name"];
                if (!state[name]) {
                    let initial;
                    // Handle Radio button initial values
                    if (textElement.type === "radio" &&
                        textElement instanceof HTMLInputElement) {
                        initial = textElement.checked ? textElement.value : "";
                    }
                    else if (textElement.type === "checkbox" &&
                        textElement instanceof HTMLInputElement) {
                        initial = textElement.checked ? "checked" : "";
                    }
                    else {
                        initial = textElement.value;
                    }
                    state._addFormControl(name, initial, [], [textElement], {});
                }
                else {
                    state[name].elements.push(textElement);
                    if (textElement.type === "radio" &&
                        textElement instanceof HTMLInputElement &&
                        textElement.checked) {
                        state[name].initial = textElement.value;
                    }
                }
                switch (textElement.type) {
                    case "checkbox":
                    case "radio":
                        mountEventListener(textElement, "click", handleBlurOrClick);
                        break;
                    default:
                        setInitialValue(textElement, state[name]);
                        handleAutofill(textElement, state[name]);
                        mountEventListener(textElement, "blur", handleBlurOrClick);
                }
                mountEventListener(textElement, "input", handleInput);
            }
        }
        function setupSelectElements(selectElements) {
            for (const selectElement of selectElements) {
                const name = selectElement["name"];
                if (!state[name]) {
                    const initial = selectElement.value;
                    state._addFormControl(name, initial, [], [selectElement], {});
                }
                else {
                    state[name].elements.push(selectElement);
                    setInitialValue(selectElement, state[name]);
                }
                mountEventListener(selectElement, "input", handleInput);
                mountEventListener(selectElement, "input", handleBlurOrClick);
                mountEventListener(selectElement, "blur", handleBlurOrClick);
            }
        }
        function setupFormObserver(form) {
            observer = new MutationObserver(observeForm);
            observer.observe(form, { childList: true });
        }
        function observeForm(mutations) {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    // If node gets removed
                    for (const node of mutation.removedNodes) {
                        if (node instanceof HTMLElement) {
                            const inputElements = [...node.getElementsByTagName("input")];
                            const textareaElements = [...node.getElementsByTagName("textarea")];
                            const selects = [...node.getElementsByTagName("select")];
                            const elements = [
                                ...inputElements,
                                ...textareaElements,
                                ...selects,
                            ];
                            if (isFormMember(node))
                                elements.push(node);
                            for (const element of elements) {
                                for (const eventListener of eventListeners) {
                                    if (element === eventListener.node) {
                                        delete state[element["name"]];
                                        element.removeEventListener(eventListener.event, eventListener.listener);
                                    }
                                }
                            }
                        }
                    }
                    // If node gets added
                    for (const node of mutation.addedNodes) {
                        if (node instanceof HTMLElement) {
                            const inputElements = [...node.getElementsByTagName("input")];
                            const textareaElements = [...node.getElementsByTagName("textarea")];
                            const textElements = [...inputElements, ...textareaElements];
                            const selectElements = [...node.getElementsByTagName("select")];
                            if (isTextElement(node))
                                textElements.push(node);
                            else if (node instanceof HTMLSelectElement)
                                selectElements.push(node);
                            for (const element of [...textElements, ...selectElements]) {
                                const initialFormControlProperty = properties[element.name];
                                if (!state[element.name] && initialFormControlProperty) {
                                    state._addFormControl(element.name, initialFormControlProperty.initial, initialFormControlProperty.validators, [element], initialFormControlProperty.errorMap);
                                }
                            }
                            setupTextElements(textElements);
                            setupSelectElements(selectElements);
                        }
                    }
                }
            }
            notifyListeners();
        }
        function mountEventListener(node, event, listener) {
            node.addEventListener(event, listener);
            eventListeners.push({ node, event, listener });
        }
        function handleAutofill(textElement, formControl) {
            // Chrome sometimes fills the input visually without actually writing a value to it, this combats it
            handleChromeAutofill(textElement, formControl, notifyListeners);
            // If the browser writes a value without triggering an event
            function handleNoEventAutofilling() {
                if (textElement.value !== formControl.initial) {
                    handleBlurOrClick({ target: textElement });
                    return true;
                }
                return false;
            }
            const autofillingWithoutEventInstantly = handleNoEventAutofilling();
            // In a SPA App the form is sometimes not filled instantly so we wait 100ms
            if (!autofillingWithoutEventInstantly)
                setTimeout(() => handleNoEventAutofilling(), 100);
        }
        function handleInput({ target: node }) {
            if (isFormMember(node)) {
                const name = node["name"];
                let value;
                if (node.type === "checkbox" && node instanceof HTMLInputElement) {
                    value = node.checked ? "checked" : "";
                }
                else {
                    value = node.value;
                }
                state[name].value = value;
                notifyListeners();
            }
        }
        function handleBlurOrClick({ target: node }) {
            if (isFormMember(node)) {
                const control = state[node.name];
                if (!control.touched)
                    handleInput({ target: node });
                control.touched = true;
                node.classList.add("touched");
                notifyListeners();
            }
        }
        function hideNotRepresentedFormControls(nodes) {
            for (const key of Object.keys(properties)) {
                let isFormControlRepresentedInDom = false;
                for (const node of nodes) {
                    if (key === node["name"])
                        isFormControlRepresentedInDom = true;
                }
                if (!isFormControlRepresentedInDom)
                    delete state[key];
            }
        }
        function setInitialValue(formMember, formControl) {
            if (formControl.initial)
                formMember.value = formControl.initial;
        }
        function unmountEventListeners() {
            for (const { node, event, listener } of eventListeners) {
                node.removeEventListener(event, listener);
            }
        }
        function notifyListeners() {
            for (const callback of subscribers)
                callback(state);
        }
        function subscribe(callback) {
            subscribers.push(callback);
            callback(state);
            return { unsubscribe: () => unsubscribe(callback) };
        }
        function unsubscribe(subscriber) {
            const index = subscribers.indexOf(subscriber);
            subscribers.splice(index, 1);
        }
        function set(value) {
            state = value;
            notifyListeners();
        }
        return action;
    }

    /**
     * Add validators to form control
     * ``` svelte
     * <input name="nameOfInput" use:validators={[required, minLength(5), maxLength(20)]} />
     * ```
     */
    function validators(node, validators) {
        setupValidation();
        async function setupValidation() {
            const formElement = node.form;
            await tick();
            const formReference = get_store_value(formReferences).find((form) => form.node === formElement);
            const formControl = formReference.form[node.name];
            formControl.validators.push(...validators);
            formControl.validate();
            formReference.notifyListeners();
        }
    }

    function required(value) {
        return value.trim() ? null : { required: "Required" };
    }

    /* components/Login.svelte generated by Svelte v3.49.0 */

    const { console: console_1$2 } = globals;
    const file$5 = "components/Login.svelte";

    // (50:0) {:else}
    function create_else_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Logout";
    			add_location(button, file$5, 50, 0, 1413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*logout*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(50:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:0) {#if $login_store == null}
    function create_if_block$1(ctx) {
    	let form_1;
    	let h10;
    	let t1;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let hint0;
    	let t5;
    	let br;
    	let t6;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let hint1;
    	let t10;
    	let button0;
    	let t11;
    	let button0_disabled_value;
    	let t12;
    	let h11;
    	let t14;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	hint0 = new Hint({
    			props: {
    				for: "username",
    				on: "required",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	hint1 = new Hint({
    			props: {
    				for: "password",
    				on: "required",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form_1 = element("form");
    			h10 = element("h1");
    			h10.textContent = "Login";
    			t1 = space();
    			label0 = element("label");
    			label0.textContent = "Username";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			create_component(hint0.$$.fragment);
    			t5 = space();
    			br = element("br");
    			t6 = space();
    			label1 = element("label");
    			label1.textContent = "Password";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			create_component(hint1.$$.fragment);
    			t10 = space();
    			button0 = element("button");
    			t11 = text("Login");
    			t12 = space();
    			h11 = element("h1");
    			h11.textContent = "No account?";
    			t14 = space();
    			button1 = element("button");
    			button1.textContent = "Sign up";
    			add_location(h10, file$5, 32, 4, 823);
    			add_location(label0, file$5, 33, 4, 842);
    			attr_dev(input0, "name", "username");
    			add_location(input0, file$5, 34, 4, 870);
    			add_location(br, file$5, 38, 4, 1032);
    			add_location(label1, file$5, 39, 4, 1041);
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "type", "password");
    			add_location(input1, file$5, 40, 4, 1069);
    			attr_dev(button0, "type", "submit");
    			button0.disabled = button0_disabled_value = !/*$form*/ ctx[3].valid;
    			add_location(button0, file$5, 44, 4, 1246);
    			add_location(h11, file$5, 45, 4, 1328);
    			add_location(button1, file$5, 46, 4, 1353);
    			add_location(form_1, file$5, 31, 0, 770);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, h10);
    			append_dev(form_1, t1);
    			append_dev(form_1, label0);
    			append_dev(form_1, t3);
    			append_dev(form_1, input0);
    			set_input_value(input0, /*username*/ ctx[0]);
    			append_dev(form_1, t4);
    			mount_component(hint0, form_1, null);
    			append_dev(form_1, t5);
    			append_dev(form_1, br);
    			append_dev(form_1, t6);
    			append_dev(form_1, label1);
    			append_dev(form_1, t8);
    			append_dev(form_1, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(form_1, t9);
    			mount_component(hint1, form_1, null);
    			append_dev(form_1, t10);
    			append_dev(form_1, button0);
    			append_dev(button0, t11);
    			append_dev(form_1, t12);
    			append_dev(form_1, h11);
    			append_dev(form_1, t14);
    			append_dev(form_1, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[8]),
    					action_destroyer(validators.call(null, input0, [required])),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[9]),
    					action_destroyer(validators.call(null, input1, [required])),
    					listen_dev(button0, "click", /*login*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*signup*/ ctx[7], false, false, false),
    					action_destroyer(/*form*/ ctx[4].call(null, form_1)),
    					listen_dev(form_1, "submit", prevent_default(/*login*/ ctx[5]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
    				set_input_value(input0, /*username*/ ctx[0]);
    			}

    			const hint0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				hint0_changes.$$scope = { dirty, ctx };
    			}

    			hint0.$set(hint0_changes);

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			const hint1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				hint1_changes.$$scope = { dirty, ctx };
    			}

    			hint1.$set(hint1_changes);

    			if (!current || dirty & /*$form*/ 8 && button0_disabled_value !== (button0_disabled_value = !/*$form*/ ctx[3].valid)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hint0.$$.fragment, local);
    			transition_in(hint1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hint0.$$.fragment, local);
    			transition_out(hint1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form_1);
    			destroy_component(hint0);
    			destroy_component(hint1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(31:0) {#if $login_store == null}",
    		ctx
    	});

    	return block;
    }

    // (36:4) <Hint for='username' on='required'>
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("This field is required");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(36:4) <Hint for='username' on='required'>",
    		ctx
    	});

    	return block;
    }

    // (42:4) <Hint for='password' on='required'>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("This field is required");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(42:4) <Hint for='password' on='required'>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$login_store*/ ctx[2] == null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $login_store;
    	let $form;
    	validate_store(login_store, 'login_store');
    	component_subscribe($$self, login_store, $$value => $$invalidate(2, $login_store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	const form = useForm();
    	validate_store(form, 'form');
    	component_subscribe($$self, form, value => $$invalidate(3, $form = value));
    	let username = '';
    	let password = '';
    	let error = '';

    	function login() {
    		const user = database.find(u => u.username === username && u.password === password);

    		if (user) {
    			set_store_value(login_store, $login_store = user, $login_store);
    			console.log(JSON.stringify($login_store, null, 2));
    			if (error) error = '';
    			push$1('/');
    		} else {
    			error = 'No matching username and password';
    			alert(error);
    		}
    	}

    	function logout() {
    		set_store_value(login_store, $login_store = null, $login_store);
    	}

    	function signup() {
    		push$1('/Signup');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(0, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		push: push$1,
    		useForm,
    		validators,
    		Hint,
    		required,
    		login_store,
    		database,
    		form,
    		username,
    		password,
    		error,
    		login,
    		logout,
    		signup,
    		$login_store,
    		$form
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('error' in $$props) error = $$props.error;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		username,
    		password,
    		$login_store,
    		$form,
    		form,
    		login,
    		logout,
    		signup,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* components/Signup.svelte generated by Svelte v3.49.0 */

    const { console: console_1$1 } = globals;
    const file$4 = "components/Signup.svelte";

    // (30:4) <Hint for='username' on='required'>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("This field is required");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(30:4) <Hint for='username' on='required'>",
    		ctx
    	});

    	return block;
    }

    // (36:4) <Hint for='password' on='required'>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("This field is required");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(36:4) <Hint for='password' on='required'>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let form_1;
    	let h1;
    	let t1;
    	let label0;
    	let t3;
    	let input0;
    	let t4;
    	let hint0;
    	let t5;
    	let br;
    	let t6;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let hint1;
    	let t10;
    	let button;
    	let t11;
    	let button_disabled_value;
    	let current;
    	let mounted;
    	let dispose;

    	hint0 = new Hint({
    			props: {
    				for: "username",
    				on: "required",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	hint1 = new Hint({
    			props: {
    				for: "password",
    				on: "required",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form_1 = element("form");
    			h1 = element("h1");
    			h1.textContent = "Signup";
    			t1 = space();
    			label0 = element("label");
    			label0.textContent = "Username";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			create_component(hint0.$$.fragment);
    			t5 = space();
    			br = element("br");
    			t6 = space();
    			label1 = element("label");
    			label1.textContent = "Password";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			create_component(hint1.$$.fragment);
    			t10 = space();
    			button = element("button");
    			t11 = text("Signup");
    			add_location(h1, file$4, 26, 4, 697);
    			add_location(label0, file$4, 27, 4, 717);
    			attr_dev(input0, "name", "username");
    			add_location(input0, file$4, 28, 4, 745);
    			add_location(br, file$4, 32, 4, 907);
    			add_location(label1, file$4, 33, 4, 916);
    			attr_dev(input1, "name", "password");
    			attr_dev(input1, "type", "password");
    			add_location(input1, file$4, 34, 4, 944);
    			attr_dev(button, "type", "submit");
    			button.disabled = button_disabled_value = !/*$form*/ ctx[2].valid;
    			add_location(button, file$4, 38, 4, 1121);
    			add_location(form_1, file$4, 25, 0, 643);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form_1, anchor);
    			append_dev(form_1, h1);
    			append_dev(form_1, t1);
    			append_dev(form_1, label0);
    			append_dev(form_1, t3);
    			append_dev(form_1, input0);
    			set_input_value(input0, /*username*/ ctx[0]);
    			append_dev(form_1, t4);
    			mount_component(hint0, form_1, null);
    			append_dev(form_1, t5);
    			append_dev(form_1, br);
    			append_dev(form_1, t6);
    			append_dev(form_1, label1);
    			append_dev(form_1, t8);
    			append_dev(form_1, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(form_1, t9);
    			mount_component(hint1, form_1, null);
    			append_dev(form_1, t10);
    			append_dev(form_1, button);
    			append_dev(button, t11);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					action_destroyer(validators.call(null, input0, [required])),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					action_destroyer(validators.call(null, input1, [required])),
    					listen_dev(button, "click", /*signup*/ ctx[4], false, false, false),
    					action_destroyer(/*form*/ ctx[3].call(null, form_1)),
    					listen_dev(form_1, "submit", prevent_default(/*signup*/ ctx[4]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*username*/ 1 && input0.value !== /*username*/ ctx[0]) {
    				set_input_value(input0, /*username*/ ctx[0]);
    			}

    			const hint0_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				hint0_changes.$$scope = { dirty, ctx };
    			}

    			hint0.$set(hint0_changes);

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			const hint1_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				hint1_changes.$$scope = { dirty, ctx };
    			}

    			hint1.$set(hint1_changes);

    			if (!current || dirty & /*$form*/ 4 && button_disabled_value !== (button_disabled_value = !/*$form*/ ctx[2].valid)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hint0.$$.fragment, local);
    			transition_in(hint1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hint0.$$.fragment, local);
    			transition_out(hint1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form_1);
    			destroy_component(hint0);
    			destroy_component(hint1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $login_store;
    	let $form;
    	validate_store(login_store, 'login_store');
    	component_subscribe($$self, login_store, $$value => $$invalidate(8, $login_store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Signup', slots, []);
    	const form = useForm();
    	validate_store(form, 'form');
    	component_subscribe($$self, form, value => $$invalidate(2, $form = value));
    	let username = '';
    	let password = '';
    	let error = '';

    	function signup() {
    		const user = database.find(u => u.username === username && u.password === password);

    		if (!user) {
    			set_store_value(login_store, $login_store = user, $login_store);
    			console.log(JSON.stringify($login_store, null, 2));
    			if (error) error = '';
    			push$1('/');
    		} else {
    			error = 'Username unavailable';
    			alert(error);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Signup> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate(0, username);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		push: push$1,
    		useForm,
    		validators,
    		Hint,
    		required,
    		login_store,
    		database,
    		form,
    		username,
    		password,
    		error,
    		signup,
    		$login_store,
    		$form
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('error' in $$props) error = $$props.error;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		username,
    		password,
    		$form,
    		form,
    		signup,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    //----------------------------------------------------------------------------//
    //                        locally unique Id Generator                         //
    //----------------------------------------------------------------------------//
    var IdCounter = 0; // hidden in the closure of "nextId"
    function nextId() {
        return ++IdCounter;
    }
    /**** make global.nextId a real singleton ****/
    var global$1 = /*#__PURE__*/ Function('return this')();
    // see https://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript
    if (typeof global$1.__nextId !== 'function') {
        global$1.__nextId = nextId;
    }

    class Game$1 {
        constructor(size) {
            this.board = new Array(size)
                .fill("VACANT")
                .map(() => new Array(size).fill("VACANT"));
            this.turn = "BLACK";
            this.size = size;
            this.gameover = false;
            this.history = [];
        }
        checkWin(coord) {
            // checks for a streak of exactly 5, using row column and diagonals of last move's coordinates
            function streakLength(turn, array) {
                let streak = 0;
                let record = 0;
                for (let i = 0; i < array.length; i++) {
                    if (array[i] === turn) {
                        streak = streak + 1;
                    }
                    if (streak > record) {
                        record = streak;
                    }
                    if (array[i] !== turn) {
                        streak = 0;
                    }
                }
                return record;
            }
            let column = this.board.map(function (value, index) { return value[coord.y]; });
            let row = this.board[coord.x];
            let diag_tl_br = [this.board[coord.x][coord.y]]; // generate diagonal top left to bottom right
            for (let x = coord.x + 1, y = coord.y + 1; x < this.size && y < this.size; x++, y++) {
                diag_tl_br.push(this.board[x][y]); // append bottom right
            }
            for (let x = coord.x - 1, y = coord.y - 1; x >= 0 && y >= 0; x--, y--) {
                diag_tl_br.unshift(this.board[x][y]); // prepend top left
            }
            let diag_bl_tr = [this.board[coord.x][coord.y]]; // generate diagonal bottom left to top right
            for (let x = coord.x + 1, y = coord.y - 1; x < this.size && y >= 0; x++, y--) {
                diag_bl_tr.push(this.board[x][y]); //append top right
            }
            for (let x = coord.x - 1, y = coord.y + 1; x >= 0 && y < this.size; x--, y++) {
                diag_bl_tr.unshift(this.board[x][y]); //prepend bottom left
            }
            if (streakLength(this.turn, column) === 5) {
                this.gameover = true;
            }
            else if (streakLength(this.turn, row) === 5) {
                this.gameover = true;
            }
            else if (streakLength(this.turn, diag_bl_tr) === 5) {
                this.gameover = true;
            }
            else if (streakLength(this.turn, diag_tl_br) === 5) {
                this.gameover = true;
            }
        }
        placeTile(x, y) {
            this.board[x][y] = this.turn;
            const now = new Date();
            this.history.push({ date: now, board: this.board });
            console.log(this.history);
        }
        toggleTurn() {
            if (this.turn === "BLACK") {
                this.turn = "WHITE";
            }
            else {
                this.turn = "BLACK";
            }
        }
    }
    class GameCanvas {
        constructor(game_size = 10, canvas) {
            this.game_size = game_size;
            this.game = new Game$1(this.game_size);
            this.game_state = this.game.turn + "'S TURN'";
            this.updateGameState();
            this.canvas = canvas;
            this.canvas.width = 800;
            this.canvas.height = 800;
            this.tile_size = this.canvas.getBoundingClientRect().width / this.game_size;
            this.ctx = this.canvas.getContext("2d");
            this.canvas.addEventListener('click', event => {
                const coord = this.getTileXY(event);
                if (this.game.board[coord.x][coord.y] === 'VACANT' && this.game.gameover === false) {
                    this.game.placeTile(coord.x, coord.y);
                    this.drawPiece(this.getTileCentre(coord), this.game.turn);
                    this.game.checkWin(coord);
                    if (this.game.gameover === false) {
                        this.game.toggleTurn();
                    }
                    this.updateGameState();
                }
            }, false);
            this.drawBoard();
        }
        updateTileSize() {
            this.tile_size = (this.canvas.getBoundingClientRect().right - this.canvas.getBoundingClientRect().left) / this.game_size;
        }
        updateGameState() {
            if (this.game.board.some(row => row.includes("VACANT")) === false) {
                this.game_state = "GAME OVER - DRAW";
            }
            else if (this.game.gameover === false) {
                this.game_state = this.game.turn + "'S TURN";
            }
            else {
                this.game_state = "GAME OVER - " + this.game.turn + " WINS";
            }
            gamestate_store.set(this.game_state);
        }
        drawBoard() {
            for (let i = 0; i < this.canvas.width; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(i * this.tile_size, 0);
                this.ctx.lineTo(i * this.tile_size, this.canvas.width);
                this.ctx.stroke();
                this.ctx.moveTo(0, i * this.tile_size);
                this.ctx.lineTo(this.canvas.width, i * this.tile_size);
                this.ctx.stroke();
            }
        }
        getTileCentre(coord) {
            const canvasX = (this.tile_size * coord.x) + (this.tile_size / 2);
            const canvasY = (this.tile_size * coord.y) + (this.tile_size / 2);
            const canvas_coord = { x: canvasX, y: canvasY };
            return (canvas_coord);
        }
        getTileXY(event) {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((event.clientX - rect.left) / this.tile_size);
            const y = Math.floor((event.clientY - rect.top) / this.tile_size);
            const coord = { x: x, y: y };
            return coord;
        }
        drawPiece(coord, turn) {
            this.ctx.beginPath();
            this.ctx.arc(coord.x, coord.y, this.tile_size * 0.45, 0, 2 * Math.PI);
            this.ctx.fillStyle = turn.toLowerCase();
            this.ctx.fill();
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke();
        }
        resetGame() {
            this.game = new Game$1(this.game_size);
            this.game.turn = "BLACK";
            this.game.gameover = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.updateTileSize();
            this.drawBoard();
            this.updateGameState();
        }
    }
    //let newgame_button = <HTMLButtonElement>document.getElementById('btn_new_game')
    //let game_size_input = <HTMLInputElement>document.getElementById('inp_board_size')
    //let gc = new GameCanvas(parseInt(game_size_input.value))
    //newgame_button.addEventListener('click', function handleClick(){
    //gc.game_size = parseInt(game_size_input.value)
    //gc.resetGame()
    //})

    /* components/Game.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file$3 = "components/Game.svelte";

    function create_fragment$3(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let canvas;
    	let t2;
    	let div;
    	let button0;
    	let t4;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(/*$gamestate_store*/ ctx[1]);
    			t1 = space();
    			canvas = element("canvas");
    			t2 = space();
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Restart";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Leave";
    			add_location(h1, file$3, 27, 0, 775);
    			add_location(canvas, file$3, 28, 0, 803);
    			add_location(button0, file$3, 30, 0, 845);
    			add_location(button1, file$3, 31, 0, 889);
    			add_location(div, file$3, 29, 0, 839);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, canvas, anchor);
    			/*canvas_binding*/ ctx[4](canvas);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t4);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*restart*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*leave*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$gamestate_store*/ 2) set_data_dev(t0, /*$gamestate_store*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(canvas);
    			/*canvas_binding*/ ctx[4](null);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $login_store;
    	let $gamestate_store;
    	let $gamehistory_store;
    	let $gamesize_store;
    	validate_store(login_store, 'login_store');
    	component_subscribe($$self, login_store, $$value => $$invalidate(6, $login_store = $$value));
    	validate_store(gamestate_store, 'gamestate_store');
    	component_subscribe($$self, gamestate_store, $$value => $$invalidate(1, $gamestate_store = $$value));
    	validate_store(gamehistory_store, 'gamehistory_store');
    	component_subscribe($$self, gamehistory_store, $$value => $$invalidate(7, $gamehistory_store = $$value));
    	validate_store(gamesize_store, 'gamesize_store');
    	component_subscribe($$self, gamesize_store, $$value => $$invalidate(8, $gamesize_store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Game', slots, []);
    	let canvasElement;
    	let gc;

    	onMount(() => {
    		gc = new GameCanvas($gamesize_store, canvasElement);
    	});

    	function restart() {
    		console.log('restarting');
    		gc.resetGame();
    	}

    	function leave() {
    		if (gc.game.gameover == false) {
    			push$1('/');
    		} else {
    			$gamehistory_store.push({
    				history: gc.game.history,
    				outcome: $gamestate_store,
    				date: gc.game.history.at(-1).date,
    				user: $login_store.username
    			});

    			push$1('/games');
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Game> was created with unknown prop '${key}'`);
    	});

    	function canvas_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvasElement = $$value;
    			$$invalidate(0, canvasElement);
    		});
    	}

    	$$self.$capture_state = () => ({
    		login_store,
    		gamesize_store,
    		gamestate_store,
    		gamehistory_store,
    		GameCanvas,
    		onMount,
    		push: push$1,
    		canvasElement,
    		gc,
    		restart,
    		leave,
    		$login_store,
    		$gamestate_store,
    		$gamehistory_store,
    		$gamesize_store
    	});

    	$$self.$inject_state = $$props => {
    		if ('canvasElement' in $$props) $$invalidate(0, canvasElement = $$props.canvasElement);
    		if ('gc' in $$props) gc = $$props.gc;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [canvasElement, $gamestate_store, restart, leave, canvas_binding];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* components/Games.svelte generated by Svelte v3.49.0 */
    const file$2 = "components/Games.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (12:0) {#each $gamehistory_store as item}
    function create_each_block(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*item*/ ctx[2].id + "";
    	let t1;
    	let t2;
    	let t3_value = /*item*/ ctx[2].date + "";
    	let t3;
    	let t4;
    	let t5_value = /*item*/ ctx[2].outcome + "";
    	let t5;
    	let t6;
    	let button;
    	let t8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Game ");
    			t1 = text(t1_value);
    			t2 = text(" @ ");
    			t3 = text(t3_value);
    			t4 = space();
    			t5 = text(t5_value);
    			t6 = space();
    			button = element("button");
    			button.textContent = "View game log";
    			t8 = space();
    			add_location(button, file$2, 15, 4, 322);
    			attr_dev(p, "class", "svelte-eb72t1");
    			add_location(p, file$2, 12, 4, 261);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(p, t6);
    			append_dev(p, button);
    			append_dev(p, t8);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*view*/ ctx[1](/*item*/ ctx[2].id))) /*view*/ ctx[1](/*item*/ ctx[2].id).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$gamehistory_store*/ 1 && t1_value !== (t1_value = /*item*/ ctx[2].id + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$gamehistory_store*/ 1 && t3_value !== (t3_value = /*item*/ ctx[2].date + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*$gamehistory_store*/ 1 && t5_value !== (t5_value = /*item*/ ctx[2].outcome + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(12:0) {#each $gamehistory_store as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let h1;
    	let t1;
    	let each_1_anchor;
    	let each_value = /*$gamehistory_store*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Games";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			add_location(h1, file$2, 9, 0, 206);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*view, $gamehistory_store*/ 3) {
    				each_value = /*$gamehistory_store*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $gamehistory_store;
    	validate_store(gamehistory_store, 'gamehistory_store');
    	component_subscribe($$self, gamehistory_store, $$value => $$invalidate(0, $gamehistory_store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Games', slots, []);

    	function view(id) {
    		push$1('/GameLog/');
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Games> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		login_store,
    		gamehistory_store,
    		database,
    		link,
    		push: push$1,
    		pop,
    		replace,
    		view,
    		$gamehistory_store
    	});

    	return [$gamehistory_store, view];
    }

    class Games extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Games",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* components/GameLog.svelte generated by Svelte v3.49.0 */
    const file$1 = "components/GameLog.svelte";

    function create_fragment$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Back";
    			add_location(button, file$1, 8, 0, 136);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", back, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function back() {
    	push('/games');
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameLog', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameLog> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		login_store,
    		gamehistory_store,
    		database,
    		back
    	});

    	return [];
    }

    class GameLog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameLog",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.49.0 */
    const file = "src/App.svelte";

    // (68:1) {#if $login_store == null}
    function create_if_block_1(ctx) {
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "Login";
    			attr_dev(a, "href", "/Login");
    			add_location(a, file, 68, 1, 1797);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(68:1) {#if $login_store == null}",
    		ctx
    	});

    	return block;
    }

    // (72:1) {#if $login_store != null}
    function create_if_block(ctx) {
    	let h3;
    	let t0;
    	let t1_value = /*$login_store*/ ctx[0].username + "";
    	let t1;
    	let t2;
    	let a0;
    	let t4;
    	let t5;
    	let a1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t0 = text("logged in as ");
    			t1 = text(t1_value);
    			t2 = text(" (");
    			a0 = element("a");
    			a0.textContent = "logout";
    			t4 = text(")");
    			t5 = space();
    			a1 = element("a");
    			a1.textContent = "Previous Games";
    			attr_dev(a0, "href", "/Login");
    			add_location(a0, file, 72, 45, 1919);
    			add_location(h3, file, 72, 2, 1876);
    			attr_dev(a1, "href", "/Games");
    			add_location(a1, file, 73, 2, 1964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    			append_dev(h3, a0);
    			append_dev(h3, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, a1, anchor);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$login_store*/ 1 && t1_value !== (t1_value = /*$login_store*/ ctx[0].username + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(a1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(72:1) {#if $login_store != null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let nav;
    	let h1;
    	let a;
    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let t4;
    	let router;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$login_store*/ ctx[0] == null && create_if_block_1(ctx);
    	let if_block1 = /*$login_store*/ ctx[0] != null && create_if_block(ctx);

    	router = new Router({
    			props: { routes: /*routes*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			h1 = element("h1");
    			a = element("a");
    			a.textContent = "Gomoku";
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			br = element("br");
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			create_component(router.$$.fragment);
    			attr_dev(a, "href", "/");
    			add_location(a, file, 66, 5, 1731);
    			attr_dev(h1, "class", "svelte-1tky8bj");
    			add_location(h1, file, 66, 1, 1727);
    			add_location(br, file, 70, 1, 1841);
    			add_location(nav, file, 65, 0, 1720);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, h1);
    			append_dev(h1, a);
    			append_dev(nav, t1);
    			if (if_block0) if_block0.m(nav, null);
    			append_dev(nav, t2);
    			append_dev(nav, br);
    			append_dev(nav, t3);
    			if (if_block1) if_block1.m(nav, null);
    			insert_dev(target, t4, anchor);
    			mount_component(router, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$login_store*/ ctx[0] == null) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(nav, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$login_store*/ ctx[0] != null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(nav, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t4);
    			destroy_component(router, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $login_store;
    	validate_store(login_store, 'login_store');
    	component_subscribe($$self, login_store, $$value => $$invalidate(0, $login_store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;

    	const routes = {
    		'/': wrap$1({
    			component: Home,
    			conditions: [
    				detail => {
    					return true;
    				}
    			]
    		}),
    		'/Login': wrap$1({
    			component: Login,
    			conditions: [
    				detail => {
    					return true;
    				}
    			]
    		}),
    		'/Signup': wrap$1({
    			component: Signup,
    			conditions: [
    				detail => {
    					return true;
    				}
    			]
    		}),
    		'/Game': wrap$1({
    			component: Game,
    			conditions: [
    				detail => {
    					if ($login_store == null) {
    						return false;
    					} else {
    						return true;
    					}
    				}
    			]
    		}),
    		'/Games': wrap$1({
    			component: Games,
    			conditions: [
    				detail => {
    					if ($login_store == null) {
    						return false;
    					} else {
    						return true;
    					}
    				}
    			]
    		}),
    		'/GameLog:id': wrap$1({
    			component: GameLog,
    			conditions: [
    				detail => {
    					if ($login_store == null) {
    						return false;
    					} else {
    						return true;
    					}
    				}
    			]
    		})
    	};

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		Router,
    		link,
    		wrap: wrap$1,
    		Home,
    		Login,
    		Signup,
    		Game,
    		Games,
    		GameLog,
    		login_store,
    		routes,
    		$login_store
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$login_store, routes, name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[2] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

})();
//# sourceMappingURL=bundle.js.map
