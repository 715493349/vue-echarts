<!--
 * @Author: Popcorn
 * @Date: 2022-10-28 16:25:33
 * @Description: 
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="screen_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{catName}}</span>
  </div>
</template>

<script>
export default {
	name: 'Screen',
	data() {
		return {
			chartInstane: null, // 图表实例
			allData: null, // 所有数据
			cuurentIndex: 0, // 当前索引,当前展示的一级分类
			titleFontSize: 0
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
	},
	// 计算属性
	computed: {
		// 当前一级分类名称
		catName() {
			if (!this.allData) {
				return '';
			} else {
				return this.allData[this.cuurentIndex].name; // 当前一级分类名称
			}
		},
		// 字体大小
		comStyle() {
			return {
				fontSize: this.titleFontSize + 'px'
			};
		}
	},
	methods: {
		// 初始化图表
		initChart() {
			this.chartInstane = this.$echarts.init(this.$refs.screen_ref, 'chalk');
			const initOption = {
				title: {
					text: '商品占比',
					left: 30,
					top: 30
				},
				legend: {
					top: '5%',
					icon: 'circle'
				},
				tooltip: {
					show: true,
					// 自定义提示框
					formatter: val => {
						const thirdCategory = this.allData[this.cuurentIndex].children;
						// 计算三级分类数值总和
						let total = 0;
						thirdCategory.forEach(item => {
							total += item.value;
						});
						let retStr = '';
						thirdCategory.forEach(item => {
							retStr += `<div>${item.name} : ${((item.value / total) * 100).toFixed(2)}%</div>`; //三级分类：三级分类的百分比.toFixed(2)保留两位小数
						});
						return retStr;
					}
				},
				series: [
					{
						type: 'pie',
						label: {
							show: true,
							position: 'inside', // 标签的位置
							formatter: '{d}%' // 显示百分比
						},
						emphasis: {
							// 高亮,鼠标移入
							label: {
								show: true
							}
						}
					}
				]
			};
			this.chartInstane.setOption(initOption);
		},
		// 获取数据
		async getData() {
			const {data: res} = await this.$axios.get('hot');
			// console.log(res);
			this.allData = res;
			this.updataChart();
		},
		// 更新图表
		updataChart() {
			const legendData = this.allData[this.cuurentIndex].children.map(item => item.name);
			const seriesData = this.allData[this.cuurentIndex].children.map(item => {
				return {
					name: item.name,
					value: item.value,
					children: item.children
				};
			});
			const updataOption = {
				// 图例
				legend: {
					data: legendData
				},
				series: [
					{
						data: seriesData
					}
				]
			};
			this.chartInstane.setOption(updataOption);
		},
		screenAdapter() {
			this.titleFontSize = (this.$refs.screen_ref.offsetWidth / 100) * 3.6;
			const adapterOtion = {
				title: {
					textStyle: {
						fontSize: this.titleFontSize
					}
				},
				legend: {
					itemWidth: this.titleFontSize / 2, // 图例宽度
					itemHeight: this.titleFontSize / 2, // 图例高度
					itemGap: this.titleFontSize / 2, // 图例间距
					textStyle: {
						fontSize: this.titleFontSize / 2 // 图例字体大小
					}
				},
				series: [
					{
						radius: this.titleFontSize * 7,
						center: ['50%', '60%']
					}
				]
			};
			this.chartInstane.setOption(adapterOtion);
			this.chartInstane.resize();
		},
		// 向左
		toLeft() {
			this.cuurentIndex--;
			if (this.cuurentIndex < 0) {
				// 如果当前索引小于0,则索引等于最后一个索引
				this.cuurentIndex = this.allData.length - 1;
			}
			this.updataChart();
		},
		// 向右
		toRight() {
			this.cuurentIndex++;
			if (this.cuurentIndex > this.allData.length - 1) {
				// 如果当前索引大于最后一个索引,则索引等于0
				this.cuurentIndex = 0;
			}
			this.updataChart();
		}
	}
};
</script>

<style lang="less" scoped>
.arr-left {
	position: absolute;
	top: 60%;
	left: 10%;
	transform: translateY(-50%);
	color: #fff;
	cursor: pointer;
}
.arr-right {
	position: absolute;
	top: 60%;
	right: 10%;
	transform: translateY(-50%);
	color: #fff;
	cursor: pointer;
}
.cat-name {
	position: absolute;
	top: 8%;
	right: 10%;
	color: #fff;
}
</style>