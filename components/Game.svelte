<script lang="ts">
import { login_store , gamesize_store, gamestate_store, gamehistory_store, database } from '../src/stores';
import NewUniqueId from 'locally-unique-id-generator'
import { Game, GameCanvas } from '../src/gomoku'
import { onMount } from 'svelte';
import { link, push, pop, replace } from 'svelte-spa-router';
let canvasElement: HTMLCanvasElement
let gc: GameCanvas


onMount( () => {
    gc = new GameCanvas($gamesize_store, canvasElement)
 });

function restart(){
     console.log('restarting')
     gc.resetGame()
 }
 function leave(){
     if (gc.game.gameover == false) {
         push('/')
     } else {
         $gamehistory_store.push({history: gc.game.history,
                                 outcome: $gamestate_store,
                                date: gc.game.history.at(-1).date,
                                 user: $login_store.username} )
         push('/games')
     }
 }

</script>
<h1>{$gamestate_store}</h1>
<canvas bind:this={canvasElement}/>
<div>
<button on:click={restart}>Restart</button>
<button on:click={leave}>Leave</button>
</div>
