<!--
 * @Author: Popcorn
 * @Date: 2022-10-26 17:21:00
 * @Description: 
-->
<template>
  <div class="com-page">
    <Seller></Seller>
  </div>
</template>

<script>
export default {
	name: 'SellerPage',
	components: {
		Seller: () => import('@/components/Seller')
	},
	data() {
		return {};
	}
};
</script>

<style>
</style>