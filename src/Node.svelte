<script>
    import { setContext } from 'svelte'
    import { writable } from 'svelte/store';

    import ControlBinder from './ControlBinder.svelte';
    import Control from './Control.svelte';
    import Socket from './Socket.svelte';
    import { kebab } from './util';

    export let editor;
    export let node;
    export let bindSocket;
    export let bindControl;
    
    const filter = writable('') 
    setContext('filter', filter)

    let inputs = []

    const controlEls = [];

    filter.subscribe(f => {
        if (f) inputs = Array.from(node.inputs.values()).filter(x => x.name.indexOf(f) > -1)
        else inputs = Array.from(node.inputs.values())
    })

    $: outputs = Array.from(node.outputs.values());
    $: controls = Array.from(node.controls.values());
    $: selected = editor.selected.contains(node) ? 'selected' : '';
    $: customClass = node.data.class || ''
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
            display: flex;
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

<svelte:options accessors={true} />

<div class="node {kebab(node.name)} {customClass}" class:selected>
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
        <!-- <svelte:component this={control.component} {bindControl} controlType="control" /> -->
        <ControlBinder {bindControl} {control} />
    {/each}

    <!-- Inputs -->
    {#each inputs as input, index (input.key)}
        <div class="input">
            <Socket bind:socket={input.socket} {input} {bindSocket} type="input" withControl={input.showControl()} />
            {#if !input.showControl()}
                <div class="input-title">{input.name}</div>
            {:else}
                <!-- {#if input.showControl()} -->
                <!-- <svelte:component this={input.control.component} {bindControl} controlType="input-control" /> -->
                <ControlBinder {bindControl} control={input.control} />
            {/if}
        </div>
    {/each}
</div>
