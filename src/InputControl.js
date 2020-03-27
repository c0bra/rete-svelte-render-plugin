import Control from './Control.svelte';
import Rete from 'rete';

export default class extends Rete.Control {
    constructor(emitter, key, readonly) {
        this.render = 'svelte';
        this.component = Control;
        this.props = {
            emitter,
            key,
            readonly
        };
    }
}
