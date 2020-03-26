<script>
    import { onMount } from 'svelte';

    export let control;
    export let bindControl;

    let el;

    onMount(() => {
        if (!control) return;

        bindControl(el, control);
    });

    $: {
        if (el && control) bindControl(el, control);
    }
</script>

<div bind:this={el} />
