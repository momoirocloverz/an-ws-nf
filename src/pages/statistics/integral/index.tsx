import { Modal, message, Cascader, DatePicker } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  integralTypeList,
  integralchart
} from '@/services/home';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';

const IntegralStatistics: React.FC<any> = (props) => {
  const echarts = require('echarts/lib/echarts');
  const actionRef = useRef<ActionType>();
  const [moduleVisible, handleModuleVisible] = useState(false)
  const [formValue, setFormValues] = useState<any>({})
  const { accountInfo, areaList } = props
  const [fullYear, getYear] = useState('')
  const config = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [
      {
        type: 'category',
        data: [],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '该项总打分',
        type: 'bar',
        barWidth: '60%',
        data: []
      },
      {
        name: '累计次数',
        type: 'bar',
        barWidth: '0%',
        data: []
      },
      {
        name: '打分次数比重(%)',
        type: 'bar',
        barWidth: '0%',
        data: []
      }
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
        let areaLists = (accountInfo.role_type == 4 && areaList.length != 0) ? areaList[0].children : areaList;
        return (
          <Cascader options={areaLists} placeholder="请选择所属地区" changeOnSelect />
        )
      },
    },
    {
      title: '打分项数量',
      dataIndex: 'count_items',
      hideInSearch: true
    },
    {
      title: '累计打分次数',
      dataIndex: 'times',
      hideInSearch: true,
    },
    {
      title: '累计打分值',
      dataIndex: 'sum_integral',
      hideInSearch: true,
    },
    {
      title: '年份',
      dataIndex: 'year',
      renderFormItem: (item, props) => {
        return (
          <DatePicker onChange={onChange} placeholder="请选择年份" picker="year" />
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
          <ButtonAuth type="INTEGRAL_STATISTICS">
            <a
              onClick={() => {
                setFormValues(record);
                checkStatistics(record)
              }}>
              查看统计图
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ]

  // 获取列表数据
  const getIntegralGoodsList = async (val: any) => {
    let userInfo = localStorage.getItem('userInfo');
    let user = JSON.parse(userInfo);
    if (val.area) {
      val.city_id = user.role_type == 4 ? user.city_id : val.area[0];
      val.town_id = user.role_type == 4 ? val.area[0] : val.area[1];
      val.village_id = user.role_type == 4 ? val.area[1] : val.area[2];

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
    val.area = undefined;
    const params = paginationHandle(val)
    const _data = await integralTypeList(params)
    return tableDataHandle(_data)
  }

  // 监听年份入参变化
  const onChange = async (date: any, dataString: any) => {
    getYear(dataString)
  }

  // 显示弹窗
  const checkStatistics = async (record: any) => {
    const _data = await integralchart({ village_id: record.village_id, year: record.year })
    if (_data.data.x.length) {
      let arr_one: any = []
      let arr_two: any = []
      let arr_three: any = []
      _data.data.y.map((item: any) => {
        arr_one.push(item.sum_integral)
        arr_two.push(item.times)
        arr_three.push(item.percent)
      })
      config.xAxis[0].data = _data.data.x
      config.series[0].data = arr_one
      config.series[1].data = arr_two
      config.series[2].data = arr_three
      // console.log(arr_one, arr_two, arr_three)
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
            maskClosable={false}
            title={'福利兑换统计（' + formValue.village_name + '-' + formValue.year + '年）'}
            visible={moduleVisible}
            cancelText="取消"
            okText="确定"
            onOk={() => {
              handleModuleVisible(false)
            }}
            onCancel={() => {
              handleModuleVisible(false)
            }}
          >
            <div id="issue" style={{ width: '100%', height: '500px' }}></div>
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
