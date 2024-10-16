<script>
	import Password from './(components)/(forms)/password.svelte';
	import Profile from './(components)/(forms)/profile.svelte';
	export let data;
</script>

<div class="py-5">
    <Profile {data}/>
	<br/>
	<Password/>
</div>
