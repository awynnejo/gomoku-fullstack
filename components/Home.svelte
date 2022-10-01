<script lang='ts'>
import { link, push, pop, replace } from 'svelte-spa-router';
import { login_store , gamesize_store, database } from '../src/stores';

let boardsize = 10

function start_game () {
    if ($login_store != null){
        $gamesize_store = boardsize
        push('/Game')
    } else {
        push('/Login')
    }
}
</script>

<h1>Welcome to gomoku</h1>

<form>
    <label for="inp_board_size">Select board size</label>
    <input type="number" id="inp_board_size" min="5" max="20" bind:value={boardsize}>
    <button type="submit" on:click={start_game}>Start Game!</button>
</form>
