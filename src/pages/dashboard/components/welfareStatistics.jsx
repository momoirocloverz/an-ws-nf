import React from 'react';
import { Cascader, Select, Button, message } from 'antd';
import styles from '../index.less';
const echarts = require('echarts/lib/echarts');
import PiePicture from './piePicture';
import TableModal from './tableModal';
import BarPicture from './barPicture';
import { productStat, exportReport } from '@/services/dataCenter';
import { fileDownload } from '@/utils/utils'
// import message from 'mock/message';

const { Option } = Select;
export default class WelfareStatistics extends React.Component {
  constructor(props) {
    super(props);
    const { villageList, yearList } = props;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.state = {
      villageList,
      yearList,
      onePieOption: {
        title: '平湖商品兑换数量前十排名',
        legendBottom: 80,
        legendData: [],
        seriesName: null,
        center: ['40%', '55%'],
        seriesData: [],
        radius: ['30%', '45%'],
        color: ['#8ECCDD', '#8CADDB', '#778EC7', '#B588BB', '#EB8BAC', '#6FC3A8', '#F3DE94', '#99D09B', '#CFD79B', '#2F95F4', '#2F95F4'],
        colorIndex:['c1','c2','c3','c4','c5','c6','c8','c11','c13','c7','c9'],
        formatter: function (val) {
          if (val.value == 0) {
            return '';
          }
          return `已兑换数量:${val.data.value}`
        },
        tooltipLabel: function (a) {
          return a.name
        }
      },
      oneBarOption: {
        legend: null,
        title: '平湖商品兑换数量前十排名',
        xAxisName: '商品名',
        xAxisData: [],
        yAxisName: '兑换数量',
        rotate: 10,
        grid: {
          top: '25%',
          left: '6%',
          right: '8%',
          bottom: '15%'
        },
        series: [
          {
            barMaxWidth: 25,
            data: [],
            itemStyle: {
              color: 'rgba(0,158,217)'
            },
            type: 'bar',
            label: {
              show: true,
              formatter: '{@value}',
              position: 'top',	//在上方显示
              textStyle: {	    //数值样式
                color: '#3c3c3c',
                fontSize: 12
              }
            },
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
        colorIndex:['r6']
      },
      modalConfig: {
        visible: false,
        type: 5,
        title: '平湖各村福利商品兑换数量排名'
      },
      city: userInfo.city_id == 0 ? 1 : userInfo.city_id,
      town: userInfo.town_id,
      village: userInfo.village_id,
      yearVal: (new Date()).getFullYear() - 1
    }
  }
  handleModalConfig(type) {
    let modalConfig = {
      visible: true,
      type,
      title: '平湖各村福利商品兑换数量排名',
      data: {
        city: this.state.city
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
    this.getProductStat();
  }
  getProductStat() {
    const { city, town, village, yearVal, onePieOption, oneBarOption } = this.state;
    let data = { city_id: city, town_id: town, village_id: village, year: yearVal };
    productStat(data).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          let arr = [];
          let data_arr = [];
          res.data.map(item => {
            item.name = item.product_name;
            item.value = item.sum_number;
            arr.push(item.product_name);
            data_arr.push(item.sum_number);
            item.labelLine = {
              show: function () {
                if (item.value == 0) { return false; }
              }()
            };
          });
          onePieOption.legendData = arr;
          onePieOption.seriesData = res.data;
          oneBarOption.xAxisData = arr;
          oneBarOption.series[0].data = data_arr;
        } else {
          onePieOption.legendData = [];
          onePieOption.seriesData = [];
          oneBarOption.xAxisData = [];
          oneBarOption.series[0].data = []
        }
        this.setState({
          onePieOption,
          oneBarOption
        });
      }
    })
  }
  handleChangeArea(e) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.setState({
      city: e[0] || 1,
      town: e[1] || userInfo.town_id,
      village: e[2] || userInfo.village_id
    }, () => {
      this.getProductStat();
    })
  }
  handleChangeYear(e) {
    this.setState({
      yearVal: e || (new Date()).getFullYear()
    }, () => {
      this.getProductStat();
    })
  }
  handleProductReport() {
    let urlList = JSON.parse(localStorage.getItem('urlList'));
    let {oneBarOption}=this.state;
    let obj = {
      modules: {
        title: '福利兑换分析',
        city: {
          area: '平湖市',
          lists: []
        },
        town: {
          area: '',
          lists: []
        },
        village: {
          area: '',
          lists: []
        }
      }
    };
    urlList.map(item => {
      if (item.type == 'welfareBar1') {
        let tableList = [['排名', '名称','兑换数量']];
        oneBarOption.xAxisData.map((item, index) => {
          tableList.push([index+1, item, oneBarOption.series[0].data[index]])
        });
        obj.modules.city.lists.push({
          title: '各商品对比',
          image: {
            url: item.url,
            desc: '平湖商品兑换数量前十排名统计'
          },
          table: tableList
        });
      }
    });
    // let data = {
    //   title: '福利兑换统计',
    //   desc: '',
    //   images: arr
    // };
    exportReport(obj).then(res => {
      fileDownload(res, '福利兑换统计')
    })
    // message.info('即将开放，敬请期待！')
  }
  render() {
    const { villageList, yearList, onePieOption, modalConfig, oneBarOption, yearVal } = this.state;
    return (
      <div className={`${styles.threeStatic} ${styles.lastStatic}`}>
        <div className={styles.staticTop}>
          {/* <span className={styles.staticLabel}>福利兑换统计</span> */}
          <img src="https://img.hzanchu.com/acimg/55e1f20df85569dde188b30010a95a71.png" alt="" />
          <div className={styles.staticSelect}>
            <div className={styles.selectLeft}>
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>所属地区：</span>
                <Cascader className={styles.selectInfo} allowClear changeOnSelect onChange={this.handleChangeArea.bind(this)} options={villageList} placeholder="请选择所属地区" />
              </div>
              <div className={styles.selectItem}>
                <span className={styles.selectLabel}>年份：</span>
                <Select value={yearVal} allowClear onChange={this.handleChangeYear.bind(this)} className={styles.selectInfo1} placeholder="请选择年份">
                  {
                    yearList.map(item => <Option value={item.value} key={item.value}>{item.name}</Option>)
                  }
                </Select>
              </div>
            </div>
          </div>
          <Button type="dashed" style={{ margin: '0 20px 0 auto' }} onClick={this.handleProductReport.bind(this)}>生成报表</Button>
        </div>

        {/* <div className={styles.piePicture}>
          <div className={`${styles.pieItem} ${styles.pieItem50}`}>
            <PiePicture id="welfarePie1" options={onePieOption} />
            <a className={styles.pieLook} onClick={this.handleModalConfig.bind(this, 5)}>查看所有排名</a>
          </div>
        </div> */}

        <div className={styles.piePicture}>
          <div className={`${styles.pieItem} ${styles.pieItem100}`}>
            <BarPicture id="welfareBar1" options={oneBarOption} />
          </div>

        </div>
        {
          modalConfig.visible ? <TableModal modalConfig={modalConfig} villageList={villageList} hideModal={this.handleHideModal.bind(this)} /> : null
        }
      </div>
    )
  }
}
