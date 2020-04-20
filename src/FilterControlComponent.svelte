<script>
    import { getContext, onMount, onDestroy } from 'svelte';

    const filter = getContext('filter')

    export let key;
    export let control;
    let el;

    function change($event) {
        const { value } = $event.target

        filter.set(value)
    }

    onDestroy(() => {});
</script>

<style lang="sass">
    @import './vars';

    .control {
        padding: $socket-margin $socket-size/2 + $socket-margin;
    }

    .filter {
        text-align: center;
    }
</style>

<svelte:options accessors={true} />

<div class="control filter">
    <input bind:this={el} on:input={change} title="Filter..." placeholder="Filter..." />
</div>
