<!--
 * @Author: Popcorn
 * @Date: 2022-10-28 11:00:41
 * @Description: 
-->
<template>
  <div class="com-page">
    <Map></Map>
  </div>
</template>

<script>
export default {
	name: 'MapPage',
	components: {
		Map: () => import('@/components/Map')
	}
};
</script>

<style>
</style>