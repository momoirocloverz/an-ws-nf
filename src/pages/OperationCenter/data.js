// banner 配置
const LINK_TYPE = {
  '0': '',
  '1': {label: '原生路由', msg: '请输入小程序路由'},
  '2': {label: '链接', msg: '请输入跳转链接'},
  '3': {label: '文章', msg: '请输入文章ID'},
  '4': {label: '课程', msg: '请输入课程ID'},
}
const BANNER_TYPE = [
  {value: 1, label: '顶部轮播'},
  {value: 2, label: '首页弹窗'}
]
const BANNER_TYPE_OPTIONS = {
  1: '顶部轮播',
  2: '首页弹窗'
}

export {
  LINK_TYPE,
  BANNER_TYPE,
  BANNER_TYPE_OPTIONS
}