<script>
import { login_store , gamehistory_store , database } from '../src/stores';
function back(){
    push('/games')
 }
</script>


<button on:click={back}>Back</button>
