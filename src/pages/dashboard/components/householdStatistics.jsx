import React from 'react';
import { Cascader, Select, Table, Button, Divider, message } from 'antd';
import styles from '../index.less';
import PiePicture from './piePicture';
import BarPicture from './barPicture';
import TableModal from './tableModal';
import { stockStat, exportReport } from '@/services/dataCenter';
import { fileDownload } from '@/utils/utils'
// import message from 'mock/message';

const echarts = require('echarts/lib/echarts');
const { Option } = Select;
export default class HouseHoldStatistics extends React.Component {
  constructor(props) {
    super(props);
    const { villageList, yearList, levelStatus } = props;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      villageList,
      yearList,
      levelStatus,
      sortColumns: [
        {
          key: 'family_id',
          dataIndex: 'family_id',
          title: '排名',
          render: (text, record, index) => (<span>{index + 1}</span>)
        },
        {
          key: 'integral',
          dataIndex: 'integral',
          title: '积分数',
          align: 'center'
        },
        {
          key: 'integral_bonus',
          dataIndex: 'integral_bonus',
          title: '积分分红',
          align: 'center'
        },
        {
          key: 'owner_name',
          dataIndex: 'owner_name',
          title: '家庭户主',
          align: 'center'
        },
        {
          key: 'area',
          dataIndex: 'area',
          title: '所属地区',
          align: 'center'
        },
        {
          key: 'stock_number',
          dataIndex: 'stock_number',
          title: '股份数',
          align: 'center'
        },
        {
          key: 'dividend',
          dataIndex: 'dividend',
          title: '股份分红',
          align: 'center'
        },

      ],
      sortDataSource: [],
      oneBarOption: {
        title: '各街道股份积分情况对比',
        legend: {
          data: ['股份', '积分'],
          selectedMode: false,
          right: 15,
          top: 6,
        },
        grid: {
          left: '2%',
          right: '8%',
          top: '25%',
          bottom: '5%',
          containLabel: true
        },
        xAxisName: '街道',
        xAxisData: [],
        yAxisName: '数量',
        series: [
          {
            type: 'bar',
            name: '股份',
            barGap: 0,
            barWidth: 25,
            data: [],
            label: {
              show: true,
              position: ['50%', '50%'],
              formatter: '{@value}',
              rotate: 90,
              verticalAlign: 'middle',
              fontSize: 12,
              rich: {
                name: {
                  color: '#3c3c3c'
                }
              }
            },
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
            }
          },
          {
            type: 'bar',
            name: '积分',
            barWidth: 25,
            data: [],
            label: {
              show: true,
              position: ['50%', '50%'],
              formatter: '{@value}',
              rotate: 90,
              verticalAlign: 'middle',
              fontSize: 14,
              rich: {
                name: {
                  color: '#000'
                }
              }
            },
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
            }
          }
        ],
        colorIndex: ['r6', 'r7']
      },
      twoBarOption: {
        legend: {
          data: ['股份', '积分'],
          selectedMode: false,
          right: 160,
          top: 6,
        },
        title: '各村股份积分情况对比',
        grid: {
          left: '2%',
          right: '8%',
          top: '25%',
          bottom: '5%',
          containLabel: true
        },
        xAxisName: '村',
        xAxisData: [],
        yAxisName: '数量',
        series: [
          {
            type: 'bar',
            name: '股份',
            barGap: 0,
            barWidth: 25,
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#F4A8A9' },
                  { offset: 0.5, color: '#F8D0D0' },
                  { offset: 1, color: '#ffffff' }
                ]
              )
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#F4A8A9' },
                    { offset: 0.5, color: '#F8D0D0' },
                    { offset: 1, color: '#ffffff' }
                  ]
                )
              }
            }
          },
          {
            type: 'bar',
            name: '积分',
            data: [],
            barWidth: 25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#F3DE94' },
                  { offset: 0.5, color: '#F8EDC2' },
                  { offset: 1, color: '#ffffff' }
                ]
              )
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#F3DE94' },
                    { offset: 0.5, color: '#F8EDC2' },
                    { offset: 1, color: '#ffffff' }
                  ]
                )
              }
            }
          }
        ],
        colorIndex: ['r3', 'r4']
      },
      onePieOption: {
        title: 'xxx村股份积分分红',
        legendBottom: 80,
        legendData: ['积分分红', '股份分红'],
        radius: '45%',
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'c11', 'c13', 'c7', 'c9'],
        radius: '45%',
        seriesName: null,
        // formatter: function (val) {
        //   if (val.value == 0) {
        //     return '';
        //   }
        //   return `${val.data.name.slice(0, 2)}数:${val.data.value}\n${val.data.name}:${val.data.nums}\n分红占比:${val.percent}%`
        // },
        formatter: '{b}：{c}<br/>占比：{d}%',
        seriesData: [],
        tooltipLabel: function (a) {
          return `${a.percent}%<br/>${a.name}占比`
        }
      },
      modalConfig: {
        visible: false,
        type: 7,
        title: '各村家庭积分对比排名'
      },
      city: userInfo.city_id == 0 ? 1 : userInfo.city_id,
      town: userInfo.town_id,
      village: userInfo.village_id,
      yearVal: (new Date()).getFullYear() - 1,
      townName: '当湖',
      villageName: '通界',
      loading: true
    };
  }
  componentDidMount() {
    this.getStockStatList();
  }
  getStockStatList() {
    const { city, town, village, yearVal, oneBarOption, twoBarOption, onePieOption } = this.state;
    let data = { city_id: city, town_id: town, village_id: village, year: yearVal };
    stockStat(data).then(res => {
      if (res.code == 0) {
        var dataSouceArr = [];
        // 市下面的股份
        if (res.data.town_stock_rank.length > 0) {
          var arr = [], arr1 = [], arr2 = [];
          res.data.town_stock_rank.map(item => {
            arr.push(item.town_name);
            arr1.push(item.sum_stock);
            arr2.push(item.sum_integral);
          });
          oneBarOption.xAxisData = arr;
          oneBarOption.series[0].data = arr1;
          oneBarOption.series[1].data = arr2;
        } else {
          oneBarOption.xAxisData = [];
          oneBarOption.series[0].data = [];
          oneBarOption.series[1].data = [];
        }
        if (res.data.village_stock_rank.length > 0) {
          var arr = [], arr1 = [], arr2 = [];
          res.data.village_stock_rank.map(item => {
            arr.push(item.village_name);
            arr1.push(item.sum_stock);
            arr2.push(item.sum_integral);
          });
          twoBarOption.xAxisData = arr;
          twoBarOption.series[0].data = arr1;
          twoBarOption.series[1].data = arr2;
        } else {
          twoBarOption.xAxisData = [];
          twoBarOption.series[0].data = [];
          twoBarOption.series[1].data = [];
        }
        if (res.data.stock_percent.length > 0) {
          res.data.stock_percent.map(item => {
            if (item.sum_integral) {
              item.name = '积分分红';
              item.value = item.integral_bonus;
              item.nums = item.integral_bonus;
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
              item.itemStyle = {
                borderWidth: 2,
                borderColor: '#fff'
              };
            } else {
              item.name = '股份分红';
              item.value = item.dividend;
              item.nums = item.dividend;
              item.labelLine = {
                show: function () {
                  if (item.value == 0) { return false; }
                }()
              };
            }
          });
          onePieOption.seriesData = res.data.stock_percent;
          onePieOption.title = res.data.village_name + '村股份积分分红';
        } else {
          onePieOption.seriesData = [];
        }
        if (res.data.tenrank.length > 0) {
          res.data.tenrank.map(item => {
            item.key = item.id;
          });
          dataSouceArr = res.data.tenrank;
        } else {
          dataSouceArr = []
        }
        this.setState({
          oneBarOption,
          twoBarOption,
          onePieOption,
          sortDataSource: dataSouceArr,
          townName: res.data.town_name,
          villageName: res.data.village_name,
          loading: false
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
      title: type == 11 ? '家庭股份积分排名' : '各村家庭积分对比排名',
      data: {
        city: this.state.city
      }
    };
    this.setState({
      modalConfig
    });
  }
  handleChangeArea(e) {
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
      this.getStockStatList();
    });
  }
  handleChangeYear(e) {
    this.setState({
      yearVal: e || (new Date()).getFullYear()
    }, () => {
      this.getStockStatList();
    });
  }
  cityExport(urlList) {
    const { oneBarOption } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'houseBar1') {
        let tableList = [['乡镇名称', '股份数', '积分数']];
        oneBarOption.xAxisData.map((item, index) => {
          tableList.push([item, oneBarOption.series[0].data[index], oneBarOption.series[1].data[index]])
        });
        lists.push({
          title: '各乡镇股份积分数量统计',
          image: {
            url: item.url,
            desc: ''
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
      if (item.type == 'houseBar2') {
        let tableList = [['村名称', '股份数', '积分数']];
        twoBarOption.xAxisData.map((item, index) => {
          tableList.push([item, twoBarOption.series[0].data[index], twoBarOption.series[1].data[index]])
        });
        lists.push({
          title: '各村股份积分数量统计',
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
    const { onePieOption, yearVal,villageName } = this.state;
    let lists = [];
    urlList.map(item => {
      if (item.type == 'hoursePie1') {
        let tableList = [['名称', '分红数', '占比']];
        let total = 0;
        onePieOption.seriesData.map(item => {
          total += parseFloat(item.nums);
        });
        onePieOption.seriesData.map((item, index) => {
          tableList.push([item.name, item.nums, total==0?'0':(item.nums / total * 100).toFixed(2) + '%'])
        });
        lists.push({
          title: villageName,
          image: {
            url: item.url,
            desc: `股份积分分红占比(${yearVal})`
          },
          table: tableList
        });
      }
    });
    return lists;
  }
  handleExportReport() {
    let urlList = JSON.parse(localStorage.getItem('urlList'));
    const { levelStatus, townName, villageName, city, town, village,sortDataSource } = this.state;
    let obj = {
      modules: {
        title: '家庭股份积分',
        city: {
          area: '平湖市',
          lists: [],
          rank:{}
        },
        town: {
          area: townName,
          lists: [],
          rank:{}
        },
        village: {
          area: villageName,
          lists: [],
          rank:{
            title:'股份积分前十家庭排名',
            table:[['排名','积分数','积分分红','家庭户主','所属地区','股份数','股份分红']]
          }
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
    sortDataSource.map((item,index)=>{
      obj.modules.village.rank.table.push([index+1,item.integral,item.integral_bonus,item.owner_name,item.area,item.stock_number,item.dividend]);
    });
    // let data = {
    //   title: '家庭股份积分统计',
    //   desc: '',
    //   images: arr
    // };
    exportReport(obj).then(res => {
      fileDownload(res, '家庭股份积分统计')
    });
    // message.info('即将开放，敬请期待！')
  }
  render() {
    const {
      yearVal,
      modalConfig,
      levelStatus,
      villageList,
      yearList,
      sortColumns,
      sortDataSource,
      oneBarOption,
      twoBarOption,
      onePieOption,
      town,
      village,
      townName,
      villageName,
      loading
    } = this.state;
    return (
      <div className={styles.threeStatic}>
        <div className={styles.staticTop}>
          {/* <span className={styles.staticLabel}>家庭股份积分统计</span> */}
          <img src="https://img.hzanchu.com/acimg/1ff039b13b0fcf10f4d8563154c1dc51.png" alt="" />
          <div className={styles.staticSelect}>
            <div className={styles.selectLeft}>
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>地区筛选：</span>
                {
                  levelStatus == 3 ? villageName :
                    <Cascader className={styles.selectInfo} allowClear changeOnSelect onChange={this.handleChangeArea.bind(this)} options={villageList} placeholder="请选择所属地区" />
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
            </div>
          </div>
          <Button type="dashed" style={{ margin: '0 20px 0 auto' }} onClick={this.handleExportReport.bind(this)}>生成报表</Button>
        </div>

        {
          levelStatus == 1
            ? (
              <div className={styles.pieStreetPic}>
                <Divider orientation="left">市级层面：平湖市</Divider>
                <div className={styles.piePicture}>
                  <div className={`${styles.pieItem} ${styles.pieItem100}`}>
                    <BarPicture id="houseBar1" options={oneBarOption} />
                  </div>
                </div>
              </div>
            ) : null
        }
        {
          levelStatus == 1 ?
            town > 0 ?
              <div className={styles.pieStreetPic}>
                {/* <span className={styles.pieTitles}>{townName}</span> */}
                <Divider orientation="left">镇级层面：{townName}</Divider>
                <div className={styles.piePicture}>
                  <div className={`${styles.pieItem} ${styles.pieItem100}`}>
                    <BarPicture id="houseBar2" options={twoBarOption} />
                    <a className={styles.totalPoint} onClick={this.handleModalConfig.bind(this, 7)}>查看各村积分对比</a>
                  </div>
                </div>
              </div> :
              null
            :
            levelStatus == 2 ?
              <div className={styles.piePicture}>
                <div className={`${styles.pieItem} ${styles.pieItem100}`}>
                  <BarPicture id="houseBar2" options={twoBarOption} />
                  <a className={styles.totalPoint} onClick={this.handleModalConfig.bind(this, 7)}>查看各村积分对比</a>
                </div>
              </div> :
              null
        }
        {
          levelStatus == 3 ?
            <div className={styles.piePicture}>
              <div className={styles.pieItem}>
                <PiePicture id="hoursePie1" options={onePieOption} />
              </div>
            </div> :
            village > 0 ?
              <div className={styles.pieStreetPic}>
                {/* <span className={styles.pieTitles}>{villageName}</span> */}
                <Divider orientation="left">村级层面：{villageName}</Divider>
                <div className={styles.piePicture}>
                  <div className={styles.pieItem}>
                    <PiePicture id="hoursePie1" options={onePieOption} />
                    <span className={styles.moduleTitle}>{villageName}村股份积分分红情况对比</span>
                  </div>
                </div>
              </div> :
              null
        }
        <div style={{ background: '#fff', boxShadow: '0 0 8px 1px rgba(0,0,0,0.1)' }}>
          <div className={styles.tableTitle}>
            <span>股份积分前十家庭排名</span>
            <a onClick={this.handleModalConfig.bind(this, 11)}>查看所有排名</a>
          </div>
          <Table
            loading={loading}
            className={styles.sortTable}
            pagination={false}
            columns={sortColumns}
            dataSource={sortDataSource}
          />
        </div>
        {
          modalConfig.visible ? <TableModal modalConfig={modalConfig} villageList={villageList} hideModal={this.handleHideModal.bind(this)} /> : null
        }
      </div>
    )
  }
}
