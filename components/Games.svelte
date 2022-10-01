<script>
import { login_store , gamehistory_store , database } from '../src/stores';
import { link, push, pop, replace } from 'svelte-spa-router';
function view (id) {
     push('/GameLog/')

 }
</script>

<h1>Games</h1>

{#each $gamehistory_store as item}
    <p>
        Game {item.id} @ {item.date} {item.outcome}

    <button on:click={view(item.id)}>View game log</button>

    </p>
{/each}
<style>
    p {
    border-width:3px; border-style:solid; border-color:#000000; padding: 1em;
    }
</style>
