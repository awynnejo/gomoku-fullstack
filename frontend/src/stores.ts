
import { writable } from 'svelte/store';


// Create store for user
export const login_store = writable(null);

// Create store to pass game size
export const gamesize_store = writable(null);

// Create store to store game state
export const gamestate_store = writable(null);

// Create store for game
export const game_store = writable(null);
// Create store for game history
export const gamehistory_store = writable([]);

export const database = [
     {
        username: 'admin',
        password: 'admin'
     }
 ]
