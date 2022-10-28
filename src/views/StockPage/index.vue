<!--
 * @Author: Popcorn
 * @Date: 2022-10-28 17:53:10
 * @Description: 
-->
<template>
  <div class="com-page">
    <Stock />
  </div>
</template>

<script>
export default {
	name: 'StockPage',
	components: {
		Stock: () => import('@/components/Stock')
	}
};
</script>

<style>
</style>