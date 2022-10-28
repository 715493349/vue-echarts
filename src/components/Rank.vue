<!--
 * @Author: Popcorn
 * @Date: 2022-10-28 14:52:28
 * @Description: 
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
export default {
	name: 'Rank',
	data() {
		return {
			chartInstane: null, // 图表实例
			allData: null, // 所有数据
			// 定时器
			startValue: 0, // 区域开始值
			endValue: 9, // 区域结束值
			timerId: null // 定时器id
		};
	},
	mounted() {
		this.initChart();
		this.getData();
		window.addEventListener('resize', this.screenAdapter);
		this.screenAdapter(); // 页面加载完成初始化适配
	},
	destroyed() {
		window.removeEventListener('resize', this.screenAdapter);
		// 取消定时器
		clearInterval(this.timerId);
	},
	// 计算属性
	computed: {},
	methods: {
		// 初始化图表
		initChart() {
			this.chartInstane = this.$echarts.init(this.$refs.rank_ref, 'chalk');
			const initOption = {
				title: {
					text: '排行榜',
					left: 20,
					top: 20
				},
				grid: {
					left: '15%', // 距离左边的距离
					right: '15%', // 距离右边的距离
					bottom: '15%', // 距离底部的距离
					top: '20%', // 距离顶部的距离
					containLabel: true // 包含刻度文字在内,防止文字溢出,默认false
				},
				tooltip: {
					trigger: 'item' // 鼠标移入触发,默认item,可选item|axis|none
					// axisPointer: {
					// 	type: 'shadow'
					// }
				},
				xAxis: {
					type: 'category'
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						type: 'bar'
					}
				]
			};
			this.chartInstane.setOption(initOption);
			// 鼠标事件监听
			this.chartInstane.on('mouseover', () => {
				// 鼠标移入
				clearInterval(this.timerId);
			});
			this.chartInstane.on('mouseout', () => {
				// 鼠标移出
				this.timerId = setInterval(() => {
					this.startInterval();
				}, 2000);
			});
		},
		// 获取数据
		async getData() {
			const {data: res} = await this.$axios.get('rank');
			console.log(res);
			this.allData = res;
			// 排序
			this.allData.sort((a, b) => b.value - a.value);
			this.updataChart();
			this.startInterval(); // 开启定时器
		},
		updataChart() {
			const colorArr = [
				['#0BA82C', '#4FF778'],
				['#2E72BF', '#23E5E5'],
				['#5052EE', '#AB6EE5']
			];
			const provinceArr = this.allData.map(item => item.name);
			const valueArr = this.allData.map(item => item.value);
			const updataOption = {
				xAxis: {
					data: provinceArr
				},
				yAxis: {
					type: 'value'
				},
				dataZoom: [
					{
						show: false,
						startValue: this.startValue,
						endValue: this.endValue
					}
				],
				series: [
					{
						data: valueArr,
						itemStyle: {
							color: val => {
								let colorIndex = null;
								if (val.value > 300) {
									colorIndex = colorArr[0];
								} else if (val.value > 200) {
									colorIndex = colorArr[1];
								} else {
									colorIndex = colorArr[2];
								}
								return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
									{offset: 0, color: colorIndex[0]},
									{offset: 1, color: colorIndex[1]}
								]);
							}
						}
					}
				]
			};
			this.chartInstane.setOption(updataOption);
		},
		screenAdapter() {
			// 标题大小
			const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
			const adapterOtion = {
				title: {
					textStyle: {
						fontSize: titleFontSize
					}
				},
				series: [
					{
						barWidth: titleFontSize,
						itemStyle: {
							barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0] // 圆角,左上,右上,右下,左下
						}
					}
				]
			};
			this.chartInstane.setOption(adapterOtion);
			this.chartInstane.resize();
		},
		// 定时器
		startInterval() {
			// 判断是否有定时器，如果有就清除，防止重复开启定时器，导致定时器越来越快
			if (this.timerId) {
				clearInterval(this.timerId);
			}
			this.timerId = setInterval(() => {
				// 判断是否到达最后一条数据
				if (this.endValue >= this.allData.length) {
					this.startValue = 0;
					this.endValue = 9;
				} else {
					this.startValue++;
					this.endValue++;
				}
				this.updataChart();
			}, 2000);
		}
	}
};
</script>

<style>
</style>