<script>
    import { onMount } from 'svelte';
    import { kebab } from './util';

    export let socket;
    export let type;
    export let bindSocket;
    export let withControl;

    export let output = null;
    export let input = null;

    let el;

    onMount(() => {
        bindSocket(el, type, type === 'output' ? output : input);
    });

    $: {
        if (el) bindSocket(el, type, type === 'output' ? output : input);
    }
</script>

<style lang="sass" scoped>
    @import './vars';

    .socket {
        display: inline-block;
        cursor: pointer;
        border: 1px solid white;
        border-radius: $socket-size/2.0;
        width: $socket-size;
        height: $socket-size;
        margin: $socket-margin;
        vertical-align: middle;
        background: $socket-color;
        z-index: 2;
        box-sizing: border-box;

        &:hover {
            border-width: 4px;
        }

        &.multiple {
            border-color: yellow;
        }

        &.output {
            margin-right: -$socket-size / 2;
        }

        &.input {
            margin-left: -$socket-size / 2;
        }
    }
</style>

<div bind:this={el} class="socket {kebab(type)} {kebab(socket.name)}" title={socket.name} />
