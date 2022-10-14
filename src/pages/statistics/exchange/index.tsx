import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, Modal, message, Switch, Cascader, DatePicker } from 'antd';
import Moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
// import { TableListItem } from './data.d';
import {
  exchangeList,
  exchangeChart
} from '@/services/home';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './style.less';
import { ConnectProps } from '../../../.umi/plugin-dva/connect';
import { truncate } from 'lodash';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';

const IntegralStatistics: React.FC<any> = (props) => {
  const echarts = require('echarts/lib/echarts');
  const actionRef = useRef<ActionType>();
  const [ moduleVisible, handleModuleVisible ] = useState(false)
  const [ formValue, setFormValues ] = useState<any>({})
  const { accountInfo, areaList } = props
  const [ fullYear, getYear ] = useState('')
  const [ newAreaList, resetArea ] = useState<any>([])

  const config = {
    legend: {},
    tooltip: {},
    dataset: {
        source: []
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        rotate: -60
      }
    },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
        {type: 'bar'},
        {type: 'bar'}
    ]
  }


  interface TableListItem {
    product_id: number,
    product_name: string,
    integral: string,
    quantity: string,
    description: string,
    process: string,
    prompt: string,
    area: string,
    exchange: string,
    is_show: number,
    created_at: string,
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'village_id',
      hideInSearch: true,
      width: 100
    },
    {
      title: '所属村',
      dataIndex: 'village_name',
      hideInSearch: true
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let newAreaLists=(accountInfo.role_type==4&&newAreaList.length!=0)?newAreaList[0].children:newAreaList;
        return (
          <Cascader options={newAreaLists} changeOnSelect/>
        )
      },
    },
    {
      title: '福利商品数量',
      dataIndex: 'count',
      hideInSearch: true
    },
    {
      title: '福利商品总库存',
      dataIndex: 'inventory',
      hideInSearch: true,
    },
    {
      title: '已兑换福利商品数量',
      dataIndex: 'exchange',
      hideInSearch: true,
    },
    {
      title: '年份',
      dataIndex: 'year',
      renderFormItem: (item, props) => {
        return (
          <DatePicker onChange={onChange} picker="year" />
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <>
          <ButtonAuth type="EXCHANGE_STATISTICS">
            <a
              onClick={() => {
                setFormValues(record)
                checkStatistics(record)
              }}>
              查看统计图
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ]

  const getIntegralGoodsList = async (val: any) => {
    let userInfo=localStorage.getItem('userInfo');
    let user=JSON.parse(userInfo);
    if(val.area) {
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
      // let len = val.area.length
      // if(len === 1) {
      //   val.city_id = val.area[0]
      // } else if(len === 2) {
      //   val.city_id = val.area[0]
      //   val.town_id = val.area[1]
      // } else {
      //   val.city_id = val.area[0]
      //   val.town_id = val.area[1]
      //   val.village_id = val.area[2]
      // }
    } else {
      val.city_id = accountInfo.city_id
      val.town_id = accountInfo.town_id
      val.village_id = accountInfo.village_id
    }
    fullYear ? val.year = fullYear : val.year = new Date().getFullYear()
    val.area=undefined;
    const params = paginationHandle(val)
    const _data = await exchangeList(params)

    // console.log(areaList, 'arealist')
    // console.log(accountInfo, 'accountInfo')
    const arr = areaList
    if(accountInfo.role_type === 4) {
      arr.map((item: any, index: any) => {
        if(item.value !== accountInfo.city_id) {
          item.disabled = true
        }
        item.children.map((town: any) => {
          if(town.value !== accountInfo.town_id) {
            town.disabled = true
          }
        })
      })
    }
    resetArea(arr)

    return tableDataHandle(_data)
  }

  const onChange = async (date: any, dataString: any) => {
    getYear(dataString)
  }

  const checkStatistics = async (record: any) => {
    const _data = await exchangeChart({village_id: record.village_id, year: record.year})
    if(_data.data.x.length) {
      let arr = Array(_data.data.x.length).fill().map((item: any, index: any) => {
        return [_data.data.x[index], _data.data.y[index].exchange, _data.data.y[index].inventory]
      })
      arr.unshift(['product', '已兑换数量', '库存数量'])
      config.dataset.source = arr
      handleModuleVisible(true);
      setFormValues(record);
      setTimeout(() => {
        const issueConfig = echarts.init(document.getElementById('issue'));
        issueConfig.setOption({
          ...config,
        });
      }, 500)
    } else {
      message.info('暂无数据');
    }
  }

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="village_id"
        options={false}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        toolBarRender={false}
        tableAlertRender={false}
        request={(params) => getIntegralGoodsList(params)}
        columns={columns}
      />
      {
        moduleVisible ? (
          <Modal
            destroyOnClose
            width={'70%'}
            maskClosable= {false}
            title={'福利兑换统计（' + formValue.village_name + '-' + formValue.year + '年）'}
            visible={moduleVisible}
            onOk={() => {
              handleModuleVisible(false)
            }}
            onCancel={() => {
              handleModuleVisible(false)
            }}
          >
            <div id="issue" style={{width: '100%',height: '500px'}}></div>
          </Modal>
        ) : null
      }
    </PageHeaderWrapper>
  )
}

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(IntegralStatistics)
