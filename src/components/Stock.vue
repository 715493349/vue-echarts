<!--
 * @Author: Popcorn
 * @Date: 2022-10-28 17:51:01
 * @Description: 
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
export default {
	name: 'Stock',
	data() {
		return {
			chartInstane: null, // 图表实例
			allData: null, // 所有数据
			currentIndex: 0, // 当前数据索引
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
		clearInterval(this.timerId);
	},
	methods: {
		// 初始化图表
		initChart() {
			this.chartInstane = this.$echarts.init(this.$refs.stock_ref, 'chalk');
			const initOption = {
				title: {
					text: '库存销量分析',
					top: 30,
					left: 30
				},
				series: [
					{
						type: 'pie'
					}
				]
			};
			this.chartInstane.setOption(initOption);
			// 鼠标事件监听
			this.chartInstane.on('mouseover', () => {
				clearInterval(this.timerId);
			});
			this.chartInstane.on('mouseout', () => {
				this.startInterval();
			});
		},
		// 获取数据
		async getData() {
			const {data: res} = await this.$axios.get('stock');
			console.log(res);
			this.allData = res;
			this.updataChart();
			this.startInterval();
		},
		// 更新图表
		updataChart() {
			// 中心点坐标
			const centerArr = [
				['18%', '40%'],
				['50%', '40%'],
				['82%', '40%'],
				['34%', '75%'],
				['66%', '75%']
			];
			const colorArr = [
				['#4FF778', '#0BA82C'],
				['#E5DD45', '#E8B11C'],
				['#E8821C', '#E55445'],
				['#5052EE', '#AB6EE5'],
				['#23E5E5', '#2E72BF']
			];
			// 处理图表数据
			const start = this.currentIndex * 5; // 开始索引,每次显示5条数据
			const end = (this.currentIndex + 1) * 5; //  结束索引,每次显示5条数据
			const showData = this.allData.slice(start, end); // 取前五条数据
			const seriesArr = showData.map((item, index) => {
				return {
					type: 'pie',
					radius: [110, 100],
					center: centerArr[index], // 中心点坐标
					hoverAnimation: false, // 鼠标移入不放大
					label: {
						show: false // 不显示标签,只显示图形
					},
					label: {
						position: 'center',
						color: colorArr[index][0]
					},
					data: [
						{
							name: item.name + '\n\n' + item.sales,
							value: item.sales,
							itemStyle: {
								color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
									{offset: 0, color: colorArr[index][0]},
									{offset: 1, color: colorArr[index][1]}
								])
							}
						},
						{
							value: item.stock,
							itemStyle: {
								color: '#079d72'
							}
						}
					]
				};
			});
			const option = {
				series: seriesArr
			};
			this.chartInstane.setOption(option);
		},
		// 屏幕适配
		screenAdapter() {
			const titleFontSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6; // 标题字体大小
			const innerRadius = titleFontSize * 2; // 内圆半径
			const outerRadius = titleFontSize * 1.125; // 外圆半径
			const adapterOtion = {
				title: {
					textStyle: {
						fontSize: titleFontSize
					}
				},
				series: [
					{
						type: 'pie',
						radius: [outerRadius, innerRadius],
						label: {
							fontSize: titleFontSize / 2
						}
					},
					{
						type: 'pie',
						radius: [outerRadius, innerRadius],
						label: {
							fontSize: titleFontSize / 2
						}
					},
					{
						type: 'pie',
						radius: [outerRadius, innerRadius],
						label: {
							fontSize: titleFontSize / 2
						}
					},
					{
						type: 'pie',
						radius: [outerRadius, innerRadius],
						label: {
							fontSize: titleFontSize / 2
						}
					},
					{
						type: 'pie',
						radius: [outerRadius, innerRadius],
						label: {
							fontSize: titleFontSize / 2
						}
					}
				]
			};
			this.chartInstane.setOption(adapterOtion);
			this.chartInstane.resize();
		},
		startInterval() {
			if (this.timerId) {
				clearInterval(this.timerId);
			}
			this.timerId = setInterval(() => {
				this.currentIndex++;
				if (this.currentIndex > 1) {
					this.currentIndex = 0;
				}
				this.updataChart();
			}, 5000);
		}
	}
};
</script>

<style>
</style>