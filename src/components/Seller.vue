<!--
 * @Author: Popcorn
 * @Date: 2022-10-26 17:21:52
 * @Description: 
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
	name: '',
	data() {
		return {
			chartInstance: null, // 图表实例
			allData: null, // 所有数据
			currentPage: 1, // 当前页码
			totalPage: 0, // 总页数
			timer: null // 定时器
		};
	},
	mounted() {
		this.initChart();
		this.getData();
		// 分辨率配置，监听浏览器窗口事件
		window.addEventListener('resize', this.screenAdapter);
		this.screenAdapter(); // 页面加载完成初始化适配
	},
	// 销毁定时器
	destroyed() {
		clearInterval(this.timer);
		window.removeEventListener('resize', this.screenAdapter);
	},
	methods: {
		// 初始化图表
		initChart() {
			// 第一个参数是图表容器的dom元素，第二个参数是图表的配置项
			this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk');
			// 图标初始化配置
			const initOption = {
				title: {
					// text: '商家销售额排行',
					text: '排行榜',
					textStyle: {
						color: '#fff'
					},
					// x轴居中
					left: 'center',
					top: 20
				},
				// 坐标轴位置配置,默认在x轴上,这里配置在y轴上,并且反转
				grid: {
					left: '15%', // 距离左边的距离
					right: '10%', // 距离右边的距离
					bottom: '20%', // 距离底部的距离
					top: '20%', // 距离顶部的距离
					containLabel: true // 包含刻度文字在内,防止文字溢出,默认false
				},
				xAxis: {
					type: 'value'
				},
				yAxis: {
					type: 'category',
					axisLabel: {
						fontSize: 16
					}
				},
				tooltip: {
					trigger: 'axis', // 触发类型,坐标轴触发,axis,坐标轴触发,只显示一个数据项,item,数据项图形触发,显示所有数据项,none,什么都不触发
					// 坐标轴触发,显示所有数据项
					axisPointer: {
						type: 'line', // 默认为直线,可选为：'line' | 'shadow'
						// 层级
						z: 0,
						// 直线指示器样式设置
						lineStyle: {
							color: '#23443',
							color: '#2D3443'
						}
					}
				},
				series: [
					{
						type: 'bar',
						name: '销量',
						label: {
							show: true, // 显示柱子上的文字
							position: 'right', // 文字显示在右边
							fontSize: 16, // 文字大小
							color: '#fff' // 文字颜色
						},
						// 柱子样式
						itemStyle: {
							color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{offset: 0, color: '#33437c'}, //offset: 0表示渐变色的起始位置,1表示渐变色的结束位置,color表示渐变色的颜色
								{offset: 1, color: '#46a86a'}
							])
						}
					}
				]
			};
			// 完成初始化配置后
			this.chartInstance.setOption(initOption);
			// 监听图表鼠标事件
			this.chartInstance.on('mouseover', params => {
				// 鼠标移入时，清除定时器
				clearInterval(this.timer);
			});
			this.chartInstance.on('mouseout', params => {
				// 鼠标移出时，开启定时器
				this.startInterval();
			});
		},
		// 获取数据
		async getData() {
			// await this.$axios.get('seller').then(res => {
			// });
			const {data: res} = await this.$axios.get('seller');
			this.allData = res;
			// 从小到大排列;
			this.allData.sort((a, b) => {
				return a.value - b.value;
			});
			// 每五个元素显示一页
			this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : Math.floor(this.allData.length / 5) + 1;
			this.updateChart(); // 更新图表
			this.startInterval(); // 开启定时器
		},
		// 更新图标数据
		updateChart() {
			const start = (this.currentPage - 1) * 5; // 开始索引
			const end = this.currentPage * 5; // 结束索引
			const showData = this.allData.slice(start, end); // 截取数据
			const sellerNames = showData.map(item => item.name);
			const sellerValues = showData.map(item => item.value);
			const dataOption = {
				yAxis: {
					data: sellerNames
				},
				series: [
					{
						data: sellerValues
					}
				]
			};
			this.chartInstance.setOption(dataOption);
		},
		// 定时器
		startInterval() {
			// 判断是否有定时器，如果有就清除，防止重复开启定时器，导致定时器越来越快
			if (this.timer) {
				clearInterval(this.timer);
			}
			// 开启定时器，每隔3秒更新一次图表，更新到最后一页时，从第一页重新开始
			this.timer = setInterval(() => {
				this.currentPage++;
				if (this.currentPage > this.totalPage) {
					this.currentPage = 1;
				}
				this.updateChart();
			}, 3000);
		},
		// 浏览器变化
		screenAdapter() {
			const wd = (this.$refs.seller_ref.offsetWidth / 100) * 3.6; // 3.6是根据设计稿的宽度来的,100是设计稿的宽度,这里是为了适配不同的屏幕
			//  分辨率适配置
			const adapterOtion = {
				title: {
					textStyle: {
						fontSize: wd
					}
				},
				tooltip: {
					// 坐标轴触发,显示所有数据项
					axisPointer: {
						// 直线指示器样式设置
						lineStyle: {
							width: wd
						}
					}
				},
				series: [
					{
						barWidth: wd, // 柱子宽度
						// 柱子样式
						itemStyle: {
							barBorderRadius: [0, wd / 2, wd / 2, 0] // 柱子圆角
						}
					}
				]
			};
			this.chartInstance.setOption(adapterOtion);
			// 手动调动图标对象的resize方法，让图表重新适配浏览器
			this.chartInstance.resize();
		}
	}
};
</script>

<style>
</style>