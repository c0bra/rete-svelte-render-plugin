<script>
    import { onMount } from 'svelte';

    export let bindControl;
    export let control;

    let el;

    onMount(() => {
        bindControl(el, control);
    });
</script>

<div bind:this={el} />
