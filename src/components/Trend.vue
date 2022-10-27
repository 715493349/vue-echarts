<!--
 * @Author: Popcorn
 * @Date: 2022-10-27 16:55:27
 * @Description: 
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
	name: 'Trend',
	data() {
		return {
			chartInstane: null, // 图表实例
			allData: null // 所有数据
		};
	},
	mounted() {
		this.initChart();
		this.getData();
	},
	methods: {
		// 初始化图表
		initChart() {
			this.chartInstane = this.$echarts.init(this.$refs.trend_ref);
			const initOption = {};
			this.chartInstane.setOption(initOption);
		},
		// 获取数据
		async getData() {
			const {data: res} = await this.$axios.get('trend');
			this.allData = res;
		}
	}
};
</script>

<style>
</style>