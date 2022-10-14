import React from 'react';
import { Button, Cascader, Input, Modal, Pagination, Select, Table, DatePicker } from 'antd';
import { articleSort, productStatList, activityStatList, stockStatList, stockSumList, activityViewsRank, activityUserRank, integralList } from '@/services/dataCenter';
import styles from '../index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
export default class TableModal extends React.Component {
  constructor(props) {
    super(props);
    const { modalConfig, villageList } = props;
    let fullYear = new Date().getFullYear(), arrYear = [];
    for (let i = 0; i < 30; i++) {
      arrYear.push({ name: fullYear - i + '年', value: fullYear - i });
    }
    this.state = {
      villageList,
      yearList: arrYear,
      modalConfig,
      columns: [],
      dataSource: [],
      total: 100,
      status: 1,
      classifyList: [{ name: '全部', value: '' }, { name: '党务', value: 6 }, { name: '财务', value: 5 }, { name: '村务', value: 4 }],
      chooseTime: [],
      chooseTime1: null,
      classifyVal: undefined,
      articleTitle: '',
      areaList: [],
      sortList: [
        {
          name: '正序',
          value: 'asc'
        },
        {
          name: '降序',
          value: 'desc'
        }
      ],
      sortVal: null,
      yearVal: (new Date()).getFullYear() - 1,
      otherYear: (new Date()).getFullYear(),
      sortType: undefined,
      compare: undefined,
      activeName: undefined,
      page: 1,
      total: 0
    };
  }
  componentDidMount() {
    this.getTableModals();
  }
  getTableModals() {
    const { activeName, modalConfig, articleTitle, chooseTime, classifyVal, areaList, sortVal, compare, sortType } = this.state;
    let columns = [], dataSource = [];
    switch (modalConfig.type) {
      case 1:
        columns = [
          {
            key: 'village_id',
            dataIndex: 'village_id',
            width: 70,
            title: '排名',
            render: (_, record, index) => {
              return index + 1
            }
          },
          {
            key: 'article_count',
            dataIndex: 'article_count',
            title: '文章总数',
            align: 'center'
          },
          {
            key: 'proportion',
            dataIndex: 'proportion',
            title: '占比',
            align: 'center'
          },
          {
            key: 'area',
            dataIndex: 'area',
            width: 200,
            title: '所属地区',
            align: 'center'
          },
          {
            key: 'category_name',
            dataIndex: 'category_name',
            title: '分类',
            align: 'center'
          },
          {
            key: 'created_date',
            dataIndex: 'created_date',
            title: '时间',
            align: 'center'
          }
        ];
        let dataOne = {
          city_id: modalConfig.data.city_id,
          town_id: areaList.length > 1 ? areaList[1] : undefined,
          type: 1,
          switch: 2,
          category_id: classifyVal,
          sort: sortVal ? sortVal : undefined,
          village_id: areaList.length == 3 ? areaList[2] : undefined,
          year: this.state.yearVal || undefined
        };
        this.getArticleList(dataOne);
        break;
      case 2:
        columns = [{
          key: 'village_id',
          dataIndex: 'village_id',
          width: 70,
          title: '排名',
          render: (_, record, index) => {
            return index + 1;
          }
        },
        {
          key: 'views',
          dataIndex: 'views',
          title: '累计点击次数',
          align: 'center'
        },
        {
          key: 'proportion',
          dataIndex: 'proportion',
          title: '占比',
          align: 'center'
        },
        {
          key: 'area',
          dataIndex: 'area',
          title: '所属地区',
          align: 'center'
        },
        {
          key: 'category_name',
          dataIndex: 'category_name',
          title: '分类',
          align: 'center'
        },
        {
          key: 'year',
          dataIndex: 'year',
          title: '年份',
          align: 'center'
        },
        {
          key: 'today_click',
          dataIndex: 'today_click',
          title: '今日点击',
          align: 'center'
        }];
        let dataTwo = {
          city_id: modalConfig.data.city_id,
          type: 1,
          switch: 1,
          category_id: classifyVal,
          sort: sortVal ? sortVal : undefined,
          village_id: areaList.length == 3 ? areaList[2] : undefined,
          year: this.state.yearVal || undefined
        };
        this.getArticleList(dataTwo);
        break;
      case 3:
        columns = [{
          key: 'index',
          dataIndex: 'index',
          title: '排名',
          width: '60px',
          render: (text, record, index) => (<span>{index + 1}</span>),
        },
        {
          key: 'count',
          dataIndex: 'count',
          title: '累计打分次数',
          align: 'center'
        },
        {
          key: 'proportion',
          dataIndex: 'proportion',
          title: '打分次数占比',
          align: 'center'
        },
        {
          key: 'item_name',
          dataIndex: 'item_name',
          title: '打分名称',
          align: 'center'
        },
        {
          key: 'area',
          dataIndex: 'area',
          title: '所属地区',
          align: 'center'
        },
        {
          key: 'family_count',
          dataIndex: 'family_count',
          title: '参与家庭数',
          align: 'center'
        },
        {
          key: 'integral',
          dataIndex: 'integral',
          title: '累计打分值',
          align: 'center'
        }];
        let dataThree = {
          village_id: modalConfig.data.village,
          year: this.state.yearVal || undefined
        };
        this.getIntegralList(dataThree);
        break;
      case 4:
        columns = [
          {
            key: 'village_id',
            dataIndex: 'village_id',
            title: '村ID'
          },
          {
            key: 'area',
            dataIndex: 'area',
            title: '所属地区',
            align: 'center'
          },
          {
            key: 'year',
            dataIndex: 'year',
            title: '年份',
            align: 'center'
          },
          {
            key: 'c',
            dataIndex: 'c',
            title: '发布数量',
            align: 'center'
          },
          {
            key: 'percent',
            dataIndex: 'percent',
            title: '占比',
            align: 'center'
          }
        ];
        let dataFour = {
          city: modalConfig.data.city,
          town_id: areaList.length > 1 ? areaList[2] : undefined,
          village_id: areaList.length > 2 ? areaList[3] : undefined,
          y: this.state.yearVal,
          order: sortVal ? sortVal : undefined
        };
        this.getActivityStatList(dataFour);
        break;
      case 5:
        columns = [
          {
            key: 'product_id',
            dataIndex: 'product_id',
            title: '商品id'
          },
          {
            key: 'product_name',
            dataIndex: 'product_name',
            title: '商品名称',
            align: 'center'
          },
          {
            key: 'area',
            dataIndex: 'area',
            title: '所属地区',
            align: 'center'
          },
          {
            key: 'year',
            dataIndex: 'year',
            title: '年份',
            align: 'center'
          },
          {
            key: 'sum_number',
            dataIndex: 'sum_number',
            title: '兑换数量',
            align: 'center'
          },
          {
            key: 'percent',
            dataIndex: 'percent',
            title: '占比',
            align: 'center'
          }
        ];
        let dataFive = {
          year: this.state.yearVal || undefined,
          city_id: modalConfig.data.city_id,
          town_id: areaList.length > 1 ? areaList[1] : undefined,
          village_id: areaList.length == 3 ? areaList[2] : undefined,
          order: sortVal ? sortVal : undefined,
          page: this.state.page
        };
        this.getWelfareList(dataFive);
        break;
      case 6:
        columns = [
          {
            key: 'village_id',
            dataIndex: 'village_id',
            width: 70,
            title: '排名',
            render: (_, record, index) => index + 1
          },
          {
            key: 'views',
            dataIndex: 'views',
            title: '累计点击次数',
            align: 'center'
          },
          {
            key: 'proportion',
            dataIndex: 'proportion',
            title: '占比',
            align: 'center'
          },
          {
            key: 'area',
            dataIndex: 'area',
            title: '所属地区',
            align: 'center'
          },
          {
            key: 'category_name',
            dataIndex: 'category_name',
            title: '分类',
            align: 'center'
          },
          {
            key: 'year',
            dataIndex: 'year',
            title: '年份',
            align: 'center'
          },
          {
            key: 'today_click',
            dataIndex: 'today_click',
            title: '今日点击',
            align: 'center'
          }
        ];
        let datas = {
          town_id: areaList.length > 1 ? areaList[1] : modalConfig.data.town_id,
          type: 2,
          category_id: classifyVal,
          sort: sortVal ? sortVal : undefined,
          village_id: areaList.length == 3 ? areaList[2] : undefined,
          year: this.state.yearVal || undefined
        };
        this.getArticleList(datas);
        break;
      case 7:
        columns = [
          {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            render: (a, b, index) => {
              return index + 1
            }
          },
          {
            key: 'area',
            dataIndex: 'area',
            title: '所属地区',
            align: 'center'
          },
          {
            key: 'total_family',
            dataIndex: 'total_family',
            title: '参与打分家庭',
            align: 'center'
          },
          {
            key: 'sum_integral',
            dataIndex: 'sum_integral',
            title: '总积分',
            align: 'center'
          },
          {
            key: 'sum_integral_bonus',
            dataIndex: 'sum_integral_bonus',
            title: '总积分分红',
            align: 'center'
          }
        ];
        let dataSeven = {
          city_id: 1,
          year: this.state.yearVal,
          town_id: areaList.length > 1 ? areaList[1] : undefined,
          village_id: areaList.length > 2 ? areaList[2] : undefined,
          order: sortVal ? sortVal : undefined
        };
        this.getStockSumList(dataSeven);
        break;
      case 8:
        columns = [
          {
            key: 'article_id',
            dataIndex: 'article_id',
            title: '文章ID'
          },
          {
            width: 200,
            key: 'title',
            dataIndex: 'title',
            title: '文章标题',
            align: 'center',
            ellipsis: true
          },
          {
            key: 'area',
            dataIndex: 'area',
            title: '所属地区',
            align: 'center'
          },
          {
            key: 'created_date',
            dataIndex: 'created_date',
            title: '创建时间',
            align: 'center'
          },
          {
            key: 'views',
            dataIndex: 'views',
            title: '累计点击量',
            align: 'center'
          },
          {
            key: 'proportion',
            dataIndex: 'proportion',
            title: '点击次数占比',
            align: 'center'
          }
        ];
        let data = {
          type: 3,
          title: articleTitle ? articleTitle : undefined,
          start_time: chooseTime.length > 0 && chooseTime[0] ? chooseTime[0] : undefined,
          end_time: chooseTime.length > 0 && chooseTime[1] ? chooseTime[1] : undefined,
          category_id: classifyVal,
          village_id: modalConfig.data.village_id
        };
        this.getArticleList(data);
        break;
      case 9:
        columns = [
          {
            key: 'id',
            dataIndex: 'id',
            title: '活动ID'
          },
          {
            key: 'activity_name',
            dataIndex: 'activity_name',
            title: '活动名称',
            align: 'center'
          },
          {
            key: 'area',
            dataIndex: 'area',
            title: '所属地区',
            align: 'center'
          },
          {
            key: 'created_at',
            dataIndex: 'created_at',
            title: '创建时间',
            align: 'center'
          },
          {
            key: 'users',
            dataIndex: 'users',
            title: '参与人数',
            align: 'center'
          },
          {
            key: 'score',
            dataIndex: 'score',
            title: '活动分值',
            align: 'center'
          },
          {
            key: 'percent',
            dataIndex: 'percent',
            title: '活动参与人数占比',
            align: 'center'
          }
        ];
        let dataNine = {
          city_id: modalConfig.data.city,
          town_id: modalConfig.data.town,
          village_id: modalConfig.data.village,
          begin_time: chooseTime.length > 0 && chooseTime[0] ? chooseTime[0] : undefined,
          end_time: chooseTime.length > 0 && chooseTime[1] ? chooseTime[1] : undefined,
          order: sortVal ? sortVal : undefined
        };
        this.getActivityUserRank(dataNine);
        break;
      case 10:
        columns = [
          {
            key: 'id',
            dataIndex: 'id',
            title: '活动ID'
          },
          {
            key: 'activity_name',
            dataIndex: 'activity_name',
            title: '活动名称',
            align: 'center'
          },
          {
            key: 'area',
            dataIndex: 'area',
            title: '所属地区',
            align: 'center'
          },
          {
            key: 'created_at',
            dataIndex: 'created_at',
            title: '创建时间',
            align: 'center'
          },
          {
            key: 'users',
            dataIndex: 'users',
            title: '参与人数',
            align: 'center'
          },
          {
            key: 'score',
            dataIndex: 'score',
            title: '活动分值',
            align: 'center'
          },
          {
            key: 'allviews',
            dataIndex: 'allviews',
            title: '查看人数',
            align: 'center'
          }
        ];
        let dataTen = {
          name: activeName,
          order: sortVal ? sortVal : undefined,
          begin_time: chooseTime.length > 0 && chooseTime[0] ? chooseTime[0] : undefined,
          end_time: chooseTime.length > 0 && chooseTime[1] ? chooseTime[1] : undefined,
          city_id: modalConfig.data.city,
          town_id: modalConfig.data.town,
          village_id: modalConfig.data.village
        };
        this.getActivityViewsRank(dataTen);
        break;
      case 11:
        columns = [
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

        ];
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        let dataEven = {
          city_id: 1,
          year: this.state.otherYear,
          town_id: userInfo.town_id,
          village_id: userInfo.village_id,
          order: sortVal ? sortVal : undefined,
          compare: compare ? compare : undefined,
          sort_type: sortType ? sortType : undefined
        };
        this.getStockStatList(dataEven);
        break;
      default:
        break;
    }
    this.setState({
      columns
    });
  }
  getIntegralList(data) {
    integralList(data).then(res => {
      if (res.code == 0) {
        res.data.map(item => item.key = item.item_id);
        this.setState({
          dataSource: res.data
        });
      }
    });
  }
  getActivityUserRank(data) {
    activityUserRank(data).then(res => {
      if (res.code == 0) {
        res.data.map(item => item.key = item.id);
        this.setState({
          dataSource: res.data
        });
      }
    })
  }
  getActivityViewsRank(data) {
    activityViewsRank(data).then(res => {
      if (res.code == 0) {
        res.data.map(item => item.key = item.id);
        this.setState({
          dataSource: res.data
        });
      }
    })
  }
  getStockSumList(data) {
    stockSumList(data).then(res => {
      if (res.code == 0) {
        res.data.map((item, index) => item.key = index);
        this.setState({
          dataSource: res.data
        });
      }
    })
  }
  getStockStatList(data) {
    stockStatList(data).then(res => {
      if (res.code == 0) {
        res.data.data.map(item => item.key = item.id);
        this.setState({
          dataSource: res.data.data
        });
      }
    })
  }
  getActivityStatList(data) {
    activityStatList(data).then(res => {
      if (res.code == 0) {
        res.data.map((item, index) => {
          item.key = index;
        });
        this.setState({
          dataSource: res.data
        });
      }
    })
  }
  getWelfareList(data) {
    productStatList(data).then(res => {
      if (res.code == 0) {
        res.data.data.map(item => item.key = item.product_id);
        this.setState({
          total: res.data.total,
          dataSource: res.data.data
        });
      }
    })
  }
  getArticleList(data) {
    articleSort(data).then(res => {
      if (res.code == 0) {
        if (res.data.data) {
          res.data.data.map((item, index) => {
            item.key = index;
          })
          this.setState({
            dataSource: res.data.data
          });
        } else {
          this.setState({
            dataSource: []
          });
        }
      }
    });
  }
  handleChangeTime(e, time) {
    this.setState({
      chooseTime: time,
      chooseTime1: e
    });
  }
  handleChangeClassify(e) {
    this.setState({
      classifyVal: e
    });
  }
  handleChangeTitle(e) {
    this.setState({
      articleTitle: e.target.value
    });
  }
  handleCancel() {
    this.props.hideModal();
  }
  // 搜索
  handleSearch = () => {
    this.getTableModals();
  }
  // 重置
  handleReset = () => {
    this.setState({
      chooseTime: [],
      chooseTime1: null,
      classifyVal: undefined,
      articleTitle: undefined,
      yearVal: (new Date()).getFullYear(),
      areaList: [],
      sortVal: undefined,
      sortType: undefined,
      compare: undefined
    }, () => {
      this.getTableModals();
    });
  }
  // 选择地区
  handleChangeAreaInfo(e) {
    this.setState({
      areaList: e
    });
  }
  // 导出
  handleExportTable() {
    const { activeName, modalConfig, yearVal, otherYear, areaList, classifyVal, sortVal, chooseTime, articleTitle, compare, sortType } = this.state;
    const adminId = JSON.parse(localStorage.getItem('userInfo')).admin_id;
    switch (modalConfig.type) {
      case 1:
        window.open(
          '/farmapi/gateway?api_name=article_list&version=1.2.0&os=h5&sign&is_export=1&type=1&city_id=' + modalConfig.data.city_id + '&switch=2'
          + (yearVal ? '&year=' + yearVal : '')
          + (sortVal ? '&sort=' + sortVal : '')
          + (areaList.length == 3 ? '&village_id=' + areaList[2] : '')
          + (areaList.length > 1 ? '&town_id=' + areaList[1] : '')
          + (classifyVal ? '&category_id=' + classifyVal : '')
        )
        break;
      case 2:
        window.open(
          '/farmapi/gateway?api_name=article_list&version=1.2.0&os=h5&sign&is_export=1&type=1&city_id=' + modalConfig.data.city_id + '&switch=1'
          + (yearVal ? '&year=' + yearVal : '')
          + (sortVal ? '&sort=' + sortVal : '')
          + (areaList.length == 3 ? '&village_id=' + areaList[2] : '')
          // + (areaList.length > 1 ? '&town_id=' + areaList[1] : '')
          + (classifyVal ? '&category_id=' + classifyVal : '')
        )
        break;
      case 3:
        window.open(
          '/farmapi/gateway?api_name=integral_list&version=1.2.0&os=h5&sign&is_export=1&village_id=' + modalConfig.data.village
          + (yearVal ? '&year=' + yearVal : '')
          + (sortVal ? '&sort=' + sortVal : '')
        )
        break;
      case 4:
        window.open(
          '/farmapi/gateway?api_name=activity_stat_list&version=1.2.0&os=h5&sign&is_export=1&city_id=' + modalConfig.data.city_id
          + (yearVal ? '&year=' + yearVal : '')
          + (sortVal ? '&order=' + sortVal : '')
          + (areaList.length == 3 ? '&village_id=' + areaList[2] : '')
          + (areaList.length > 1 ? '&town_id=' + areaList[1] : '')
        )
        break;
      case 5:
        window.open(
          '/farmapi/gateway?api_name=product_stat_list&version=1.2.0&os=h5&sign&is_export=1&city_id=' + modalConfig.data.city_id
          + (yearVal ? '&year=' + yearVal : '')
          + (sortVal ? '&order=' + sortVal : '')
          + (areaList.length == 3 ? '&village_id=' + areaList[2] : '')
          + (areaList.length > 1 ? '&town_id=' + areaList[1] : '')
        )
        break;
      case 6:
        window.open(
          '/farmapi/gateway?api_name=article_list&version=1.2.0&os=h5&sign&is_export=1&type=2&town_id=' + (areaList.length > 1 ? areaList[1] : modalConfig.data.town_id)
          + (yearVal ? '&year=' + yearVal : '')
          + (sortVal ? '&sort=' + sortVal : '')
          + (areaList.length == 3 ? '&village_id=' + areaList[2] : '')
          + (classifyVal ? '&category_id=' + classifyVal : '')
        )
        break;
      case 7:
        window.open(
          '/farmapi/gateway?api_name=stock_sum_list&version=1.2.0&os=h5&sign&is_export=1&city_id=1'
          + (yearVal ? '&year=' + yearVal : '')
          + (sortVal ? '&sort=' + sortVal : '')
          + (areaList.length > 1 ? '&town_id=' + areaList[1] : '')
          + (areaList.length > 2 ? '&village_id=' + areaList[2] : '')
        )
        break;
      case 8:
        window.open(
          '/farmapi/gateway?api_name=article_list&version=1.2.0&os=h5&sign&is_export=1&type=3&village_id=' + modalConfig.data.village_id
          + (classifyVal ? '&category_id=' + classifyVal : '')
          + (chooseTime.length > 0 && chooseTime[0] ? '&start_time=' + chooseTime[0] : '')
          + (chooseTime.length > 0 && chooseTime[0] ? '&end_time=' + chooseTime[1] : '')
          + (articleTitle ? '&title=' + articleTitle : '')
        )
        break;
      case 9:
        window.open(
          '/farmapi/gateway?api_name=activity_user_rank&version=1.2.0&os=h5&sign&is_export=1&village_id=' + modalConfig.data.village_id
          + '&city_id=1&town_id=' + modalConfig.data.town
          + (sortVal ? '&order=' + sortVal : '')
          + (chooseTime.length > 0 && chooseTime[0] ? '&begin_time=' + chooseTime[0] : '')
          + (chooseTime.length > 0 && chooseTime[0] ? '&end_time=' + chooseTime[1] : '')
        )
        break;
      case 10:
        window.open(
          '/farmapi/gateway?api_name=activity_views_rank&version=1.2.0&os=h5&sign&is_export=1&village_id=' + modalConfig.data.village_id
          + (activeName ? '&name=' + activeName : ''),
          + '&city_id=1&town_id=' + modalConfig.data.town
          + (sortVal ? '&order=' + sortVal : '')
          + (chooseTime.length > 0 && chooseTime[0] ? '&begin_time=' + chooseTime[0] : '')
          + (chooseTime.length > 0 && chooseTime[0] ? '&end_time=' + chooseTime[1] : '')
        )
        break;
      case 11:
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        window.open(
          '/farmapi/gateway?api_name=stock_stat_list&version=1.2.0&os=h5&sign&is_export=1&city_id=1'
          + (otherYear ? '&year=' + otherYear : '')
          + `&town_id=${userInfo.town_id}&village_id=${userInfo.village_id}`
          + (sortVal ? '&sort=' + sortVal : '')
          + (compare ? '&compare=' + compare : '')
          + (sortType ? '&sort_type=' + sortType : '')
        )
        break;
    }
  }
  // 分页
  handleChangePagin(e) {
    const { yearVal, modalConfig, areaList, sortVal } = this.state;
    this.setState({
      page: e
    }, () => {
      let dataFive = {
        year: yearVal || undefined,
        city_id: modalConfig.data.city_id,
        town_id: areaList.length > 1 ? areaList[1] : undefined,
        village_id: areaList.length == 3 ? areaList[2] : undefined,
        order: sortVal ? sortVal : undefined,
        page: e
      };
      this.getWelfareList(dataFive);
    });
  }
  render() {
    const { activeName, sortType, compare, villageList, yearList, columns, dataSource, total, status, modalConfig, classifyVal, classifyList, articleTitle, sortVal, chooseTime1, sortList, yearVal, otherYear, areaList } = this.state;
    return (
      <Modal width={1150} visible={modalConfig.visible} footer={null} title={modalConfig.title} onCancel={this.handleCancel.bind(this)}>
        {/* 平湖各村三务发布数量排名 */}
        <div className={styles.modalTable}>
          {/* 搜索 */}
          <div className={styles.modalSearch}>
            <ul className={styles.searchLeft}>
              {
                modalConfig.type == 8 ? <li>
                  文章标题：
                 <Input type="text" value={articleTitle} onChange={this.handleChangeTitle.bind(this)} placeholder="请输入文章标题" className={styles.searchItem} />
                </li> : null
              }
              {
                modalConfig.type == 9 || modalConfig.type == 10 ? <li>
                  活动名称：
                <Input type="text" value={activeName} onChange={e => this.setState({ activeName: e.target.value })} placeholder="请输入活动名称" className={styles.searchItem} />
                </li> : null
              }
              {
                modalConfig.type == 11 ? <li>
                  排序类型：
                <Select placeholder="请选择排序类型" value={sortType} allowClear onChange={e => this.setState({ sortType: e })} className={styles.searchItem}>
                    <Option key={12} value={1}>按积分</Option>
                    <Option key={13} value={2}>按股份</Option>
                  </Select>
                </li> : null
              }
              {
                modalConfig.type == 11 ? <li>
                  积分筛选：
                <Select placeholder="请选择筛选的积分" value={compare} allowClear onChange={(e) => this.setState({ compare: e })} className={styles.searchItem}>
                    <Option key={1} value={1}>低于100分</Option>
                    <Option key={2} value={2}>高于100分</Option>
                  </Select>
                </li> : null
              }
              {
                modalConfig.type == 8 || modalConfig.type == 9 || modalConfig.type == 10 ? <li>
                  创建时间：
                <RangePicker value={chooseTime1} onChange={this.handleChangeTime.bind(this)} />
                </li> : null
              }
              {
                modalConfig.type != 3 && modalConfig.type != 8 && modalConfig.type != 9 && modalConfig.type != 10 && modalConfig.type != 11 ? <li>
                  所属地区：
                  <Cascader options={villageList} changeOnSelect value={areaList} onChange={this.handleChangeAreaInfo.bind(this)} placeholder="请选择" className={styles.searchItem} />
                </li> : null
              }
              {
                modalConfig.type != 3 && modalConfig.type != 4 && modalConfig.type != 5 && modalConfig.type != 7 && modalConfig.type != 9 && modalConfig.type != 10 && modalConfig.type != 11 ? <li>
                  分类：
                  <Select placeholder="请选择分类内容" value={classifyVal} allowClear onChange={this.handleChangeClassify.bind(this)} className={styles.searchItem}>
                    {
                      classifyList.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                    }
                  </Select>
                </li> : null
              }
              {
                modalConfig.type != 8 && modalConfig.type != 3 ? <li>
                  排序：
                  <Select placeholder="请选择排序方式" value={sortVal} allowClear onChange={(e) => { this.setState({ sortVal: e }); }} className={styles.searchItem}>
                    {
                      sortList.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                    }
                  </Select>
                </li> : null
              }
              {
                modalConfig.type != 8 && modalConfig.type != 9 && modalConfig.type != 10 ? <li>
                  年份：
                   <Select placeholder="请选择年份" value={modalConfig.type == 11 ? otherYear : yearVal} onChange={(e) => { modalConfig.type == 11 ? this.setState({ otherYear: e || (new Date()).getFullYear() }) : this.setState({ yearVal: e || (new Date()).getFullYear() }) }} className={styles.searchItem}>
                    {
                      yearList.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                    }
                  </Select>
                </li> : null
              }
              {/* {
                modalConfig.type == 11 ? <li>
                年份：
                 <Select placeholder="请选择年份" value={yearVal} onChange={(e) => { this.setState({ yearVal: e || 2019 }) }} className={styles.searchItem}>
                  {
                    yearList.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)
                  }
                </Select>
              </li> : null
              } */}
            </ul>
            {/* 重置 */}
            <div>
              <Button type="primary" className={styles.SearchBtn} onClick={this.handleSearch}>搜索</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </div>
          </div>
          {/* 导出 */}
          <p className={styles.modalExport}>
            <Button type="primary" className={styles.exportBtn} onClick={this.handleExportTable.bind(this)}>导出</Button>
          </p>
          {/* 表格区域 */}
          <Table
            className={styles.tableInfo}
            scroll={{ y: 400 }}
            pagination={false}
            columns={columns}
            dataSource={dataSource}
          />
          {
            modalConfig.type == 5 ? <Pagination total={this.state.total} current={this.state.page} onChange={this.handleChangePagin.bind(this)} showQuickJumper className={styles.tablePagination} /> : null
          }
        </div>
      </Modal >
    )
  }
}
