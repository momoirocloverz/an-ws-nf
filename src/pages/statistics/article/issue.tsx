import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, Modal, message, Switch, Cascader, DatePicker, Select, Form } from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
// import { TableListItem } from './data.d';
import {
  articleIssue
} from '@/services/home';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './style.less';
import { ConnectProps } from '../../../.umi/plugin-dva/connect';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';


const { Option } = Select

const issueStatistics: React.FC<any> = (props) => {
  const echarts = require('echarts/lib/echarts');
  const { accountInfo, areaList } = props
  const areaLists=(accountInfo.role_type==4&&areaList.length!=0)?areaList[0].children:areaList;
  const [fullYear, getYear] = useState('')
  const [form] = Form.useForm();
  const config = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      }
    },
    legend: {
      data: ['累计发布', '累计点击数']
    },
    xAxis: [
      {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '累计发布',
        axisLabel: {
          formatter: '{value} 篇'
        }
      },
      {
        type: 'value',
        name: '累计点击数',
        axisLabel: {
          formatter: '{value} 次'
        }
      }
    ],
    series: [
      {
        name: '累计发布',
        type: 'bar',
        data: []
      },
      {
        name: '累计点击数',
        type: 'line',
        yAxisIndex: 1,
        data: []
      }
    ]
  }
  const typeList = [
    {
      label: '全部',
      value: '0'
    },
    {
      label: '村务',
      value: '4'
    },
    {
      label: '财务',
      value: '5'
    },
    {
      label: '党务',
      value: '6'
    },
  ]

  // 获取图表数据
  const initChart = async (val: any) => {
    let userInfo=localStorage.getItem('userInfo');
    let user=JSON.parse(userInfo);
    if (val.area) {
      // val.city_id = val.area[0] ? val.area[0] : 0
      // val.town_id = val.area[1] ? val.area[1] : 0
      // val.village_id = val.area[2] ? val.area[2] : 0
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
    } else {
      val.city_id = accountInfo.city_id
      val.town_id = accountInfo.town_id
      val.village_id = accountInfo.village_id
    }
    val.category_id ? val.category_id = val.category_id : val.category_id = 0
    fullYear ? val.year = fullYear : val.year = new Date().getFullYear()
    val.area=undefined;
    const _data = await articleIssue(val)
    const sendList: any = []
    const clickTimes: any = []
    if (_data.code === 0 && _data.data.x.length) {
      _data.data.y.map((item: any) => {
        sendList.push(item.published)
        clickTimes.push(item.views)
      })
    }
    config.series[0].data = sendList
    config.series[1].data = clickTimes
    const issueConfig = echarts.init(document.getElementById('issue'));
    issueConfig.setOption({
      ...config,
    });
  }

  // 表单提交
  const onFinish = async (values: any) => {
    const params = values
    if (values.year) {
      params.year = values.year._d.getFullYear()
    }
    initChart(params)
  };

  const resetValues = async () => {
    form.resetFields()
    onFinish({})
  }

  // 监听年份入参变化
  const onChange = async (date: any, dataString: any) => {
    getYear(dataString)
  }

  useEffect(() => {
    initChart({})
  }, [])


  return (
    <div className={styles.Background}>
      <Form
        onFinish={onFinish}
        className={styles.form}
        form={form}
      >
        <Form.Item
          label="所属地区"
          name="area"
          className={styles.item}
        >
        <Cascader options={areaLists} placeholder="请选择所属地区" changeOnSelect/>
        </Form.Item>
        <Form.Item
          label="分类"
          name="category_id"
          className={styles.item}
        >
          <Select placeholder="请选择分类">
            {
              typeList.map((item: any) => {
                return <Option value={item.value}>{item.label}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="年份"
          name="year"
          className={styles.item}
        >
          <DatePicker onChange={onChange} placeholder="请选择年份" picker="year" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            筛 选
          </Button>
          <Button onClick={resetValues} className={styles.resetBtn}>
            重 置
          </Button>
        </Form.Item>
      </Form>
      <div id="issue" style={{ width: '100%', height: '500px' }}></div>
    </div>
  )
}

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList
}))(issueStatistics)
