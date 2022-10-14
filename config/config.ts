// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  define: {
    REACT_APP_ENV,
  },
  devtool: false,
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: false,
  },
  dynamicImport: {},
  targets: {
    ie: 11,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/loginBridge',
      component: '@/pages/loginBridge/index',
      name: 'loginBridge',
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/index',
            },
            {
              path: '/index',
              name: '首页',
              icon: 'smile',
              component: './Index',
            },
            {
              path: '/statistics',
              name: '统计中心',
              icon: 'setting',
              routes: [
                {
                  name: '打分项统计',
                  icon: 'smile',
                  path: '/statistics/integral',
                  component: './statistics/integral',
                },
                {
                  name: '福利兑换统计',
                  icon: 'smile',
                  path: '/statistics/exchange',
                  component: './statistics/exchange',
                },
                {
                  name: '三务公开统计',
                  icon: 'smile',
                  path: '/statistics/article',
                  component: './statistics/article',
                },
              ],
            },
            {
              path: '/operation',
              name: '运营中心',
              icon: 'setting',
              routes: [
                {
                  name: 'Banner配置',
                  icon: 'smile',
                  path: '/operation/bannerConfig',
                  component: './OperationCenter/BannerConfig',
                },
                {
                  name: '活动管理',
                  icon: 'smile',
                  path: '/operation/activity',
                  component: './OperationCenter/activity',
                },
                {
                  name: '金刚区管理',
                  icon: 'smile',
                  path: '/operation/kingkong',
                  component: './OperationCenter/kingkong',
                },
                {
                  name: '消息通知',
                  icon: 'smile',
                  path: '/operation/pushMessage',
                  component: './OperationCenter/pushMessage',
                },
              ],
            },
            {
              path: '/village',
              name: '行政村管理',
              icon: 'setting',
              routes: [
                {
                  name: '行政村列表',
                  icon: 'smile',
                  path: '/village/list',
                  component: './AdministrativeVillage/index',
                },
              ],
            },
            {
              path: '/loans',
              name: '善治积分贷',
              icon: 'setting',
              component: './loans',
            },
            {
              path: '/serve/equity',
              name: '产权交易',
              icon: 'setting',
              component: './equity',
            },
            {
              path: '/system',
              name: '系统设置',
              icon: 'setting',
              routes: [
                {
                  path: '/system/roleMan',
                  name: '角色管理',
                  icon: 'team',
                  component: './system/RoleMan',
                },
                {
                  name: '账号管理',
                  icon: 'smile',
                  path: '/system/accountMan',
                  component: './system/AccountMan',
                },
                {
                  name: '导航页管理',
                  icon: 'smile',
                  path: '/system/navMan',
                  component: './system/NavMan',
                },
                {
                  name: '权限管理',
                  icon: 'smile',
                  path: '/system/authority',
                  component: './system/AuthorityPool',
                },
              ],
            },
            {
              path: '/message',
              name: '消息中心',
              icon: 'smile',
              component: './MessageCenter',
            },
            {
              name: '12316',
              icon: 'smile',
              path: '/question',
              component: './QuestionManage',
            },
            {
              name: '供需管理',
              icon: 'smile',
              path: '/supply',
              component: './SupplyManage',
            },
            {
              name: '文章管理',
              icon: 'smile',
              path: '/article',
              component: './articleManage',
            },
            {
              name: '党务',
              icon: 'smile',
              path: '/partywork',
              component: './articleManage/partyWork',
            },
            {
              name: '村务',
              icon: 'smile',
              path: '/villagework',
              component: './articleManage/villageWork',
            },
            {
              name: '财务',
              icon: 'smile',
              path: '/finacework',
              component: './articleManage/finaceWork',
            },
            {
              name: '清廉动态',
              icon: 'smile',
              path: '/cleanTheDynamic',
              component: './articleManage/cleanTheDynamic',
            },
            {
              name: '防疫管理',
              icon: 'smile',
              path: '/epidemic',
              component: './articleManage/epidemic',
            },
            {
              name: '村事共商',
              icon: 'smile',
              path: '/villageAffairs',
              component: './villageAffairs/villageAffairs',
            },
            {
              path: '/train',
              name: '培训管理',
              icon: 'setting',
              routes: [
                {
                  name: '课程管理',
                  icon: 'smile',
                  path: '/train/class',
                  component: './train',
                },
                {
                  name: '类目管理',
                  icon: 'smile',
                  path: '/train/category',
                  component: './train/category',
                },
              ],
            },
            {
              path: '/integral',
              name: '积分管理',
              icon: 'setting',
              routes: [
                {
                  name: '善治分细则',
                  icon: 'smile',
                  path: '/integral/civilization',
                  component: './integral/civilization',
                },
                {
                  name: '家庭积分管理',
                  icon: 'smile',
                  path: '/integral/family',
                  component: './integral/family',
                },
                {
                  name: '操作历史记录',
                  path: '/integral/family/history',
                  hideInMenu: true,
                  component: './integral/family/history',
                },
                {
                  name: '打分管理',
                  icon: 'smile',
                  path: '/integral/scoring',
                  component: './integral/scoring',
                },
                {
                  name: '积分商品',
                  icon: 'smile',
                  path: '/integral/goods',
                  component: './integral/goods',
                },
                {
                  name: '兑换记录',
                  icon: 'smile',
                  path: '/integral/record',
                  component: './integral/ExchangeRecord',
                },
                {
                  name: '积分兑换范围列表',
                  icon: 'smile',
                  path: '/integral/range',
                  component: './integral/exchangeRange',
                },
                {
                  name: '股金分红',
                  icon: 'smile',
                  path: '/integral/share/bonus',
                  component: './integral/shareBonus',
                },
              ],
            },
            {
              path: '/customer',
              name: '用户管理',
              icon: 'setting',
              routes: [
                {
                  name: '家庭分组',
                  icon: 'smile',
                  path: '/customer/family',
                  component: './customer/family',
                },
                {
                  name: '农户管理',
                  icon: 'smile',
                  path: '/customer/farmer',
                  component: './customer/farmer/components/assigned',
                },
                {
                  name: '专家管理',
                  icon: 'smile',
                  path: '/customer/master',
                  component: './customer/master',
                },
                {
                  name: '巡回记录管理',
                  icon: 'smile',
                  path: '/customer/family/image',
                  component: './customer/familyImage',
                },
                {
                  name: '市民管理',
                  icon: 'smile',
                  path: '/customer/citizens',
                  component: './customer/citizens',
                },
              ],
            },
            {
              path: '/settings',
              name: '个人设置',
              icon: 'setting',
              routes: [
                {
                  name: '编辑资料',
                  icon: 'smile',
                  path: '/settings/personalInfo',
                  component: './settings/PersonalInfo',
                },
                {
                  name: '修改密码',
                  icon: 'smile',
                  path: '/settings/passwordInfo',
                  component: './settings/PasswordInfo',
                },
              ],
            },
            {
              name: '浙农补',
              icon: 'smile',
              path: '/agriculture-subsidies',
              routes: [
                {
                  path: '/',
                  redirect: '/agriculture-subsidies/farmland-map',
                },
                {
                  name: '申报管理',
                  icon: 'smile',
                  path: 'claim-management',
                  component: '@/pages/agricultureSubsidies/claimManagement',
                },
                {
                  name: '农机申报管理',
                  icon: 'smile',
                  path: 'agricultural-machinery',
                  component: '@/pages/agricultureSubsidies/agriculturalMachinery',
                },
                {
                  name: '中央/省市资金管理',
                  icon: 'smile',
                  path: 'agricultural-funds',
                  component: '@/pages/agricultureSubsidies/agriculturalFunds',
                },
                {
                  name: '市配方肥申报管理',
                  icon: 'smile',
                  path: 'formula-fertilizer-management',
                  component: '@/pages/agricultureSubsidies/formulaFertilizerManage',
                },
                {
                  name: '镇配方肥申报管理',
                  icon: 'smile',
                  path: 'formula-fertilizer-management-town',
                  component: '@/pages/agricultureSubsidies/formulaFertilizerManageTown',
                },
                {
                  name: '村配方肥申报管理',
                  icon: 'smile',
                  path: 'formula-fertilizer-management-village',
                  component: '@/pages/agricultureSubsidies/formulaFertilizerManageVillage',
                },
                {
                  name: '实名制购肥管理',
                  icon: 'smile',
                  path: 'buy-fertilizer',
                  component: '@/pages/agricultureSubsidies/buyFertilizer',
                },
                {
                  name: '身份验证成功',
                  icon: 'smile',
                  path: 'identity-verified',
                  component: '@/pages/agricultureSubsidies/IdentityVerified',
                },
                {
                  name: '地块信息',
                  icon: 'smile',
                  path: 'farmland-map',
                  component: '@/pages/agricultureSubsidies/farmlandMap',
                },
                {
                  name: '反馈管理',
                  icon: 'smile',
                  path: 'feedbacks',
                  component: '@/pages/agricultureSubsidies/feedbacks',
                },
                {
                  name: '添加补贴标准',
                  icon: 'smile',
                  path: 'subsidy-standards',
                  component: '@/pages/agricultureSubsidies/subsidyStandards',
                },
                {
                  name: '农户管理',
                  icon: 'smile',
                  path: 'entity-management',
                  component: '@/pages/agricultureSubsidies/entityManagement',
                },
                {
                  name: '允许申报人员管理',
                  icon: 'smile',
                  path: 'prospect-management',
                  component: '@/pages/agricultureSubsidies/eligibleList',
                },
                {
                  name: '政策发布',
                  icon: 'smile',
                  path: 'announcements',
                  component: '@/pages/agricultureSubsidies/announcements',
                },
                {
                  name: '公示文件发布',
                  icon: 'smile',
                  path: 'posted-items',
                  component: '@/pages/agricultureSubsidies/announcements/posted-files',
                },
                {
                  name: '数据统计',
                  icon: 'smile',
                  path: 'stats',
                  component: '@/pages/agricultureSubsidies/stats/preIndex',
                },
                {
                  name: '土地流转',
                  icon: 'smile',
                  path: 'landCirculation',
                  component: '@/pages/agricultureSubsidies/landCirculation',
                },
                // {
                //   name: '土地流转详情',
                //   icon: 'smile',
                //   path: 'landCirculationDetail',
                //   component: '@/pages/agricultureSubsidies/landCirculationDetail',
                // },
                {
                  name: '农机购置',
                  icon: 'smile',
                  path: 'farmMachinery',
                  component: '@/pages/agricultureSubsidies/farmMachinery'
                },
                {
                  name: '一次性补贴',
                  icon: 'smile',
                  path: 'singleSubsidy',
                  component: '@/pages/agricultureSubsidies/singleSubsidy'
                }
              ],
            },
            {
              name: '资讯公告',
              icon: 'smile',
              path: '/news-releases/announcements',
              component: '@/pages/announcements',
            },
            {
              name: '劳务管理', // ☭☭☭
              icon: 'smile',
              path: '/workManagement',
              component: '@/pages/workManagement',
            },
            {
              name: '党建管理', // ☭☭☭
              icon: 'smile',
              path: '/partyOrganization',
              routes: [
                {
                  name: '党员先锋指数',
                  icon: 'smile',
                  path: 'member-evaluation',
                  component: '@/pages/partyOrganization/MemberEvaluation',
                },
                {
                  name: '建党周年',
                  icon: 'smile',
                  path: 'anniversary',
                  component: '@/pages/partyOrganization/Anniversary',
                },
              ],
            },
            {
              name: '我的家园',
              icon: 'smile',
              path: '/my-hometown',
              component: '@/pages/myHometown',
            },
            {
              name: '全域秀美检查',
              icon: 'smile',
              path: '/environmental-inspections',
              component: '@/pages/environmentalInspections',
            },
            {
              name: '农机管理',
              icon: 'smile',
              path: '/machine-management',
              component: '@/pages/machineManagement',
            },
            {
              name: '家宴中心',
              icon: 'smile',
              path: '/partyCenter',
              component: '@/pages/partyCenter'
            },
            {
              name: '村级证明',
              icon: 'smile',
              path: '/proveTemplate',
              component: '@/pages/proveTemplate'
            },
            {
              name: '文件上传',
              icon: 'smile',
              path: '/filesUpload',
              component: '@/pages/settings/filesUpload'
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'pre'],
  // proxy:proxy['dev'],
  manifest: {
    basePath: '/',
  },
  scripts: [
    'https://wsnbh-img.hzanchu.com/acfile/f4af193bc80aa24c07680face720fd17.js',
    'https://wsnbh-img.hzanchu.com/acfile/8eb571850e6d50ac21e204af643f81c0.js',
  ],
});
