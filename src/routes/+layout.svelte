<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/global.scss' // scss를 불러옴.

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
