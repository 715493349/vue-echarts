<!--
 * @Author: Popcorn
 * @Date: 2022-10-27 16:55:27
 * @Description: 
-->
<template>
  <div class="com-container">
    <div class="title" :style="conStyle">
      <span>{{showTitle}}</span>
      <span class="iconfont title-icon" @click="showChoice = !showChoice" :style="conStyle">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">{{item.text}}</div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
	name: 'Trend',
	data() {
		return {
			chartInstane: null, // 图表实例
			allData: null, // 所有数据
			showChoice: false, // 是否显示选择框
			choiceType: 'map', // 选择的数据类型
			titleFontSize: 0 // 标题字体大小
		};
	},
	// 计算属性
	computed: {
		selectTypes() {
			if (!this.allData) {
				return [];
			} else {
				// 根据数据类型返回不同的选择项,过滤掉没有数据的类型
				return this.allData.type.filter(item => item.key !== this.choiceType);
			}
		},
		showTitle() {
			if (!this.allData) {
				return '';
			} else {
				return this.allData[this.choiceType].title;
			}
		},
		// 字体大小
		conStyle() {
			return {
				fontSize: this.titleFontSize + 'px'
			};
		},
		marginStyle() {
			return {
				marginLeft: this.titleFontSize + 'px'
			};
		}
	},
	created() {
		// 组件创建完成后进行回调函数的注册
		this.$socket.registerCallBack('trendData', this.getData);
	},
	mounted() {
		this.initChart();
		// this.getData();
		// 发送请求,获取数据
		this.$socket.send({
			action: 'getData',
			socketType: 'trendData',
			chartName: 'trend',
			value: ''
		});
		window.addEventListener('resize', this.screenAdapter);
		this.screenAdapter(); // 页面加载完成初始化适配
	},
	destroyed() {
		window.removeEventListener('resize', this.screenAdapter);
		this.$socket.unRegisterCallBack('trendData'); // 组件销毁时取消注册
	},
	methods: {
		// 初始化图表
		initChart() {
			this.chartInstane = this.$echarts.init(this.$refs.trend_ref, 'chalk');
			const initOption = {
				grid: {
					left: '15%', // 距离左边的距离
					right: '10%', // 距离右边的距离
					bottom: '15%', // 距离底部的距离
					top: '20%', // 距离顶部的距离
					containLabel: true // 包含刻度文字在内,防止文字溢出,默认false
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross' //十字准星指示器
					}
				},
				// 图例,可以控制图表的显示隐藏,默认显示
				legend: {
					textStyle: {
						color: '#fff',
						fontSize: 16
					},
					top: '12%',
					right: '10%',
					icon: 'circle' // 图例的图标,默认是方块,有circle(圆形),rect(方形),roundRect(圆角方形),triangle(三角形),diamond(菱形),pin(大头针),arrow(箭头),none(无)
				},
				xAxis: {
					type: 'category',
					boundaryGap: false // 坐标轴两边留白
				},
				yAxis: {
					type: 'value'
				}
			};
			this.chartInstane.setOption(initOption);
		},
		// 获取数据
		async getData(res) {  //res是后台返回的数据,
			// const {data: res} = await this.$axios.get('trend');
			this.allData = res;
			this.updateChart();
		},

		updateChart() {
			// 半透明颜色值
			const colorArr1 = [
				'rgba(11, 168, 44, 0.5)',
				'rgba(44, 110, 255, 0.5)',
				'rgba(22, 242, 217, 0.5)',
				'rgba(254, 33, 30, 0.5)',
				'rgba(250, 105, 0, 0.5)'
			];
			// 全透明的颜色值
			const colorArr2 = [
				'rgba(11, 168, 44, 0)',
				'rgba(44, 110, 255, 0)',
				'rgba(22, 242, 217, 0)',
				'rgba(254, 33, 30, 0)',
				'rgba(250, 105, 0, 0)'
			];
			// 处理数据
			const timeArr = this.allData.common.month; //类目轴数据
			const valueArr = this.allData[this.choiceType].data; //y轴数据
			const seriesArr = valueArr.map((item, index) => {
				return {
					name: item.name, // 系列名称
					type: 'line', //折线图
					data: item.data, //y轴数据
					stack: this.choiceType, //堆叠,相同的stack值会堆叠在一起,不同的stack值会分开堆叠
					areaStyle: {
						color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: colorArr1[index]
							},
							{
								offset: 1,
								color: colorArr2[index]
							}
						])
					} // 区域填充样式
				};
			});
			// 图例数据
			const legendArr = valueArr.map(item => item.name);
			const DataOption = {
				xAxis: {
					data: timeArr
				},
				// legend：图例，图例是图表中的一组数据，每一组数据都有一个图例，图例可以点击，点击后可以显示或隐藏对应的数据
				legend: {
					data: legendArr //图例数据
				},
				series: seriesArr
			};
			this.chartInstane.setOption(DataOption);
		},
		// 分辨率适配
		screenAdapter() {
			this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 1.5;
			const adapterOtion = {
				legend: {
					itemWidth: this.titleFontSize,
					itemHeight: this.titleFontSize / 2,
					itemGap: this.titleFontSize,
					textStyle: {
						fontSize: this.titleFontSize / 2
					}
				}
			};
			this.chartInstane.setOption(adapterOtion);
			this.chartInstane.resize();
		},
		handleSelect(value) {
			this.choiceType = value;
			this.updateChart();
			this.showChoice = false;
		}
	}
};
</script>

<style lang="less" scoped>
.title {
	position: absolute;
	top: 20px;
	left: 20%;
	color: #c4bebe;
	z-index: 999;
	.title-icon {
		margin-left: 10px;
		cursor: pointer;
	}
	.select-con {
		background-color: #222733;
		cursor: pointer;
	}
}
</style>