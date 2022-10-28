<!--
 * @Author: Popcorn
 * @Date: 2022-10-28 11:01:42
 * @Description: 
-->
<template>
  <div class="com-container" @click="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios';
import {getProvinceMapInfo} from '@/utils/map_utils.js';
export default {
	name: 'Map',
	data() {
		return {
			chartInstane: null, // 图表实例
			allData: null, // 所有数据
			mapData: {} // 缓存获取的地图省份地图矢量数据
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
	methods: {
		// 初始化图表
		async initChart() {
			this.chartInstane = this.$echarts.init(this.$refs.map_ref, 'chalk');
			// 获取中国矢量数据
			const res = await axios.get('http://localhost:8889/static/map/china.json');
			// console.log(res);
			this.$echarts.registerMap('china', res.data); // 注册地图,第一个参数为地图名称,第二个参数为地图数据,第三个参数为地图配置
			const initOption = {
				title: {
					text: '用户分布',
					left: 20,
					top: 20
				},
				geo: {
					type: 'map',
					map: 'china',
					roam: true, //是否开启鼠标缩放和平移漫游
					// zoom: 1.0, //当前视角的缩放比例,默认为1
					top: '5%',
					bottom: '5%',
					itemStyle: {
						areaColor: '#314967',
						borderColor: '#111'
					}
				},
				legend: {
					bottom: '5%',
					left: '5%',
					// 竖直布局
					orient: 'vertical'
				}
			};
			this.chartInstane.setOption(initOption);
			// 监听地图点击事件
			this.chartInstane.on('click', async params => {
				// console.log(params);
				// 获取点击的省份名称
				const provinceInfo = getProvinceMapInfo(params.name);
				// console.log(provinceInfo);
				// 判断点击的这个省份地图矢量数据是否已经获取过
				if (!this.mapData[provinceInfo.key]) {
					// 获取省份数据,并且更新图表,更新图例,更新标题,更新地图
					const res = await axios.get('http://localhost:8889' + provinceInfo.path);
					// console.log(res);
					//
					this.mapData[provinceInfo.key] = res.data; // 缓存数据,避免重复请求,
					// 更新图表
					this.$echarts.registerMap(provinceInfo.key, res.data);
				}
				// 更新图例
				const changeOption = {
					geo: {
						map: provinceInfo.key
					}
				};
				this.chartInstane.setOption(changeOption);
			});
		},
		// 获取数据
		async getData() {
			const {data: res} = await this.$axios.get('map');
			this.allData = res;
			this.updateChart();
		},
		updateChart() {
			// 图例数据
			const legendData = this.allData.map(item => item.name);
			const seriesArr = this.allData.map(item => {
				// return的对象是一个类别的散点数据
				// 地图中显示散点数据，需要对散点的图标增加一个配置 coordeinateSystem: 'geo'
				return {
					type: 'effectScatter',
					name: item.name,
					data: item.children,
					coordinateSystem: 'geo',
					//涟漪特效
					rippleEffect: {
						period: 4, //动画时间，值越小速度越快
						scale: 4, //动画中波纹的最大缩放比例
						brushType: 'stroke' //波纹绘制方式 stroke, fill, both, 默认both
					}
				};
			});
			const dataOption = {
				legend: {
					data: legendData
				},
				series: seriesArr
			};
			this.chartInstane.setOption(dataOption);
		},
		screenAdapter() {
			// 字体大小
			const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
			const adapterOtion = {
				title: {
					textStyle: {
						fontSize: titleFontSize
					}
				},
				legend: {
					temWidth: titleFontSize / 2, // 图例宽度
					itemHeight: titleFontSize / 2, // 图例高度
					itemGap: titleFontSize / 2, // 图例间距
					textStyle: {
						fontSize: titleFontSize / 2 // 图例字体大小
					}
				}
			};
			this.chartInstane.setOption(adapterOtion);
			this.chartInstane.resize();
		},
		revertMap() {
			const revertOption = {
				geo: {
					map: 'china'
				}
			};
			this.chartInstane.setOption(revertOption);
		}
	}
};
</script>

<style>
</style>