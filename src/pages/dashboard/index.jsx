import React, { Component } from 'react';
import {
  Card, message, Select, Table, DatePicker, Space, Cascader, Pagination, Button
} from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, MenuFoldOutlined } from '@ant-design/icons';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
// 饼图
import 'echarts/lib/chart/pie';
import Cookies from 'js-cookie';
import { getIndexStatistics, getIndexZigzag, integralList } from '@/services/home';
import { getAreaList } from '@/services/system';
import styles from './index.less';
import { timeSelect } from './data.js';
import ThreeThingOpenCity from './components/threeThingsOpen';
import StatisticsByItem from './components/statisticsByItem';
import StatisticsActivities from './components/statisticsActivities';
import HouseHoldStatistics from './components/householdStatistics';
import WelfareStatistics from './components/welfareStatistics';
import ButtonAuth from '@/components/ButtonAuth';
import ExportModal from './components/eportModal';
import { formatArea } from "@/utils/utils";

const echarts = require('echarts/lib/echarts');

const { Option } = Select;

const activeUserChartConfig = {
  title: {
    text: '用户活跃数变化趋势',
    left: '2%',
    top: '2%',
    textStyle: {
      color: '#3c3c3c',
      fontSize: 14,
    },
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '5%',
    top: '25%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: '(人)',
      axisLabel: {
        formatter: '{value}',
      },
      minInterval: 1,
    },
  ],
  series: [
    {
      name: '用户人数',
      type: 'line',
      itemStyle: {
        normal: {
          color: '#2E95F4',
          lineStyle: {
            color: '#2E95F4',
          },
        },
      },
      data: [],
    },
  ],
};

const pointChartConfig = {
  title: {
    text: '善治分获得趋势',
    left: '2%',
    top: '2%',
    textStyle: {
      color: '#3c3c3c',
      fontSize: 14,
    },
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '5%',
    top: '25%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: '(分)',
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],
  series: [
    {
      name: '善治分总数',
      type: 'line',
      itemStyle: {
        normal: {
          color: '#65C5B4',
          lineStyle: {
            color: '#65C5B4',
          },
        },
      },
      data: [],
    },
  ],
};

class DashBoard extends Component {
  constructor(props) {
    super(props);
    const fullYear = new Date().getFullYear(); const arrYear = []; const
      arrMonth = [];
    for (let i = 0; i < 30; i++) {
      arrYear.push({ name: `${fullYear - i}年`, value: fullYear - i, label: `${fullYear - i}年` });
    }
    for (let i = 1; i <= 12; i++) {
      arrMonth.push({ name: `${i}月`, value: i, label: `${i}月` });
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo?.role_id === 2) {
      userInfo.city_id = 0;
    }
    const { city_id, town_id, village_id } = userInfo;
    let levelStatus = 0;
    if ((city_id == 0 && town_id == 0 && village_id == 0) || (city_id == 1 && town_id == 0 && village_id == 0)) {
      // 市级管理员
      levelStatus = 1;
    } else if (town_id > 0 && village_id == 0) {
      // 镇级管理员
      levelStatus = 2;
    } else if (village_id > 0) {
      // 村级管理员
      levelStatus = 3;
    }
    this.state = {
      cardList: [],
      dateList: [],
      customerData: [],
      scoreData: [],
      masterData: [],
      supplyData: [],
      villageList: [],
      areaList: [],
      cur_cityId: 0,
      cur_townId: 0,
      cur_villageId: 0,
      // 1是市，2是镇，3是村
      levelStatus,
      userInfo: '',
      showModal: false,
      columns: [
        {
          title: '家庭ID',
          dataIndex: 'family_id',
          key: 'family_id',
        },
        {
          title: '家庭户主',
          dataIndex: 'owner_name',
          key: 'owner_name',
        },
        {
          title: '所属地区',
          dataIndex: 'area',
          key: 'area',
        },
        {
          title: '总积分',
          dataIndex: 'integral',
          key: 'integral',
        },
      ],
      data: [],
      pagination: {
        current: 1,
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 50,
      },
      year: 0,
      yearList: arrYear,
      monthList: arrMonth,
      userChartSelectedYear: (new Date()).getFullYear(),
      userChartSelectedMonth: (new Date()).getMonth() + 1,
      pointChartSelectedYear: (new Date()).getFullYear(),
      pointChartSelectedMonth: (new Date()).getMonth() + 1,
    };
    this.handleUserChartYearChange = this.handleUserChartYearChange.bind(this);
    this.handleUserChartMonthChange = this.handleUserChartMonthChange.bind(this);
    this.handlePointChartYearChange = this.handlePointChartYearChange.bind(this);
    this.handlePointChartMonthChange = this.handlePointChartMonthChange.bind(this);
    this.changeVillage = this.changeVillage.bind(this);
  }

  componentDidMount() {
    const user = localStorage.getItem('userInfo');
    const userInfo = JSON.parse(user);
    if(userInfo?.role_id === 2) {
      userInfo.city_id = 0;
    }
    this.setState({
      cur_cityId: userInfo.city_id,
      cur_townId: userInfo.town_id,
      cur_villageId: userInfo.village_id,
      userInfo: userInfo
    }, () => {
      this.getDataContent();
      this.getZigZag();
      this.getIntegralList(0, 1);
      this.getVillageList();
    });
  }

  // 获取数据
  getDataContent() {
    getIndexStatistics({
      city_id: this.state.cur_cityId,
      town_id: this.state.cur_townId,
      village_id: this.state.cur_villageId,
    }).then((res) => {
      if (res.code === 0) {
        const _data = res.data;
        const _cardListData = [
          {
            title: '总录入家庭',
            count: _data.total_family.total,
            distance: _data.total_family.newly,
            countUnit: '户',
            backImg: 'https://img.hzanchu.com/acimg/329925b374a32053aee35df706282ff5.png?x-oss-process=image/resize,l_300',
          },
          {
            title: '总关联家庭',
            count: _data.active_family.total,
            distance: _data.active_family.newly,
            countUnit: '户',
            backImg: 'https://img.hzanchu.com/acimg/074fdf4da59e0866a90acf2e13d40b74.png?x-oss-process=image/resize,l_300',
          },
          {
            title: '总注册人数',
            count: _data.total_user.total,
            distance: _data.total_user.newly,
            countUnit: '人',
            backImg: 'https://img.hzanchu.com/acimg/71b785672a4838f7abe3b997fd1c80b3.png?x-oss-process=image/resize,l_300',
          },
          {
            title: '总积分',
            count: _data.total_integral.total,
            distance: _data.total_integral.newly,
            countUnit: '分',
            backImg: 'https://img.hzanchu.com/acimg/2ac8be194c5d0f5c49e1595ced6fdc21.png?x-oss-process=image/resize,l_300',
          },
        ];

        this.setState({
          cardList: _cardListData,
        });
      } else {
        message.error(res.msg);
      }
    });
  }

  // 获取图标数据
  getZigZag() {
    const activeUserChart = echarts.init(document.getElementById('active-user-chart'));
    const pointChart = echarts.init(document.getElementById('point-chart'));
    const {
      userChartSelectedMonth, userChartSelectedYear, pointChartSelectedMonth, pointChartSelectedYear,
    } = this.state;
    getIndexZigzag({
      user_date: userChartSelectedMonth ? `${userChartSelectedYear}-${userChartSelectedMonth.toString().padStart(2, '0')}` : userChartSelectedYear.toString(),
      integral_date: pointChartSelectedMonth ? `${pointChartSelectedYear}-${pointChartSelectedMonth.toString().padStart(2, '0')}` : pointChartSelectedYear.toString(),
      city_id: this.state.cur_cityId,
      town_id: this.state.cur_townId,
      village_id: this.state.cur_villageId,
    }).then((res) => {
      if (res.code === 0) {
        const { data } = res;
        function filterData(selectedYear, selectedMonth, sourceData) {
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;
          const currentDate = new Date().getDate();
          const daysInSelectedMonth = new Date(selectedYear, selectedMonth, 0).getDate();
          const xAxis = [...Array(selectedMonth ? daysInSelectedMonth : 12).keys()].map((e) => (selectedMonth ? `${e + 1}日` : `${e + 1}月`));
          const yAxis = sourceData.slice(0, xAxis.length).map((e, i) => {
            if (selectedMonth) {
              if (new Date(currentYear, currentMonth) < new Date(selectedYear, selectedMonth)) {
                return null;
              } if (currentYear === selectedYear && currentMonth === selectedMonth) {
                return i < currentDate ? e : null;
              }
              return e;
            }
            if (new Date(currentYear) < new Date(selectedYear)) {
              return null;
            } if (currentYear === selectedYear) {
              return i < currentMonth - 1 ? e : null;
            } return e;
          });
          return [xAxis, yAxis];
        }
        if (userChartSelectedMonth && data.broken_users) {

          activeUserChartConfig.title.text = '用户活跃数变化趋势' + '\u00A0\u00A0\u00A0' + '月总活跃数：' + this.getSum(data.broken_users) + '(人)';
        } else {
          activeUserChartConfig.title.text = '用户活跃数变化趋势';
        }
        [activeUserChartConfig.xAxis[0].data, activeUserChartConfig.series[0].data] = filterData(userChartSelectedYear, userChartSelectedMonth, data.broken_users);
        [pointChartConfig.xAxis[0].data, pointChartConfig.series[0].data] = filterData(pointChartSelectedYear, pointChartSelectedMonth, data.broken_integral);
        activeUserChart.setOption({
          ...activeUserChartConfig,
        });
        pointChart.setOption({
          ...pointChartConfig,
        });
      } else {
        message.error(res.msg);
      }
    });

    window.addEventListener('resize', () => {
      setTimeout(() => {
        activeUserChart.resize();
        pointChart.resize();
      }, 200);
    });
  }

  getSum(array) {
    let sum = 0;
    array.map(item => {
      sum += +item;
    });
   return sum
  }

  getVillageList() {
    getAreaList({}).then((r) => {
      if (r.code === 0) {
        this.setState({
          villageList: this.setDisable(r.data),
        })
        let arr = r.data;
        if(this.state.userInfo.role_type === 1 || this.state.userInfo.role_type === 2) {
          arr = [{value: 0, city_id: 0, city_name: "全部", label: "全部", children: []}].concat(r.data);
        }
        this.setState({
          areaList: this.setDisable(arr),
        });
      }
    });
  }

  // 设置disable
  setDisable(options) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      const { town_id, role_type } = userInfo;
      if (role_type > 3) {
        options.map((item) => {
          item.children.map((items) => {
            if (items.town_id !== town_id) {
              items.disabled = true;
            }
          });
        });
        options = options[0].children;
      }
    }
    return options;
  }

  chagePage = (e) => {
    this.getIntegralList(this.state.year, e.current);
  }

  changeYear = (date, dateString) => {
    this.setState({
      year: dateString,
    });
    this.getIntegralList(dateString, this.state.pagination.current);
  }

  // 获取家庭及分排行数据
  getIntegralList(year, page) {
    integralList({
      year,
      page,
      city_id: this.state.cur_cityId,
      town_id: this.state.cur_townId,
      village_id: this.state.cur_villageId,
    }).then((r) => {
      if (r.code === 0) {
        const pageValue = {
          current: r.data.current_page,
          defaultCurrent: 1,
          defaultPageSize: 10,
          total: r.data.total,
        };
        r.data.data.map((item) => {
          item.key = item.owner_name;
        });
        this.setState({
          data: r.data.data,
          pagination: pageValue,
        });
      }
    });
  }

  handleUserChartYearChange(value) {
    this.setState({
      userChartSelectedYear: value,
    }, () => {
      this.getZigZag();
    });
  }

  handleUserChartMonthChange(value) {
    this.setState({
      userChartSelectedMonth: value,
    }, () => {
      this.getZigZag();
    });
  }

  handlePointChartYearChange(value) {
    this.setState({
      pointChartSelectedYear: value,
    }, () => {
      this.getZigZag();
    });
  }

  handlePointChartMonthChange(value) {
    this.setState({
      pointChartSelectedMonth: value,
    }, () => {
      this.getZigZag();
    });
  }

  changeVillage(e) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const { role_type } = userInfo;
    this.setState({
      cur_cityId: role_type > 3 ? 0 : e[0],
      cur_townId: role_type > 3 ? e[0] : e[1],
      cur_villageId: role_type > 3 ? e[1] : e[2],
    }, () => {
      this.getDataContent();
      this.getZigZag();
      this.getIntegralList(0, 1);
    });
  }

  handleHideModel() {
    console.log(1111)
    this.setState({
      showModal: false
    })
  }

  handleShowModal() {
    this.setState({
      showModal: true
    })
  }

  render() {
    const {
      cardList,
      columns,
      data,
      villageList,
      areaList,
      pagination,
      cur_cityId,
      cur_townId,
      cur_villageId,
      yearList,
      monthList,
      levelStatus,
      showModal
    } = this.state;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo?.role_id === 2) {
      userInfo.city_id = 0;
    }

    return (
      <div>
        {
          userInfo && userInfo?.role_id != 3 ? (
            <div className={styles.selectVillage}>
              <span>选择村查看：</span>
              <Cascader
                options={areaList}
                onChange={this.changeVillage}
                placeholder="请选择"
                changeOnSelect
                allowClear={false}
                defaultValue={userInfo?.role_id > 3 ? [userInfo.town_id, userInfo.village_id] : formatArea([userInfo.city_id, userInfo.town_id, userInfo.village_id])}
              />
            </div>
          ) : ''
        }
        <ButtonAuth type="EXPORT">
          <Button className={styles.exportButton} icon={<MenuFoldOutlined />} onClick={this.handleShowModal.bind(this)}>增长数据导出</Button>
        </ButtonAuth>

        {
          showModal ? <ExportModal showModal={showModal} hideModal={this.handleHideModel.bind(this)} /> : null
        }

        <ul className={styles.titleHead}>
          {
          cardList.map((item, index) => (
            <li key={index}>
              <Card
                className={styles.cardItem}
                style={{
                  backgroundImage: `url(${item.backImg})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              >
                <p className={styles.cardTitle}>
                  <span>{item.title}</span>
                  <span>{` · 较昨日${item.distance >= 0 ? '+' : ''}${item.distance}`}</span>
                  {
                    item.distance >= 0
                      ? <ArrowUpOutlined className={styles.topIcon} />
                      : <ArrowDownOutlined className={styles.bottomIcon} />
                  }
                </p>
                <h1>
                  {item.count}
                  <span>{item.countUnit}</span>
                </h1>
              </Card>
            </li>
          ))
        }
        </ul>
        {/* 用户数据 */}
        <div className={styles.echartsBox}>
          <div className={styles.echartsItem}>
            <div id="active-user-chart" style={{ width: '100%', height: '100%' }} />
            <div className={styles.timePicker}>
              <Select
                value={this.state.userChartSelectedMonth}
                className={styles.monthPicker}
                onChange={this.handleUserChartMonthChange}
                options={[{ label: '-', value: 0 }, ...monthList]}
              />
              <Select
                value={this.state.userChartSelectedYear}
                className={styles.yearPicker}
                onChange={this.handleUserChartYearChange}
                options={this.state.yearList}
              />
            </div>
          </div>
          <div className={styles.echartsItem}>
            <div id="point-chart" style={{ width: '100%', height: '100%' }} />
            <div className={styles.timePicker}>
              <Select
                value={this.state.pointChartSelectedMonth}
                className={styles.monthPicker}
                onChange={this.handlePointChartMonthChange}
                options={[{ label: '-', value: 0 }, ...monthList]}
              />
              <Select
                value={this.state.pointChartSelectedYear}
                className={styles.yearPicker}
                onChange={this.handlePointChartYearChange}
                options={this.state.yearList}
              />
            </div>
          </div>
        </div>
        {/* 打分项分析 */}
        {
          villageList.length > 0
            ? <StatisticsByItem villageList={villageList} levelStatus={levelStatus} yearList={yearList} /> : ''
        }
        {/* 家庭股份积分分析 */}
        {
          villageList.length > 0
            ? <HouseHoldStatistics villageList={villageList} levelStatus={levelStatus} yearList={yearList} /> : ''
        }
        {/* 三务公开 */}
        {
          villageList.length > 0
            ? <ThreeThingOpenCity villageList={villageList} levelStatus={levelStatus} yearList={yearList} monthList={monthList} /> : ''
        }
        {/* 志愿者活动分析 */}
        {
          villageList.length > 0 ? <StatisticsActivities levelStatus={levelStatus} villageList={villageList} yearList={yearList} monthList={monthList} /> : ''
        }
        {/* 福利兑换分析 */}
        {
          villageList.length > 0 && levelStatus == 1
            ? <WelfareStatistics villageList={villageList} yearList={yearList} /> : ''
        }
      </div>
    );
  }

  componentWillUnmount() {
    localStorage.setItem('urlList', JSON.stringify([]));
  }
}

export default DashBoard;
