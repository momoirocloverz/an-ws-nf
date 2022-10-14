import React from 'react';
import { Cascader, Select, Table, Pagination, Button, Divider, message } from 'antd';
import styles from '../index.less';
import PiePicture from './piePicture';
import BarPicture from './barPicture';
import TableModal from './tableModal';
const echarts = require('echarts/lib/echarts');
import { integralStat, integralList, exportReport } from '@/services/dataCenter';
import { fileDownload } from '@/utils/utils'

const { Option } = Select;
export default class StatisticsByItem extends React.Component {
  constructor(props) {
    super(props);
    const { villageList, yearList, levelStatus } = props;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      villageList,
      yearList,
      levelStatus,
      scoreColumns: [
        {
          key: 'index',
          dataIndex: 'index',
          title: '排名',
          width: '14.2vm',
          render: (text, record, index) => (<span>{index + 1}</span>),
        },
        {
          key: 'count',
          dataIndex: 'count',
          title: '累计打分次数',
          align: 'center',
          width: '14.2vm'
        },
        {
          key: 'proportion',
          dataIndex: 'proportion',
          title: '打分次数占比',
          align: 'center',
          width: '14.2vm'
        },
        {
          key: 'item_name',
          dataIndex: 'item_name',
          title: '打分名称',
          align: 'center',
          width: '14.2vm'
        },
        {
          key: 'area',
          dataIndex: 'area',
          title: '所属地区',
          align: 'center',
          width: '14.2vm'
        },
        {
          key: 'family_count',
          dataIndex: 'family_count',
          title: '参与家庭数',
          align: 'center',
          width: '14.2vm'
        },
        {
          key: 'integral',
          dataIndex: 'integral',
          title: '累计打分值',
          align: 'center',
          width: '14.2vm'
        }
      ],
      scoreSource: [],
      onePieOption: {
        title: '各街道打分值',
        legendBottom: 100,
        legendData: [],
        seriesName: '分值',
        seriesData: [],
        radius: ['30%', '45%'],
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   return `${val.seriesName}：${val.data.value}\n占比：${val.percent}%`
        // },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      twoPieOption: {
        title: '打分项数量统计',
        legendBottom: 150,
        legendData: [],
        seriesName: '打分项数量',
        seriesData: [],
        radius: '45%',
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   return `${val.seriesName}：${val.data.value}\n占比：${val.percent}%`
        // },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      threePieOption: {
        title: '各村打分值',
        legendBottom: 100,
        legendData: [],
        seriesName: '打分值',
        seriesData: [],
        radius: '45%',
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   return `${val.seriesName}：${val.data.value}\n占比：${val.percent}%`
        // },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      fourPieOption: {
        title: '各街道打分次数',
        legendBottom: 100,
        legendData: [],
        seriesName: '次数',
        seriesData: [],
        radius: ['30%', '45%'],
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      oneBarOption: {
        title: '',
        grid: {
          left: '2%',
          right: '8%',
          top: '25%',
          bottom: '5%',
          containLabel: true
        },
        legend: {
          data: ['第一', '第二', '第三'],
          selectedMode: false,
          right: 15,
          top: 6,
        },
        xAxisName: '打分项',
        xAxisData: ['村一', '村二', '村三'],
        yAxisName: '打分次数',
        series: [
          {
            barMaxWidth: 25,
            name: '第一',
            type: 'bar',
            data: []
          },
          {
            barMaxWidth: 25,
            name: '第二',
            type: 'bar',
            data: []
          },
          {
            barMaxWidth: 25,
            name: '第三',
            type: 'bar',
            data: []
          }
        ]
      },
      twoBarOption: {
        legend: null,
        title: '打分项累计打分值',
        grid: {
          left: '6%',
          right: '8%',
          top: '25%',
          bottom: '25%',
        },
        xAxisName: '名称',
        xAxisData: [],
        yAxisName: '打分值',
        series: [
          {
            barMaxWidth: 25,
            data: [],
            itemStyle: {
              color: 'rgba(0,158,217)'
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
      threeBarOption: {
        legend: null,
        title: '打分项累计打分次数',
        grid: {
          left: '6%',
          right: '8%',
          top: '25%',
          bottom: '25%',
        },
        xAxisName: '名称',
        xAxisData: [],
        yAxisName: '打分次数',
        series: [
          {
            barMaxWidth: 25,
            data: [],
            itemStyle: {
              color: 'rgba(0,158,217)'
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
      modalConfig: {
        visible: false,
        type: 3,
        title: '平湖各村打分项打分次数排名'
      },
      city: userInfo.city_id == 0 ? 1 : userInfo.city_id,
      town: userInfo.town_id,
      village: userInfo.village_id,
      yearVal: (new Date()).getFullYear(),
      townName: '当湖',
      villageName: '',
      total_point: 0,
      loading: true,
      total_count: 0
    }
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
      title: type == 3 ? `${this.state.villageName}村打分项打分次数排名` : '',
      data: {
        village: this.state.village
      }
    };
    this.setState({
      modalConfig
    });
  }
  componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo.role_type === 1 || userInfo.role_type === 2) {
      this.setState({
        city: 1,
        town: 1,
        village: 2
      }, () => {
        this.getIntegraStatList();
        if (this.state.levelStatus == 1) {
          this.getIntegralList();
        }
      });
    } else {
      this.getIntegraStatList();
      if (this.state.levelStatus == 1) {
        this.getIntegralList();
      }
    }
  }
  getIntegralList() {
    let data = {
      village_id: this.state.village,
      year: this.state.yearVal
    };
    integralList(data).then(res => {
      if (res.code == 0) {
        res.data.map(item => item.key = item.item_id);
        this.setState({
          loading: false,
          scoreSource: res.data
        });
      }
    })
  }
  getIntegraStatList() {
    const { city, town, village, yearVal, levelStatus } = this.state;
    if (levelStatus == 1) {
      // 市级别
      let data = { city_id: city, type: 1, year: yearVal };
      this.getIntegralStatInfo(data, 1);
      // 查看打分前十列表
      let dataTen = { village_id: village };
      this.getIntegralStatInfo(dataTen, 4);
      // 镇级别
      if (town > 0) {
        let dataTown = { town_id: town, type: 2, year: yearVal };
        this.getIntegralStatInfo(dataTown, 2);
      }
      // 村级别
      if (village > 0) {
        let dataVillage = { village_id: village, type: 3, year: yearVal };
        this.getIntegralStatInfo(dataVillage, 3);
      }
    } else if (levelStatus == 2) {
      // 镇级别
      let dataTown = { town_id: town, type: 2, year: yearVal };
      this.getIntegralStatInfo(dataTown, 2);
      // 村级别
      if (village > 0) {
        let dataVillage = { village_id: village, type: 3, year: yearVal };
        this.getIntegralStatInfo(dataVillage, 3);
      }
    } else {
      let dataVillage = { village_id: village, type: 3, year: yearVal };
      this.getIntegralStatInfo(dataVillage, 3);
    }
  }
  getIntegralStatInfo(data, type) {
    integralStat(data).then(res => {
      if (res.code == 0) {
        switch (type) {
          case 1:
            let { onePieOption, fourPieOption } = this.state;
            let pieVal = [];
            res.data.integral_sum.pie.map(item => {
              item.name = item.town_name;
              item.value = item.integral;
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
            });
            onePieOption.legendData = res.data.integral_sum.grid;
            onePieOption.seriesData = res.data.integral_sum.pie;

            res.data.integral_count.value.map((item, index) => {
              pieVal.push({
                name: res.data.integral_count.name[index],
                value: item
              });
            });
            fourPieOption.legendData = res.data.integral_count.name;
            fourPieOption.seriesData = pieVal;

            this.setState({
              onePieOption,
              fourPieOption,
              total_point: res.data.total_point,
              total_count: res.data.total_count
            });
            break;
          case 2:
            const { twoPieOption, threePieOption, oneBarOption } = this.state;
            res.data.integral_num.pie.map(item => {
              item.name = item.village_name;
              item.value = item.num;
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
              item.itemStyle = {
                borderWidth: 2,
                borderColor: '#fff'
              };
            });
            res.data.integral_sum.pie.map(item => {
              item.name = item.village_name;
              item.value = item.integral;
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
              item.itemStyle = {
                borderWidth: 2,
                borderColor: '#fff'
              };
            });
            twoPieOption.legendData = res.data.integral_num.grid;
            twoPieOption.seriesData = res.data.integral_num.pie;
            threePieOption.legendData = res.data.integral_sum.grid;
            threePieOption.seriesData = res.data.integral_sum.pie;

            res.data.item.bottom.map((item, index) => {
              item.barMaxWidth = 25;
              item.barGap = 0;
              item.label = {
                show: true,
                position: ['50%', '50%'],
                formatter: function (val) {
                  return `{name|${res.data.item.bottom[val.seriesIndex].item_name[val.dataIndex]}}`;
                },
                rotate: 90,
                verticalAlign: 'middle',
                fontSize: 18,
                rich: {
                  name: {
                    color: '#000'
                  }
                }
              };
              if (item.name == '第一') {
                item.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: '#F5A9AA' },
                      { offset: 0.5, color: '#F8D0D1' },
                      { offset: 1, color: '#ffffff' }
                    ]
                  )
                };
                item.emphasis = {
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: '#F5A9AA' },
                        { offset: 0.5, color: '#F8D0D1' },
                        { offset: 1, color: '#ffffff' }
                      ]
                    )
                  }
                };
                item.colorIndex = ['r3'];
              } else if (item.name == '第二') {
                item.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: '#F3DE94' },
                      { offset: 0.5, color: '#FAEDC6' },
                      { offset: 1, color: '#ffffff' }
                    ]
                  )
                };
                item.emphasis = {
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: '#F3DE94' },
                        { offset: 0.5, color: '#FAEDC6' },
                        { offset: 1, color: '#ffffff' }
                      ]
                    )
                  }
                };
                item.colorIndex = ['r4'];
              } else {
                item.itemStyle = {
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                      { offset: 0, color: '#9ACF9B' },
                      { offset: 0.5, color: '#CBE6CB' },
                      { offset: 1, color: '#ffffff' }
                    ]
                  )
                };
                item.emphasis = {
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        { offset: 0, color: '#9ACF9B' },
                        { offset: 0.5, color: '#CBE6CB' },
                        { offset: 1, color: '#ffffff' }
                      ]
                    )
                  }
                };
                item.colorIndex = ['r5'];
              }
            });
            oneBarOption.xAxisData = res.data.item.top;
            oneBarOption.series = res.data.item.bottom;
            oneBarOption.title = res.data.town_name + '街道每个村排名前三打分项统计'
            this.setState({
              twoPieOption,
              threePieOption,
              oneBarOption,
              townName: res.data.town_name
            });
            break;
          case 3:
            const { twoBarOption, threeBarOption } = this.state;
            twoBarOption.xAxisData = res.data.integral_sum.name;
            let arr1 = [], arr2 = [];
            res.data.integral_sum.value.map(item => arr1.push(Number(item)));
            twoBarOption.series[0].data = arr1;

            threeBarOption.xAxisData = res.data.integral_count.name;
            res.data.integral_count.value.map(item => item = arr2.push(Number(item)));
            threeBarOption.series[0].data = arr2;

            this.setState({
              twoBarOption: this.deleteRepeatVal(twoBarOption),
              threeBarOption: this.deleteRepeatVal(threeBarOption),
              villageName: res.data.village_name
            });
            break;
          case 4:
            res.data.map((item, index) => item.key = index);
            this.setState({
              scoreSource: res.data
            });
            break;
          default:
            break;
        }
      }
    })
  }
  deleteRepeatVal(options) {
    let repeatVal = {};
    // 剔除three重复项
    for (let i = 0; i < options.xAxisData.length; i++) {
      for (let j = i + 1; j < options.xAxisData.length; j++) {
        if (options.xAxisData[i] == options.xAxisData[j]) {
          repeatVal[i] = j;
        }
      }
    }
    for (let attr in repeatVal) {
      options.series[0].data[attr] = options.series[0].data[attr] + options.series[0].data[repeatVal[attr]];
      options.series[0].data.splice(repeatVal[attr], 1);
    }
    options.xAxisData = [...new Set(options.xAxisData)];
    return options;
  }
  handleChangeArea(e) {
    const { levelStatus } = this.state;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let town = userInfo.town_id, village = userInfo.village_id;
    if (levelStatus == 1) {
      town = e[1];
      village = e[2];
    } else {
      town = e[0];
      village = e[1];
    }
    this.setState({
      city: 1,
      town,
      village
    }, () => {
      this.getIntegraStatList();
      if (this.state.levelStatus == 1) {
        this.getIntegralList();
      }
    });
  }
  handleChangeYear(e) {
    this.setState({
      yearVal: e || (new Date()).getFullYear()
    }, () => {
      this.getIntegraStatList();
      if (this.state.levelStatus == 1) {
        this.getIntegralList();
      }
    });
  }
  cityExport(urlList) {
    const { onePieOption, fourPieOption, yearVal } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'pie-picture7') {
        let tableList = [['颜色标识', '乡镇名称', '分值', '占比']];
        onePieOption.seriesData.map((item, index) => {
          tableList.push([onePieOption.colorIndex[index], item.town_name, item.integral, item.proportion])
        });
        lists.push({
          title: '各乡镇对比',
          image: {
            url: item.url,
            desc: `街道打分值(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'pie-picture12') {
        let tableList = [['颜色标识', '乡镇名称', '打分次数', '占比']];
        let total = 0;
        fourPieOption.seriesData.map(item => {
          total += item.value;
        });
        fourPieOption.seriesData.map((item, index) => {
          tableList.push([fourPieOption.colorIndex[index], item.name, item.value, total==0?'0':(item.value / total * 100).toFixed(2) + '%'])
        });
        lists.push({
          title: '各乡镇对比',
          image: {
            url: item.url,
            desc: `各乡镇打分次数(${yearVal})`
          },
          table: tableList
        });
      }
    });
    return lists;
  }
  townExport(urlList) {
    const { twoPieOption, threePieOption, yearVal, oneBarOption } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'pie-picture8') {
        let tableList = [['颜色标识', '村名称', '打分项数量', '占比']];
        twoPieOption.seriesData.map((item, index) => {
          tableList.push([twoPieOption.colorIndex[index], item.village_name, item.num, item.proportion])
        });
        lists.push({
          title: '各村对比',
          image: {
            url: item.url,
            desc: `打分项数量统计(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'pie-picture9') {
        let tableList = [['颜色标识', '村名称', '打分数', '占比']];
        threePieOption.seriesData.map((item, index) => {
          tableList.push([threePieOption.colorIndex[index], item.village_name, item.integral, item.proportion])
        });
        lists.push({
          title: '各村对比',
          image: {
            url: item.url,
            desc: `各村打分值(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'bar-picture1') {
        let tableList = [['村名称', '颜色标识', '打分项', '打分次数']];
        oneBarOption.xAxisData.map((item, index) => {
          tableList.push([item, oneBarOption.series[0].colorIndex[0], oneBarOption.series[0].item_name[index], oneBarOption.series[0].data[index]])
          tableList.push([item, oneBarOption.series[1].colorIndex[0], oneBarOption.series[1].item_name[index], oneBarOption.series[1].data[index]])
          tableList.push([item, oneBarOption.series[2].colorIndex[0], oneBarOption.series[2].item_name[index], oneBarOption.series[2].data[index]])
        });
        lists.push({
          title: '各村对比',
          image: {
            url: item.url,
            desc: `当湖街道每村排名前三打分项次数统计(${yearVal})`
          },
          table: tableList
        });
      }
    })
    return lists;
  }
  villageExport(urlList) {
    const { twoBarOption, yearVal, threeBarOption } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'bar-picture2') {
        let tableList = [['名称', '打分值']];
        twoBarOption.xAxisData.map((item, index) => {
          tableList.push([item, twoBarOption.series[0].data[index]])
        });
        lists.push({
          title: '打分项对比',
          image: {
            url: item.url,
            desc: `每项打分项累积打分值(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'bar-picture3') {
        let tableList = [['名称', '打分值']];
        threeBarOption.xAxisData.map((item, index) => {
          tableList.push([item, threeBarOption.series[0].data[index]])
        });
        lists.push({
          title: '打分项对比',
          image: {
            url: item.url,
            desc: `每项打分项累积打分次数(${yearVal})`
          },
          table: tableList
        });
      }
    });
    return lists;
  }
  handleExportReport() {
    let urlList = JSON.parse(localStorage.getItem('urlList'));
    const { levelStatus, townName, villageName, city, town, village, scoreSource } = this.state;
    let obj = {
      modules: {
        title: '打分项分析',
        city: {
          area: '平湖市',
          lists: [],
          rank: {}
        },
        town: {
          area: townName,
          lists: [],
          rank: {}
        },
        village: {
          area: villageName,
          lists: [],
          rank: {
            title: villageName + '打分次数排名前十列表',
            table: [['排名', '累计打分次数', '打分次数占比', '打分名称', '所属地区', '参与家庭数', '累计打分值']]
          }
        }
      }
    };
    // 市级别
    if (levelStatus == 1) {
      obj.modules.city.lists = this.cityExport(urlList);
      if (village > 0) {
        obj.modules.village.lists = this.villageExport(urlList);
        scoreSource.map((item,index)=>{
          obj.modules.village.rank.table.push([index+1,item.count,item.proportion,item.item_name,item.area,item.family_count,item.integral]);
        })
      }
      if (town > 0) {
        obj.modules.town.lists = this.townExport(urlList);
      }
    } else if (levelStatus == 2) {
      obj.modules.town.lists = this.townExport(urlList);
      if (village > 0) {
        obj.modules.village.lists = this.villageExport(urlList);
        scoreSource.map((item,index)=>{
          obj.modules.village.rank.table.push([index+1,item.count,item.proportion,item.item_name,item.area,item.family_count,item.integral]);
        })
      }
    } else if (levelStatus == 3) {
      obj.modules.village.lists = this.villageExport(urlList);
      scoreSource.map((item,index)=>{
        obj.modules.village.rank.table.push([index+1,item.count,item.proportion,item.item_name,item.area,item.family_count,item.integral]);
      })
    }
    // let data = {
    //   title: '打分项统计',
    //   desc: '',
    //   images: arr
    // };
    exportReport(obj).then(res => {
      fileDownload(res, '打分项统计')
    })
    // message.info('即将开放，敬请期待！')
  }
  render() {
    const { loading, total_point, town, village, yearVal, townName, villageName, modalConfig, levelStatus, villageList, yearList, scoreColumns, scoreSource, onePieOption, twoPieOption, threePieOption, oneBarOption, twoBarOption, threeBarOption, total_count, fourPieOption } = this.state;
    return (
      <div className={styles.threeStatic}>
        <div className={styles.staticTop}>
          {/* <span className={styles.staticLabel}>打分项统计</span> */}
          <img src="https://img.hzanchu.com/acimg/2df9d00d060df69a0744215bf770ecca.png" alt="" />
          <div className={styles.staticSelect}>
            {/* 左侧选择区域 */}
            <div className={styles.selectLeft}>
              {/* 所属地区 */}
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>地区筛选：</span>
                {
                  levelStatus == 3 ? villageName : <Cascader className={styles.selectInfo} allowClear onChange={this.handleChangeArea.bind(this)} changeOnSelect options={villageList} defaultValue={[1,1,2]} placeholder="请选择所属地区" />
                }
              </div>
              {/* 年份 */}
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>年份筛选：</span>
                <Select className={styles.selectInfo1} value={yearVal} allowClear onChange={this.handleChangeYear.bind(this)} placeholder="请选择年份">
                  {
                    yearList.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)
                  }
                </Select>
              </div>
            </div>
          </div>
          {/* <a className={styles.staticTable} onClick={this.handleExportReport.bind(this)}>生成报表</a> */}
          <Button type="dashed" style={{ margin: '0 20px 0 auto' }} onClick={this.handleExportReport.bind(this)}>生成报表</Button>
        </div>

        {/* 街道统计饼图 */}
        {
          levelStatus == 1 ?
            <div className={styles.pieStreetPic}>
              <Divider orientation="left">市级层面：平湖市</Divider>
              <div className={styles.piePicture}>
                <div className={`${styles.pieItem} ${styles.pieItem50}`}>
                  <PiePicture id="pie-picture7" options={onePieOption} />
                  <span className={styles.moduleTitle}>各街道情况对比</span>
                  <span className={styles.totalPoint}>平湖各街道分值总和：{total_point}</span>
                </div>

                <div className={`${styles.pieItem} ${styles.pieItem50}`}>
                  <PiePicture id="pie-picture12" options={fourPieOption} />
                  <span className={styles.moduleTitle}>各街道情况对比</span>
                  <span className={styles.totalPoint}>平湖各街道打分次数总和：{total_count}</span>
                </div>
              </div>
            </div> : null
        }
        {/* 街道饼图 */}
        {
          levelStatus != 3 ?
            <div className={styles.all}>
              {
                levelStatus != 2 ? (
                  town > 0 ?
                    <div className={styles.pieStreetPic}>
                      {/* <span className={styles.pieTitles}>{townName}</span> */}
                      <Divider orientation="left">镇级层面：{townName}</Divider>
                      <div className={styles.piePicture}>
                        <div className={styles.pieItem}>
                          <PiePicture id="pie-picture8" options={twoPieOption} />
                          <span className={styles.moduleTitle}>各村情况对比</span>
                        </div>
                        <div className={styles.pieItem}>
                          <PiePicture id="pie-picture9" options={threePieOption} />
                          <span className={styles.moduleTitle}>各村情况对比</span>
                        </div>
                      </div>
                    </div> : null
                ) :
                  <div className={styles.piePicture}>
                    <div className={styles.pieItem}>
                      <PiePicture id="pie-picture8" options={twoPieOption} />
                      <span className={styles.moduleTitle}>各村情况对比</span>
                    </div>
                    <div className={styles.pieItem}>
                      <PiePicture id="pie-picture9" options={threePieOption} />
                      <span className={styles.moduleTitle}>各村情况对比</span>
                    </div>
                  </div>
              }


              {/* 当湖街道每个村排行前三打分项统计 */}
              {/* {
                town > 0 ? <p className={styles.tableTitle}>
                  <span>当湖街道每个村排名前三打分项统计</span>
                </p> : null
              } */}
              {/* 柱状图 */}
              {
                town > 0 ? (
                  <div className={styles.piePicture}>
                    <div className={`${styles.pieItem} ${styles.pieItem100}`}>
                      <BarPicture id="bar-picture1" options={oneBarOption} />
                    </div>
                  </div>
                ) : null
              }
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
                    <div className={`${styles.pieItem} ${styles.pieItem100}`}>
                      <BarPicture id="bar-picture2" options={twoBarOption} />
                    </div>
                    <div className={`${styles.pieItem} ${styles.pieItem100}`}>
                      <BarPicture id="bar-picture3" options={threeBarOption} />
                    </div>
                  </div>
                  {/* 平湖市打分次数排名table */}
                  {
                    village > 0 ? (
                      <div className={styles.rankingTable}>
                        <p className={styles.tableTitle}>
                          <span>{villageName}村打分次数排名前十列表</span>
                          <a onClick={this.handleModalConfig.bind(this, 3)}>查看更多排名</a>
                        </p>
                        <Table
                          className={styles.scoreTen}
                          pagination={false}
                          columns={scoreColumns}
                          dataSource={scoreSource}
                        />
                      </div>
                    ) : null
                  }
                </div> : null
            ) :
            <div className={styles.piePicture}>
              <div className={`${styles.pieItem} ${styles.pieItem100}`}>
                <BarPicture id="bar-picture2" options={twoBarOption} />
              </div>
              <div className={`${styles.pieItem} ${styles.pieItem100}`}>
                <BarPicture id="bar-picture3" options={threeBarOption} />
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
