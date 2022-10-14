import React from 'react';
import { Cascader, Select, Button, Divider, message } from 'antd';
import styles from '../index.less';
import PiePicture from './piePicture';
import BarPicture from './barPicture';
import TableModal from './tableModal';
import { activityStat, exportReport } from '@/services/dataCenter';
import { fileDownload } from '@/utils/utils'

const echarts = require('echarts/lib/echarts');
const { Option } = Select;
export default class StatisticsActivities extends React.Component {
  constructor(props) {
    super(props);
    const { villageList, yearList, monthList, levelStatus } = props;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      villageList,
      yearList,
      monthList,
      levelStatus,
      oneBarOption: {
        legend: null,
        title: '平湖各街道志愿者活动发布数量',
        xAxisName: '街道',
        xAxisData: [],
        yAxisName: '发布数量',
        grid: {
          left: '10%',
          right: '10%',
        },
        series: [
          {
            barMaxWidth: 25,
            data: [],
            itemStyle: {
              color: 'rgba(0,158,217)'
            },
            label: {
              show: true,
              formatter: '{@value}',
              fontSize: 14,
              position: 'top',	//在上方显示
              textStyle: {	    //数值样式
                color: '#3c3c3c',
                fontSize: 12
              }
            },
            type: 'bar',
            animation: false,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#FFB155' },
                  { offset: 0.5, color: '#FAD095' },
                  { offset: 1, color: '#ffffff' }
                ]
              )
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#FFB155' },
                    { offset: 0.5, color: '#FAD095' },
                    { offset: 1, color: '#ffffff' }
                  ]
                )
              }
            },
          }
        ],
        colorIndex: ['r6']
      },
      onePieOption: {
        title: '平湖各村志愿者活动发布数量前十',
        legendBottom: 50,
        legendData: [],
        seriesName: '数量',
        seriesData: [],
        radius: '45%',
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   return `${val.seriesName}:${val.data.value}\n占比:${val.percent}%`
        // },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      twoBarOption: {
        legend: null,
        title: '',
        xAxisName: '村',
        grid: {
          left: '2%',
          right: '5%',
          top: '25%',
          bottom: '5%',
          containLabel: true
        },
        xAxisData: [],
        yAxisName: '发布数量',
        series: [
          {
            barWidth: 25,
            data: [],
            itemStyle: {
              color: 'rgba(0,158,217)'
            },
            label: {
              show: true,
              formatter: '{@value}',
              fontSize: 14,
              position: 'top',	//在上方显示
              textStyle: {	    //数值样式
                color: '#3c3c3c',
                fontSize: 12
              }
            },
            type: 'bar',
            animation: false,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#48C1B7' },
                  { offset: 0.5, color: '#9BDDD6' },
                  { offset: 1, color: '#ffffff' }
                ]
              )
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#48C1B7' },
                    { offset: 0.5, color: '#9BDDD6' },
                    { offset: 1, color: '#ffffff' }
                  ]
                )
              }
            },
          }
        ],
        colorIndex: ['r7']
      },
      twoPieOption: {
        title: '志愿者参与人数前五排名统计',
        legendBottom: 80,
        legendData: [],
        seriesName: '活动',
        seriesData: [],
        radius: '45%',
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   if (val.name == '其他') {
        //     return `其他活动\n参与人数:${val.data.value}\n占比:${val.percent}%`
        //   }
        //   return `${val.seriesName}:${val.data.name.length > 4 ? val.data.name.slice(0, 4) + '...' : val.data.name}\n参与人数:${val.data.value}\n分值:${val.data.score}\n占比:${val.percent}%`
        // },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      threePieOption: {
        title: '志愿者活动热度人数前五排名统计',
        legendBottom: 80,
        legendData: [],
        seriesName: '活动',
        seriesData: [],
        radius: '45%',
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   if (val.name == '其他') {
        //     return `其他活动\n参与人数:${val.data.value}\n占比:${val.percent}%`
        //   }
        //   return `${val.seriesName}:${val.data.name.length > 4 ? val.data.name.slice(0, 4) + '...' : val.data.name}\n查看人数:${val.data.value}\n分值:${val.data.score}\n占比:${val.percent}%`
        // },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      fourPieOption: {
        title: '各街道志愿者活动参与人数',
        legendBottom: 80,
        legendData: [],
        seriesName: '活动',
        seriesData: [],
        radius: '45%',
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        },
        formatter: function (val) {
          if (val.value == 0) {
            return '';
          }
          return `参与人数:${val.data.users}<br/>街道:${val.data.town_name}<br/>占比:${val.percent}%`
        },
      },
      modalConfig: {
        visible: false,
        type: 4,
        title: '平湖各村志愿者活动发布数量村排名'
      },
      city: userInfo.city_id == 0 ? 1 : userInfo.city_id,
      town: userInfo.town_id,
      village: userInfo.village_id,
      yearVal: (new Date()).getFullYear(),
      monthVal: undefined,
      townName: '当湖',
      villageName: '通界',
      total_apply: 0
    };
  }
  componentDidMount() {
    this.getActivityInfo();
  }
  getActivityInfo() {
    const { city, town, village, yearVal, monthVal } = this.state;
    let dataCity = { city_id: city, town_id: town, village_id: village, y: yearVal, m: monthVal };
    this.getActivityList(dataCity);
  }
  getActivityList(data) {
    activityStat(data).then(res => {
      if (res.code == 0) {
        let total_apply = 0;
        let { oneBarOption, onePieOption, twoBarOption, twoPieOption, threePieOption, fourPieOption } = this.state;
        //  志愿者活动发布数量村排名饼图
        if (res.data.village_activities.length > 0) {
          var arr = [], arr2 = [];
          res.data.village_activities.map(item => {
            arr.push(item.village_name);
            arr2.push(item.c);
          });
          twoBarOption.xAxisData = arr;
          twoBarOption.series[0].data = arr2;
          twoBarOption.title = res.data.town_name + '各村志愿者活动发布数量';
        } else {
          twoBarOption.xAxisData = [];
          twoBarOption.series[0].data = [];
        }
        if (res.data.town_activities.length > 0) {
          var arr = [], arr2 = [];
          res.data.town_activities.map(item => {
            arr.push(item.town_name);
            arr2.push(item.c);
          });
          oneBarOption.xAxisData = arr;
          oneBarOption.series[0].data = arr2;
        } else {
          oneBarOption.xAxisData = [];
          oneBarOption.series[0].data = [];
        }
        if (res.data.ten_village_activities.length > 0) {
          var arr = [];
          res.data.ten_village_activities.map(item => {
            item.name = item.village_name;
            item.value = item.c;
            arr.push(item.village_name);
          });
          onePieOption.legendData = arr;
          onePieOption.seriesData = res.data.ten_village_activities;
        } else {
          onePieOption.legendData = [];
          onePieOption.seriesData = [];
        }
        if (JSON.stringify(res.data.town_apply_stat) != '{}' && JSON.stringify(res.data.town_apply_stat) != '[]') {
          var arr = [];
          res.data.town_apply_stat.percent.map(item => {
            item.name = item.town_name;
            item.value = item.users;
            arr.push(item.town_name);
          });
          fourPieOption.legendData = arr;
          fourPieOption.seriesData = res.data.town_apply_stat.percent;
          total_apply = res.data.town_apply_stat.total;
        } else {
          fourPieOption.legendData = [];
          fourPieOption.seriesData = [];
        }
        if (res.data.users.length > 0) {
          var arr = [];
          res.data.users.map(item => {
            item.name = item.activity_name;
            item.value = item.users;
            arr.push(item.activity_name);
          });
          twoPieOption.legendData = arr;
          twoPieOption.seriesData = res.data.users;
        } else {
          twoPieOption.legendData = [];
          twoPieOption.seriesData = [];
        }
        if (res.data.views.length > 0) {
          var arr = [];
          res.data.views.map(item => {
            item.name = item.activity_name;
            item.value = item.allviews;
            arr.push(item.activity_name);
          });
          threePieOption.legendData = arr;
          threePieOption.seriesData = res.data.views;
        } else {
          threePieOption.legendData = [];
          threePieOption.seriesData = [];
        }
        this.setState({
          oneBarOption,
          onePieOption,
          twoBarOption,
          twoPieOption,
          threePieOption,
          fourPieOption,
          total_apply: total_apply,
          townName: res.data.town_name,
          villageName: res.data.village_name
        });
      }
    })
  }
  handleHideModal() {
    let modalConfig = this.state.modalConfig;
    modalConfig.visible = false;
    this.setState({
      modalConfig
    });
  }
  handleModalConfig(type) {
    let modalConfig = {
      visible: true,
      type,
      title: type == 4 ? '平湖各村志愿者活动发布数量村排名' : type == 9 ? '志愿活动参与人数排名' : type == 10 ? '志愿活动热度人数排名' : '',
      data: {
        city: this.state.city,
        town: this.state.town,
        village: this.state.village
      }
    };
    this.setState({
      modalConfig
    });
  }
  handleChangeYear(e) {
    this.setState({
      yearVal: e || (new Date()).getFullYear()
    }, () => {
      this.getActivityInfo();
    });
  }
  handleChanegMonth(e) {
    this.setState({
      monthVal: e
    }, () => {
      this.getActivityInfo();
    });
  }
  handleChangeVillage(e) {
    const { levelStatus } = this.state;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let town = userInfo.town_id, village = userInfo.village_id;
    if (levelStatus == 1) {
      town = e[1] || town;
      village = e[2] || village;
    } else {
      town = e[0] || town;
      village = e[1] || village;
    }
    this.setState({
      city: 1,
      town,
      village
    }, () => {
      this.getActivityInfo();
    });
  }
  cityExport(urlList) {
    const { oneBarOption, yearVal, onePieOption, fourPieOption } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'activeBar1') {
        let tableList = [['乡镇名称', '发布数量']];
        oneBarOption.xAxisData.map((item, index) => {
          tableList.push([item, oneBarOption.series[0].data[index]])
        });
        lists.push({
          title: '各村对比',
          image: {
            url: item.url,
            desc: `平湖各村志愿者活动发布数量前十(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'activePie1') {
        let tableList = [['排名', '颜色标识', '村名称', '参与人数', '占比']];
        let total = 0;
        onePieOption.seriesData.map(item => {
          total += item.c;
        });
        onePieOption.seriesData.map((item, index) => {
          tableList.push([index + 1, onePieOption.colorIndex[index], item.village_name, item.c, total==0?'0':((item.c / total) * 100).toFixed(2) + '%'])
        });
        lists.push({
          title: '各村对比',
          image: {
            url: item.url,
            desc: `平湖各村志愿者活动发布数量前十排名(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'activePie8') {
        let tableList = [['颜色标识', '乡镇名称', '参与人数', '占比']];
        let total = 0;
        fourPieOption.seriesData.map(item => {
          total += item.users;
        });
        fourPieOption.seriesData.map((item, index) => {
          tableList.push([fourPieOption.colorIndex[index], item.town_name, item.users, total==0?'0':((item.users / total) * 100).toFixed(2) + '%'])
        });
        lists.push({
          title: '各乡镇对比',
          image: {
            url: item.url,
            desc: `各乡镇志愿者活动参与人数(${yearVal})`
          },
          table: tableList
        });
      }
    });
    return lists;
  }
  townExport(urlList) {
    const { twoBarOption } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'activeBar2') {
        let tableList = [['村名称', '活动发布数量']];
        twoBarOption.xAxisData.map((item, index) => {
          tableList.push([item, twoBarOption.series[0].data[index]])
        });
        lists.push({
          title: '各村志愿者活动发布数量统计',
          image: {
            url: item.url,
            desc: ''
          },
          table: tableList
        });
      }
    })
    return lists;
  }
  villageExport(urlList) {
    const { twoPieOption, yearVal, threePieOption,villageName } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'activePie2') {
        let tableList = [['排名', '颜色标识', '活动名称', '参与人数', '占比']];
        let total = 0;
        twoPieOption.seriesData.map(item => {
          total += parseFloat(item.users);
        });
        twoPieOption.seriesData.map((item, index) => {
          tableList.push([index + 1, twoPieOption.colorIndex[index], item.activity_name, item.users, total==0?'0':((item.users / total) * 100).toFixed(2) + '%'])
        });
        lists.push({
          title: villageName + '志愿者参与人数对比',
          image: {
            url: item.url,
            desc: `志愿者参与人数前五排名统计(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'activePie3') {
        let tableList = [['排名', '颜色标识', '活动名称', '参与人数', '占比']];
        let total = 0;
        threePieOption.seriesData.map(item => {
          total += parseFloat(item.value);
        });
        threePieOption.seriesData.map((item, index) => {
          tableList.push([index + 1, threePieOption.colorIndex[index], item.activity_name, item.value, total==0?'0':((item.value / total) * 100).toFixed(2) + '%'])
        });
        lists.push({
          title: villageName + '志愿者热度对比',
          image: {
            url: item.url,
            desc: `志愿者活动热度人数前五排名统计(${yearVal})`
          },
          table: tableList,
        });
      }
    })
    return lists;
  }
  handleExportReport() {
    let urlList = JSON.parse(localStorage.getItem('urlList'));
    const { levelStatus, city, yearVal, town, village, townName, villageName, twoBarOption, oneBarOption, onePieOption, fourPieOption, twoPieOption, threePieOption } = this.state;
    let obj = {
      modules: {
        title: '志愿者活动分析',
        city: {
          area: '平湖市',
          lists: []
        },
        town: {
          area: townName,
          lists: []
        },
        village: {
          area: villageName,
          lists: []
        }
      }
    };
    // 市级别
    if (levelStatus == 1) {
      obj.modules.city.lists = this.cityExport(urlList);
      if (village > 0) {
        obj.modules.village.lists = this.villageExport(urlList);
      }
      if (town > 0) {
        obj.modules.town.lists = this.townExport(urlList);
      }
    } else if (levelStatus == 2) {
      obj.modules.town.lists = this.townExport(urlList);
      if (village > 0) {
        obj.modules.village.lists = this.villageExport(urlList);
      }
    } else if (levelStatus == 3) {
      obj.modules.village.lists = this.villageExport(urlList);
    }
    // let data = {
    //   title: '志愿者活动统计',
    //   desc: '',
    //   images: arr
    // };
    exportReport(obj).then(res => {
      fileDownload(res, '志愿者活动统计')
    })
    // message.info('即将开放，敬请期待！')
  }
  render() {
    const {
      modalConfig,
      levelStatus,
      villageList,
      yearList,
      monthList,
      oneBarOption,
      twoBarOption,
      onePieOption,
      twoPieOption,
      fourPieOption,
      townName,
      villageName,
      threePieOption, yearVal, city, town, village, total_apply } = this.state;
    return (
      <div className={styles.threeStatic}>
        <div className={styles.staticTop}>
          {/* <span className={styles.staticLabel}>志愿者活动统计</span> */}
          <img src="https://img.hzanchu.com/acimg/7d2e02ebd2feb0700c9750c7d96726cb.png" alt="" />
          {/* 条件筛选 */}
          <div className={styles.staticSelect}>
            <div className={styles.selectLeft}>
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>地区筛选：</span>
                {
                  levelStatus == 3 ? villageName :
                    <Cascader className={styles.selectInfo} options={villageList} onChange={this.handleChangeVillage.bind(this)} changeOnSelect placeholder="请选择所属地区" />
                }
              </div>
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>年份筛选：</span>
                <Select className={styles.selectInfo1} value={yearVal} allowClear onChange={this.handleChangeYear.bind(this)} placeholder="请选择年份">
                  {
                    yearList.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)
                  }
                </Select>
              </div>
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>月份筛选：</span>
                <Select className={styles.selectInfo1} allowClear onChange={this.handleChanegMonth.bind(this)} placeholder="请选择月份">
                  {
                    monthList.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                  }
                </Select>
              </div>
            </div>
          </div>
          {/* <a className={styles.staticTable} onClick={this.handleExportReport.bind(this)}>生成报表</a> */}
          <Button type="dashed" style={{ margin: '0 20px 0 auto' }} onClick={this.handleExportReport.bind(this)}>生成报表</Button>
        </div>

        {
          levelStatus == 1 ? (
            <div className={styles.pieStreetPic}>
              <Divider orientation="left">市级层面：平湖市</Divider>
              <div className={styles.piePicture}>
                <div className={`${styles.pieItem}`}>
                  <BarPicture id="activeBar1" options={oneBarOption} />
                </div>
                <div className={`${styles.pieItem}`}>
                  <PiePicture id="activePie1" options={onePieOption} />
                  <span className={styles.moduleTitle}>各村情况对比</span>
                  <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 4)}>查看所有排名</a>
                </div>
                <div className={`${styles.pieItem}`}>
                  <PiePicture id="activePie8" options={fourPieOption} />
                  <span className={styles.moduleTitle}>各街道对比</span>
                  <span className={styles.pieLook}>平湖各乡镇参与人数总和：{total_apply}</span>
                </div>
              </div>
            </div>
          ) : null
        }
        {
          levelStatus == 1 ?
            (town > 0 ?
              <div className={styles.pieStreetPic}>
                <Divider orientation="left">镇级层面：{townName}</Divider>
                <div className={styles.piePicture}>
                  <div className={`${styles.pieItem} ${styles.pieItem100}`} >
                    <BarPicture id="activeBar2" options={twoBarOption} />
                  </div>
                </div>
              </div> :
              null) :
            levelStatus == 2 ?
              <div className={styles.piePicture}>
                <div className={`${styles.pieItem} ${styles.pieItem100}`} >
                  <BarPicture id="activeBar2" options={twoBarOption} />
                </div>
              </div> :
              null
        }
        {
          levelStatus != 3 ?
            (
              village > 0 ?
                <div className={styles.pieStreetPic}>
                  {/* <span className={styles.pieTitles}>{villageName}</span> */}
                  <Divider orientation="left">村级层面：{villageName}</Divider>
                  <div className={styles.piePicture}>
                    <div className={styles.pieItem}>
                      <PiePicture id="activePie2" options={twoPieOption} />
                      <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 9)}>查看所有排名</a>
                    </div>
                    <div className={styles.pieItem}>
                      <PiePicture id="activePie3" options={threePieOption} />
                      <div id="pieTwoVillageTj" style={{ width: '100%', height: '100%' }}></div>
                      <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 10)}>查看所有排名</a>
                    </div>
                  </div>
                </div> :
                null
            ) :
            <div className={styles.piePicture}>
              <div className={styles.pieItem}>
                <PiePicture id="activePie2" options={twoPieOption} />
                <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 9)}>查看所有排名</a>
              </div>
              <div className={styles.pieItem}>
                <PiePicture id="activePie3" options={threePieOption} />
                <div id="pieTwoVillageTj" style={{ width: '100%', height: '100%' }}></div>
                <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 10)}>查看所有排名</a>
              </div>
            </div>
        }
        {
          modalConfig.visible ? <TableModal modalConfig={modalConfig} villageList={villageList} hideModal={this.handleHideModal.bind(this)} /> : null
        }
      </div>
    )
  }
}
