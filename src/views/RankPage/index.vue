<!--
 * @Author: Popcorn
 * @Date: 2022-10-28 14:52:57
 * @Description: 
-->
<template>
  <div class="com-page">
    <Rank></Rank>
  </div>
</template>

<script>
export default {
	name: 'RankPage',
	components: {
		Rank: () => import('@/components/Rank')
	}
};
</script>

<style>
</style>