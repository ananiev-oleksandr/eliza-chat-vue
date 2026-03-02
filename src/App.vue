<script setup lang="ts">
import ChatEliza from './components/ChatEliza.vue';
</script>

<template>
	<div class="page">
			<ChatEliza />
	</div>
</template>

<style scoped>
.page {
	min-height: 100%;
	display: grid;
	place-items: center;
	padding: 24px;
}
</style>
