<script>
    import { onMount, onDestroy, tick } from 'svelte';

    export let control;
    export let controlType = 'control';
    export let emitter;
    export let key;
    export let label;
    export let type = 'text';
    export let getData;
    export let putData;
    export let value;

    let el;
    let connections = control.parent.connections;

    $: inputPlaceholder = connections.length === 0 ? 'Static value' : 'Default value';

    function change($event) {
        if (key) putData(key, $event.target.value);

        emitter.trigger('process');
    }

    onMount(() => {
        emitter.on('connectioncreated connectionremoved', connection => {
            connections = control.parent.connections;
        });

        if (value) {
            tick().then(() => {
                el.value = value;
            });
        }
    });

    onDestroy(() => {});
</script>

<style lang="sass" scoped>
    @import './vars';

    .input-control {
        z-index: 1;
        width: calc(100% - #{$socket-size + 2 * $socket-margin});
        vertical-align: middle;
        display: inline-block;
    }

    .control {
        padding: $socket-margin $socket-size/2 + $socket-margin;
    }

    .defaultable {
        display: flex;
        flex-direction: column;
    }

    label {
        color: white;
        display: inline-block;
        font-family: sans-serif;
        font-size: 14px;
        line-height: 24px;
    }
</style>

<svelte:options accessors={true} />

<div class="{controlType} defaultable">
    {#if label}
        <label>{label}</label>
    {/if}

    <input {type} bind:this={el} on:input={change} title={inputPlaceholder} placeholder={inputPlaceholder} />
    <!-- {/if} -->
</div>
