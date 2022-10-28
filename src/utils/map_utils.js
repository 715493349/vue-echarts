/*
 * @Author: Popcorn
 * @Date: 2022-10-28 14:23:09
 * @Description: 
 */
const name2pinyin = {
  安徽: 'anhui',
  陕西: 'shanxi1',
  澳门: 'aomen',
  北京: 'beijing',
  重庆: 'chongqing',
  福建: 'fujian',
  甘肃: 'gansu',
  广东: 'guangdong',
  广西: 'guangxi',
  贵州: 'guizhou',
  海南: 'hainan',
  河北: 'hebei',
  黑龙江: 'heilongjiang',
  河南: 'henan',
  湖北: 'hubei',
  湖南: 'hunan',
  江苏: 'jiangsu',
  江西: 'jiangxi',
  吉林: 'jilin',
  辽宁: 'liaoning',
  内蒙古: 'neimenggu',
  宁夏: 'ningxia',
  青海: 'qinghai',
  山东: 'shandong',
  上海: 'shanghai',
  山西: 'shanxi',
  四川: 'sichuan',
  台湾: 'taiwan',
  天津: 'tianjin',
  香港: 'xianggang',
  新疆: 'xinjiang',
  西藏: 'xizang',
  云南: 'yunnan',
  浙江: 'zhejiang'
}

export function getProvinceMapInfo(arg) {
  //表示获取省份地图的路径，这里的路径是根据省份名称获取，省份名称和地图名称是一一对应的，
  // 所以可以通过省份名称获取地图路径，这里的路径是静态资源的路径，需要在static文件夹下创建map文件夹，
  // 然后在map文件夹下创建province文件夹，然后在province文件夹下创建对应的省份地图文件，这里的省份地图文件是json格式的，
  // 可以通过百度地图获取，也可以通过其他地图获取，只要是json格式的就可以，这里的路径是静态资源的路径，所以需要在static文件夹下创建map文件夹，
  const path = `/static/map/province/${name2pinyin[arg]}.json`
  return {
    key: name2pinyin[arg],
    path: path
  }
}
