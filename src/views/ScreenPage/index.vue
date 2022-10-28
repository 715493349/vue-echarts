<!--
 * @Author: Popcorn
 * @Date: 2022-10-28 16:24:40
 * @Description: 
-->
<template>
  <div class="com-page">
    <Screen />
  </div>
</template>

<script>
export default {
	name: 'ScreenPage',
	components: {
		Screen: () => import('@/components/screen.vue')
	}
};
</script>

<style>
</style>