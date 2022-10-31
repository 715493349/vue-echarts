<!--
 * @Author: Popcorn
 * @Date: 2022-10-27 17:39:13
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
		window.addEventListener('resize', this.screenAdapter);
		this.screenAdapter(); // 页面加载完成初始化适配
	},
	//分辨率配置，监听浏览器窗口事件
	destroyed() {
		window.removeEventListener('resize', this.screenAdapter);
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
			const {data: res} = await this.$axios.get('');
			this.allData = res;
			this.updataChart();
		},
		// 更新图表
		updataChart() {
			const option = {};
			this.chartInstane.setOption(option);
		},
		// 屏幕适配
		screenAdapter() {
			const adapterOtion = {};
			this.chartInstane.setOption(adapterOtion);
			this.chartInstane.resize();
		}
	}
};
</script>

<style>
</style>