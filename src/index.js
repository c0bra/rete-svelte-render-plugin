import Node from './Node.svelte';
import Socket from './Socket.svelte';

// options = {}
function createSvelte(el, SvelteComponent, props) {
    const nodeEl = document.createElement('div');

    const app = new SvelteComponent({
        target: nodeEl,
        props
    });

    el.appendChild(nodeEl);

    return app;
}

function createNode(editor, CommonSvelteComponent, { el, node, component, bindSocket, bindControl }, options) {
    const svelteComponent = component.component || CommonSvelteComponent || Node;
    const svelteProps = { ...component.props, node, editor, bindSocket, bindControl };
    const app = createSvelte(el, svelteComponent, svelteProps, options);

    node.svelteContext = app;

    return app;
}

function createControl(editor, { el, control }, options) {
    const svelteComponent = control.component;
    const svelteProps = {
        ...control.props,
        getData: control.getData.bind(control),
        putData: control.putData.bind(control)
    };
    const app = createSvelte(el, svelteComponent, svelteProps, options);

    control.svelteContext = app.$children[0];

    return app;
}

const update = entity => {
    return new Promise(res => {
        if (!entity.svelteContext) return res();

        // entity.svelteContext.$forceUpdate();
        // entity.svelteContext.$nextTick(res);
    });
};

function install(editor, { component: CommonSvelteComponent, options }) {
    editor.on('rendernode', ({ el, node, component, bindSocket, bindControl }) => {
        if (component.render && component.render !== 'svelte') return;

        node._svelte = createNode(
            editor,
            CommonSvelteComponent,
            { el, node, component, bindSocket, bindControl },
            options
        );

        node.update = async () => await update(node);
    });

    editor.on('rendercontrol', ({ el, control }) => {
        if (control.render && control.render !== 'svelte') return;

        control._svelte = createControl(editor, { el, control }, options);

        control.update = async () => await update(control);
    });

    editor.on('connectioncreated connectionremoved', connection => {
        update(connection.output.node);
        update(connection.input.node);
    });

    editor.on('nodeselected', () => {
        editor.nodes.map(update);
    });
}

export default {
    name: 'rete-svelte-render',
    install,
    Node,
    Socket
};
