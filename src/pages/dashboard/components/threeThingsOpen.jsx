import React from 'react';
import { Cascader, Select, Button, Divider, message } from 'antd';
import styles from '../index.less'
const echarts = require('echarts/lib/echarts');
import PiePicture from './piePicture';
import BarPicture from './barPicture';
import TableModal from './tableModal';
import { ThreeThingsOpen, exportReport } from '@/services/dataCenter';
import { fileDownload } from '@/utils/utils'
// import message from 'mock/message';

const { Option } = Select;
export default class ThreeThingOpen extends React.Component {
  constructor(props) {
    super(props);
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const { villageList, yearList, monthList, levelStatus } = props;
    this.state = {
      villageList,
      yearList,
      monthList,
      levelStatus,
      classifyList: [{ name: '党务', value: 6 }, { name: '财务', value: 5 }, { name: '村务', value: 4 }],
      firstOption: {
        title: '各街道三务文章发布数量',
        legendBottom: 100,
        legendData: [],
        seriesName: '累计发布',
        seriesData: [],
        radius: [0, '45%'],
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   return `${val.seriesName}:${val.value}\n占比:${val.percent}%`
        // },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      twoOption: {
        title: '三务发布数量前十',
        legendBottom: 80,
        legendData: [],
        seriesName: '发布数',
        seriesData: [],
        radius: [0, '45%'],
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   return `${val.seriesName}:${val.data.value}`
        // },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      twoBarOption: {
        legend: null,
        title: '三务发布数量前十',
        xAxisName: '地区',
        xAxisData: [],
        yAxisName: '发布数',
        rotate: 20,
        grid: {
          top: '25%',
          left: '8%',
          right: '12%',
          bottom: '15%'
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
      threeOption: {
        title: '三务点击次数前十',
        legendBottom: 80,
        legendData: [],
        seriesName: '累计点击',
        seriesData: [],
        radius: [0, '45%'],
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
      threeBarOption: {
        legend: null,
        title: '三务点击次数前十',
        xAxisName: '地区',
        xAxisData: [],
        yAxisName: '点击次数',
        rotate: 20,
        grid: {
          top: '25%',
          left: '8%',
          right: '12%',
          bottom: '15%'
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
      fourOption: {
        title: '各村发布数量',
        legendBottom: 100,
        legendData: [],
        seriesName: '发布',
        seriesData: [],
        radius: ['25%', '45%'],
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
      fiveOption: {
        title: '三务点击次数前十占比',
        legendBottom: 80,
        legendData: [],
        seriesName: '点击',
        seriesData: [],
        radius: ['25%', '45%'],
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   return `${val.seriesName}：${val.data.value}\n占比：${val.percent}%\n所属村：${val.data.name}`
        // },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      sixOption: {
        title: '三务发布数量占比',
        legendBottom: 80,
        legendData: [],
        seriesName: '发布',
        color: ['#FD895B', '#FED130', '#51BEE5'],
        seriesData: [],
        radius: '45%',
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        formatter: function (val) {
          if (val.value == 0) {
            return '';
          }
          return `点击次数：${val.value}<br/>文章名：${val.name}<br/>占比：${val.percent}%`
        },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      sevenOption: {
        title: '文章前五点击次数占比',
        legendBottom: 80,
        legendData: [],
        seriesName: '点击',
        seriesData: [],
        radius: '45%',
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        formatter: function (val) {
          if (val.value == 0) {
            return '';
          }
          return `点击次数：${val.value}<br/>文章名：${val.name}<br/>占比：${val.percent}%`
        },
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      modalConfig: {
        visible: false,
        type: 1,
        title: '平湖各村三务发布数量排名',
        data: {}
      },
      city: userInfo.city_id == 0 ? 1 : userInfo.city_id,
      town: userInfo.town_id,
      village: userInfo.village_id,
      town_name: '当湖',
      village_name: '通界',
      classifyVal: undefined,
      yearVal: (new Date()).getFullYear(),
      monthVal: undefined
    };
  }
  handleModalConfig = (type) => {
    const { town_name, village, town, city } = this.state;
    let modalConfig = {
      visible: true,
      type,
      title: type == 1 ?
        `平湖各村三务发布数量排名` :
        type == 2 ?
          `平湖各村三务点击次数排名` :
          type == 6 ?
            `${town_name}各村三务点击次数排名` :
            type == 8 ? '文章点击次数排名' : '',
      data: {
        city_id: city,
        village_id: village,
        town_id: town
      }
    };
    this.setState({
      modalConfig
    });
  }
  handleHideModal() {
    let modalConfig = this.state.modalConfig;
    modalConfig.visible = false;
    this.setState({
      modalConfig
    });
  }
  componentDidMount() {
    this.getThreeThingsList();
  }
  getThreeThingsList() {
    const { city, town, village, classifyVal, yearVal, monthVal, levelStatus } = this.state;
    if (levelStatus == 1) {
      let data = { city_id: city, type: 1, category_id: classifyVal, year: yearVal, month: monthVal };
      this.getThreeThingsInfo(data, 1);
      if (town > 0) {
        let datas = { town_id: town, type: 2, category_id: classifyVal, year: yearVal, month: monthVal };
        this.getThreeThingsInfo(datas, 2);
      }
      if (village > 0) {
        let datass = { village_id: village, type: 3, year: yearVal, month: monthVal };
        this.getThreeThingsInfo(datass, 3);
      }
    } else if (levelStatus == 2) {
      let datas = { town_id: town, type: 2, category_id: classifyVal, year: yearVal, month: monthVal };
      this.getThreeThingsInfo(datas, 2);
      if (village > 0) {
        let datass = { village_id: village, type: 3, year: yearVal, month: monthVal };
        this.getThreeThingsInfo(datass, 3);
      }
    } else {
      let datass = { village_id: village, type: 3, year: yearVal, month: monthVal };
      this.getThreeThingsInfo(datass, 3);
    }
  }
  getThreeThingsInfo(data, type) {
    ThreeThingsOpen(data).then(res => {
      if (res.code == 0) {
        switch (type) {
          case 1:
            let firstOption = this.state.firstOption;
            let twoOption = this.state.twoOption;
            let threeOption = this.state.threeOption;
            let threeBarOption = this.state.threeBarOption;
            let twoBarOption = this.state.twoBarOption;
            let data_arr = []
            let three_data_arr = []
            res.data.city.pie.map(item => {
              item.name = item.town_name;
              item.value = item.num;
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
            });
            res.data.release.pie.map(item => {
              item.name = item.village_name;
              item.value = item.num;
              data_arr.push(item.value)
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
            });
            res.data.click.pie.map(item => {
              item.name = item.village_name;
              item.value = item.num;
              three_data_arr.push(item.value)
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
            });
            firstOption.legendData = res.data.city.grid;
            firstOption.seriesData = res.data.city.pie;

            twoOption.legendData = res.data.release.grid;
            twoOption.seriesData = res.data.release.pie;
            twoBarOption.xAxisData = res.data.release.grid;
            twoBarOption.series[0].data = data_arr;

            threeOption.legendData = res.data.click.grid;
            threeOption.seriesData = res.data.click.pie;
            threeBarOption.xAxisData = res.data.click.grid;
            threeBarOption.series[0].data = three_data_arr;
            this.setState({
              firstOption,
              twoOption,
              twoBarOption,
              threeOption,
              threeBarOption
            });
            break;
          case 2:
            let fourOption = this.state.fourOption;
            let fiveOption = this.state.fiveOption;
            res.data.town.pie.map(item => {
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
            res.data.click.pie.map(item => {
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
            fourOption.legendData = res.data.town.grid;
            fourOption.seriesData = res.data.town.pie;

            fiveOption.legendData = res.data.click.grid;
            fiveOption.seriesData = res.data.click.pie;
            this.setState({
              fourOption,
              fiveOption,
              town_name: res.data.town_name
            });
            break;
          case 3:
            let sixOption = this.state.sixOption;
            let sevenOption = this.state.sevenOption;

            res.data.village.pie.map((item, index) => {
              item.name = res.data.village.grid[index];
              item.value = item.num;
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
            });

            res.data.click.pie.map(item => {
              item.name = item.title;
              item.value = item.num;
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
            });
            sixOption.legendData = res.data.village.grid;
            sixOption.seriesData = res.data.village.pie;
            sevenOption.legendData = res.data.click.grid;
            sevenOption.seriesData = res.data.click.pie;
            this.setState({
              sixOption,
              sevenOption,
              village_name: res.data.village_name
            });

            break;
          default:
            break;
        }
      }
    })
  }
  handleChangeCascader(e) {
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
      this.getThreeThingsList();
    });
  }
  handleChangeClassify(e) {
    this.setState({
      classifyVal: e || undefined
    }, () => {
      this.getThreeThingsList();
    });
  }
  handleChangeYear(e) {
    this.setState({
      yearVal: e || (new Date()).getFullYear()
    }, () => {
      this.getThreeThingsList();
    });
  }
  handleChangeMonth(e) {
    this.setState({
      monthVal: e || undefined
    }, () => {
      this.getThreeThingsList();
    });
  }
  cityExport(urlList) {
    const { firstOption, twoBarOption, yearVal, threeBarOption } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'pie-picture') {
        let tableList = [['颜色标识', '乡镇名称', '发布数量', '占比', '分类']];
        firstOption.seriesData.map((item, index) => {
          tableList.push([firstOption.colorIndex[index], item.town_name, item.num, item.proportion, '三务'])
        });
        lists.push({
          title: '各街道情况对比',
          image: {
            url: item.url,
            desc: `各街道三务文章发布数量(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'threeBar2') {
        // 缺失占比
        let tableList = [['排名', '颜色标识', '所属地区', '发布数量', '分类']];
        twoBarOption.xAxisData.map((item, index) => {
          tableList.push([index + 1, twoBarOption.colorIndex[0], item, twoBarOption.series[0].data[index], '三务'])
        });
        lists.push({
          title: '平湖各村对比',
          image: {
            url: item.url,
            desc: `三务发布数量前十排名(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'pie-picture2') {
        // 缺失占比
        let tableList = [['排名', '颜色标识', '分类', '所属地区', '点击次数']];
        threeBarOption.xAxisData.map((item, index) => {
          tableList.push([index + 1, threeBarOption.colorIndex[0], '三务', item, threeBarOption.series[0].data[index]])
        });
        lists.push({
          title: '平湖各村对比',
          image: {
            url: item.url,
            desc: `三务点击次数前十排名${yearVal}`
          },
          table: tableList
        });
      }
    })
    return lists;
  }
  townExport(urlList) {
    const { fourOption, yearVal, fiveOption } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'pie-picture3') {
        let tableList = [['颜色标识', '村名称', '发布数量', '占比', '分类']];
        fourOption.seriesData.map((item, index) => {
          tableList.push([fourOption.colorIndex[index], item.village_name, item.num, item.proportion, '三务'])
        });
        lists.push({
          title: '各村对比',
          image: {
            url: item.url,
            desc: `各村发布数量(${yearVal})`
          },
          table: tableList
        });
      }
      if (item.type == 'pie-picture4') {
        let tableList = [['排名', '颜色标识', '村名称', '点击次数', '占比', '分类']];
        fiveOption.seriesData.map((item, index) => {
          tableList.push([index + 1, fiveOption.colorIndex[index], item.village_name, item.num, item.proportion, '三务'])
        });
        lists.push({
          title: '各村对比',
          image: {
            url: item.url,
            desc: `三务点击次数前十排名${yearVal}`
          },
          table: tableList
        });
      }
    });
    return lists;
  }
  villageExport(urlList) {
    const { sixOption, yearVal, sevenOption } = this.state;
    let lists = [];
    urlList.map((item, index) => {
      if (item.type == 'pie-picture5') {
        let tableList = [['颜色标识', '分类', '发布数量', '占比']];
        console.log(sixOption);
        sixOption.seriesData.map((item, index) => {
          tableList.push([sixOption.colorIndex[index], item.name, item.num, item.proportion])
        });
        lists.push({
          title: '三务对比',
          image: {
            url: item.url,
            desc: `三务发布数量占比${yearVal}`
          },
          table: tableList
        });
      }
      if (item.type == 'pie-picture6') {
        // 缺失分类
        let tableList = [['排名', '颜色标识', '文章名称', '点击次数', '占比']];
        sevenOption.seriesData.map((item, index) => {
          tableList.push([index + 1, sevenOption.colorIndex[index], item.title, item.num, item.proportion])
        });
        // obj.components.village.
        lists.push({
          title: '各文章对比',
          image: {
            url: item.url,
            desc: `文章前五点击次数占比${yearVal}`
          },
          table: tableList
        });
      }
    });
    return lists;
  }
  // 导出
  handleExportReport() {
    let urlList = JSON.parse(localStorage.getItem('urlList'));
    const { levelStatus, city, town, village, town_name, village_name } = this.state;
    let obj = {
      modules: {
        title: '三务公开分析',
        city: {
          area: '平湖市',
          lists: []
        },
        town: {
          area: town_name,
          lists: []
        },
        village: {
          area: village_name,
          lists: []
        }
      }
    };
    // 市级别
    if (levelStatus == 1) {
      obj.modules.city.lists = this.cityExport(urlList);
      // 村庄显示出来
      if (village > 0) {
        obj.modules.village.lists=this.villageExport(urlList);
      }
      // 街道显示出来
      if (town > 0) {
        obj.modules.town.lists = this.townExport(urlList);
      }
    } else if (levelStatus == 2) {
      obj.modules.town.lists = this.townExport(urlList);
      if (village > 0) {
        obj.modules.village.lists=this.villageExport(urlList);
      }
    } else if (levelStatus == 3) {
      obj.modules.village.lists=this.villageExport(urlList);
    }
    // let data = {
    //   title: '三务公开统计',
    //   desc: '',
    //   images: arr
    // };
    exportReport(obj).then(res => {
      fileDownload(res, '三务公开统计')
    });
    // message.info('即将开放，敬请期待！')
  }
  render() {
    const {
      levelStatus,
      villageList,
      yearList,
      monthList,
      classifyList,
      firstOption,
      twoOption,
      twoBarOption,
      threeOption,
      threeBarOption,
      fourOption,
      fiveOption,
      sixOption,
      sevenOption,
      modalConfig, town_name, village_name, town, village, yearVal } = this.state;
    return (
      <div className={styles.threeStatic}>
        <div className={styles.staticTop}>
          {/* <span className={styles.staticLabel}>三务公开统计</span> */}
          <img src="https://img.hzanchu.com/acimg/2f5422454f483760bd5c7296d7d171da.png" alt="" />
          <div className={styles.staticSelect}>
            <div className={styles.selectLeft}>
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>地区筛选：</span>
                {
                  levelStatus == 3 ? village_name : <Cascader className={styles.selectInfo} options={villageList} changeOnSelect onChange={this.handleChangeCascader.bind(this)} placeholder="请选择所属地区" />
                }
              </div>
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>年份筛选：</span>
                <Select className={styles.selectInfo1} allowClear value={yearVal} onChange={this.handleChangeYear.bind(this)} placeholder="请选择年份">
                  {
                    yearList.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)
                  }
                </Select>
              </div>
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>月份筛选：</span>
                <Select className={styles.selectInfo1} allowClear onChange={this.handleChangeMonth.bind(this)} placeholder="请选择月份">
                  {
                    monthList.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                  }
                </Select>
              </div>
              {
                levelStatus != 3 ?
                  <div className={styles.selectItem}>
                    <span className={styles.selectLabel}>分类筛选：</span>
                    <Select className={styles.selectInfo1} allowClear onChange={this.handleChangeClassify.bind(this)} placeholder="请选择分类">
                      {
                        classifyList.map((item, index) => <Option key={index} value={item.value}>{item.name}</Option>)
                      }
                    </Select>
                  </div> : null
              }
            </div>
          </div>
          {/* <a>生成报表</a> */}
          <Button type="dashed" style={{ margin: '0 20px 0 auto' }} onClick={this.handleExportReport.bind(this)}>生成报表</Button>
        </div>

        {
          levelStatus == 1 ?
            <div className={styles.pieStreetPic}>
              <Divider orientation="left">市级层面：平湖市</Divider>
              <div className={styles.piePicture}>
                <div className={styles.pieItem}>
                  <PiePicture options={firstOption} id='pie-picture' />
                  <span className={styles.moduleTitle}>各街道情况对比</span>
                </div>
                <div className={styles.pieItem}>
                  {/* <PiePicture options={twoOption} id='pie-picture1' /> */}
                  <BarPicture id="threeBar2" options={twoBarOption} />
                  <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 1)}>查看所有排名</a>
                </div>
                <div className={`${styles.pieItem}`}>
                  {/* <PiePicture options={threeOption} id='pie-picture2' /> */}
                  <BarPicture id="pie-picture2" options={threeBarOption} />
                  <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 2)}>查看所有排名</a>
                </div>
              </div>
            </div> : null
        }

        {
          levelStatus == 1 && town > 0 ?
            <div className={styles.pieStreetPic}>
              <Divider orientation="left">镇级层面：{town_name}</Divider>
              <div className={styles.piePicture}>
                <div className={styles.pieItem}>
                  <PiePicture options={fourOption} id='pie-picture3' />
                </div>
                <div className={styles.pieItem}>
                  <PiePicture options={fiveOption} id='pie-picture4' />
                  <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 6)}>查看所有排名</a>
                </div>
              </div>
            </div> :
            levelStatus == 2 ?
              <div className={styles.piePicture}>
                <div className={styles.pieItem}>
                  <PiePicture options={fourOption} id='pie-picture3' />
                  <span className={styles.moduleTitle}>各村情况对比</span>
                </div>
                <div className={styles.pieItem}>
                  <PiePicture options={fiveOption} id='pie-picture4' />
                  <span className={styles.moduleTitle}>各村情况对比</span>
                  <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 6)}>查看所有排名</a>
                </div>
              </div> :
              null
        }
        {
          levelStatus == 3 ?
            <div className={styles.piePicture}>
              <div className={styles.pieItem}>
                <PiePicture options={sixOption} id='pie-picture5' />
              </div>
              <div className={styles.pieItem}>
                <PiePicture options={sevenOption} id='pie-picture6' />
                <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 8)}>查看所有排名</a>
              </div>
            </div> :
            village > 0 ?
              <div className={styles.pieStreetPic}>
                <Divider orientation="left">村级层面：{village_name}</Divider>
                <div className={styles.piePicture}>
                  <div className={styles.pieItem}>
                    <PiePicture options={sixOption} id='pie-picture5' />
                  </div>
                  <div className={styles.pieItem}>
                    <PiePicture options={sevenOption} id='pie-picture6' />
                    <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 8)}>查看所有排名</a>
                  </div>
                </div>
              </div> :
              null
        }
        {
          modalConfig.visible ? <TableModal modalConfig={modalConfig} villageList={villageList} hideModal={this.handleHideModal.bind(this)} /> : null
        }
      </div>
    )
  }
}
