<!--
 * @Author: Popcorn
 * @Date: 2022-10-27 16:56:00
 * @Description: 
-->
<template>
  <div class="com-page">
    <Trend></Trend>
  </div>
</template>

<script>
export default {
	name: 'TrendPage',
	components: {
		Trend: () => import('@/components/Trend')
	},
	data() {
		return {};
	}
};
</script>

<style>
</style>