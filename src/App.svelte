<script lang="ts">
	export let name: string;
 import Router, {location, link} from 'svelte-spa-router';
 import { wrap } from 'svelte-spa-router/wrap';
 import Home from '../components/Home.svelte'
 import Login from '../components/Login.svelte'
 import Signup from '../components/Signup.svelte'
 import Game from '../components/Game.svelte'
 import Games from '../components/Games.svelte'
 import GameLog from '../components/GameLog.svelte'
 import { login_store } from './stores'

 const routes: any = {
				'/': wrap({
					component: Home,
					conditions: [(detail) => {
						return true
					}]
					}),
				'/Login': wrap({
					component: Login,
					conditions: [(detail) => {
						return true
					}]
					}),
				'/Signup': wrap({
					component: Signup,
					conditions: [(detail) => {
						return true
					}]
					}),
				'/Game': wrap({
					component: Game,
					conditions: [(detail) => {
						if ($login_store == null) {
							return false
						}
						else {
							return true
						}
					}]
					}),
				'/Games': wrap({
					component: Games,
					conditions: [(detail) => {
						if ($login_store == null) {
							return false
						}
						else {
							return true
						}
					}]
					}),
				'/GameLog:id': wrap({
					component: GameLog,
					conditions: [(detail) => {
						if ($login_store == null) {
							return false
						}
						else {
							return true
						}
					}]
					})
			}



</script>

<nav>
	<h1><a href="/" use:link>Gomoku</a></h1>
	{#if $login_store == null}
	<a href="/Login" use:link>Login</a>
	{/if}
	<br>
	{#if $login_store != null}
		<h3> logged in as {$login_store.username} (<a href="/Login" use:link>logout</a>)</h3>
		<a href="/Games" use:link>Previous Games</a>
	{/if}
</nav>

<Router {routes}/>


<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
