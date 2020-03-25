<script>
    import { onMount } from 'svelte';

    export let control;
    export let bindControl;

    let el;

    onMount(() => {
        bindControl(el, control);
    });

    $: {
        if (el) bindControl(el, control);
    }
</script>

<div bind:this={el} />
