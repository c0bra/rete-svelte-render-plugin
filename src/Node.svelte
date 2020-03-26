<script>
    import Control from './Control.svelte';
    import Socket from './Socket.svelte';

    export let editor;
    export let node;
    export let bindSocket;
    export let bindControl;

    $: outputs = Array.from(node.outputs.values());
    $: inputs = Array.from(node.inputs.values());
    $: controls = Array.from(node.controls.values());
    $: selected = editor.selected.contains(node) ? 'selected' : '';

    $: {
        console.log('inputs', inputs);
    }
</script>

<style lang="sass" scoped>
    @import './vars';

    .node {
        background: $node-color;
        border: 2px solid #4e58bf;
        border-radius: 10px;
        cursor: pointer;
        min-width: $node-width;
        height: auto;
        padding-bottom: 6px;
        box-sizing: content-box;
        position: relative;
        user-select: none;

        &:hover {
            background: lighten($node-color, 4%);
        }

        &.selected {
            background: $node-color-selected;
            border-color: #e3c000;
        }

        .title {
            color: white;
            font-family: sans-serif;
            font-size: 18px;
            padding: 8px;
        }

        .output {
            text-align: right;
        }

        .input {
            text-align: left;
        }

        .input-title,
        .output-title {
            vertical-align: middle;
            color: white;
            display: inline-block;
            font-family: sans-serif;
            font-size: 14px;
            margin: $socket-margin;
            line-height: $socket-size;
        }

        .input-control {
            z-index: 1;
            width: calc(100% - #{$socket-size + 2 * $socket-margin});
            vertical-align: middle;
            display: inline-block;
        }

        .control {
            padding: $socket-margin $socket-size/2 + $socket-margin;
        }
    }
</style>

<div class="node {node.name}" class:selected>
    <div class="title">{node.name}</div>

    <!-- Outputs -->
    {#each outputs as output, index (output.key)}
        <div class="output">
            <div class="output-title">{output.name}</div>
            <Socket bind:socket={output.socket} {output} {bindSocket} type="output" />
        </div>
    {/each}

    <!-- Controls -->
    {#each controls as control}
        <Control {control} class="control" />
    {/each}

    <!-- Inputs -->
    {#each inputs as input, index (input.key)}
        <div class="input">
            <Socket bind:socket={input.socket} {input} {bindSocket} type="input" />
            {#if !input.showControl()}
                <div class="input-title">{input.name}</div>
            {/if}
            {#if input.showControl}
                <Control bind:control={input.control} {bindControl} class="input-control" />
            {/if}
        </div>
    {/each}
</div>
