
<script lang='ts'>
    import { link, push, pop, replace } from 'svelte-spa-router';
    import { useForm, validators,  Hint, required } from "svelte-use-form";
    import { login_store , database } from '../src/stores';



 const form = useForm();
 let username = ''
 let password = ''
 let error = ''

function signup() {
    const user = database.find(
        (u) => u.username === username && u.password === password
    )
     if ( !user ){
         $login_store = user
         console.log(JSON.stringify($login_store, null, 2))
         if ( error ) error = ''
         push('/')
     }
     else {
         error = 'Username unavailable'
         alert(error)
     }
 }


</script>


<form use:form on:submit|preventDefault={signup}>
    <h1>Signup</h1>
    <label>Username</label>
    <input name='username' bind:value={username} use:validators={[required]}/>
    <Hint for='username' on='required'>
        This field is required
    </Hint>
    <br>
    <label>Password</label>
    <input name='password' type='password' bind:value={password} use:validators={[required]}>
    <Hint for='password' on='required'>
        This field is required
    </Hint>
    <button type='submit' disabled={!$form.valid} on:click={signup}>Signup</button>
</form>

