import React, { useEffect, useState } from 'react';
import { Button, Select, DatePicker, Cascader,Modal, Table, Pagination } from 'antd';
import { ConnectState } from '@/models/connect';
import ProTable from '@ant-design/pro-table';
import ButtonAuth from '@/components/ButtonAuth';
import { breakDownList,getRecord } from '@/services/integral';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { connect } from 'umi';
import './index.less';

const YearBreakDown: React.FC<any> = props => {
  const { accountInfo, areaList } = props;
  const [year, setYear] = useState();
  const [params, setParams] = useState({
    page: 1,
    owner_name: undefined,
    sort: undefined,
    year: undefined,
    city_id: undefined,
    town_id: undefined,
    village_id: undefined
  });
  const [collapsed,setCollapsed]=useState(false);
  const [sortVal, setSortVal] = useState();
  const [scoreModal,setScoreModal]=useState({
    title:'结算记录',
    visible:false
  });
  const [record,setRecord]=useState({});
  const [dataSource,setDataSource]=useState(null);
  const [tableLoading,setTableLoading]=useState(true);
  const [paginaInfo,setPaginaInfo]=useState({
    total:0,
    page:1,
    pageSize:10
  });
  const columns = [
    {
      key: 'order',
      dataIndex: 'order',
      title: '排序',
      hideInSearch: true,
      render: (_, record, index) => ((params.page - 1) * 10) + (index + 1)
    },
    {
      key: 'owner_name',
      dataIndex: 'owner_name',
      title: '家庭户主'
    },
    {
      key: 'area',
      dataIndex: 'area',
      title: '所属地区',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: () => {
        return (
          <Cascader options={areaList} changeOnSelect />
        )
      }
    },
    {
      key: 'group',
      dataIndex: 'group',
      title: '所属小组',
      hideInSearch: true
    },
    {
      key: 'doorplate',
      dataIndex: 'doorplate',
      title: '门牌号',
      hideInSearch: true
    },
    {
      key: 'integral',
      dataIndex: 'integral',
      title: '积分',
      hideInSearch: true
    },
    {
      key: 'sort',
      dataIndex: 'sort',
      title: '排序方式',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select allowClear={true} value={sortVal} onChange={changeSortVal} placeholder="请选择排序方式">
            <Select.Option key={'asc'}>正序</Select.Option>
            <Select.Option key={'desc'}>倒序</Select.Option>
          </Select>
        )
      }
    },
    {
      key: 'year',
      dataIndex: 'year',
      title: '年份',
      hideInTable: true,
      valueType: 'dateYear',
    },
    {
      key: 'year',
      dataIndex: 'year',
      title: '年份',
      hideInSearch: true
    },
    {
      key:'option',
      dataIndex:'option',
      title:'操作',
      hideInSearch:true,
      render:(_,record)=>{
        return(
          <ButtonAuth type="SETTLEMENT-RECORD">
            <a onClick={()=>settlementRecord(record)}>结算记录</a>
          </ButtonAuth>
        )
      }
    }
  ];
  // 结算记录按钮
  const settlementRecord=(record)=>{
    setTableLoading(true);
    setRecord(record);
    setScoreModal({...scoreModal,visible:true});
    getRecordList(record,1);
  }
  // 获取结算记录列表
  const getRecordList = (record, e) => {
    let params = { 
      page: e,
      page_size: paginaInfo.pageSize,
      family_id: record.family_id,
      year: record.year,
      is_settle: 1
    };
    getRecord(params).then(res=>{
      if(res.code==0){
        setTableLoading(false);
        setPaginaInfo({...paginaInfo,page:e,total:res.data.total});
        setDataSource(res.data.data);
      }
    });
  }
  // 导出列表
  const exportList = () => {
    const owner_name = params.owner_name ? `&owner_name=${params.owner_name}` : '';
    const sorts = params.sort ? `&sort=${params.sort}` : '';
    const year = params.year ? `&year=${params.year}` : '';
    const city_id = params.city_id ? `&city_id=${params.city_id}` : '';
    const town_id = params.town_id ? `&town_id=${params.town_id}` : '';
    const village_id = params.village_id ? `&village_id=${params.village_id}` : '';
    window.open(`/farmapi/gateway?api_name=year_integral&version=1.2.0&os=h5&sign&is_export=1${owner_name}${sorts}${year}${city_id}${town_id}${village_id}`)
  }
  // 排序
  const changeSortVal = (e) => {
    setSortVal(e);
  }
  // 修改年份
  const changeYear = (e, eStr) => {
    setYear(eStr);
  }
  useEffect(() => {
    getYearBreakDownList({});
  }, [])
  // 获取列表
  const getYearBreakDownList = async (val) => {
    console.log(val, 'val')
    let paramss = {
      city_id: 1,
      town_id: val.area ? (val.area.length === 3 ? val.area[1] : val.area.length === 2 ? val.area[0] : accountInfo.town_id) : accountInfo.town_id,
      village_id: val.area ? (val.area.length === 3 ? val.area[2] : val.area.length === 2 ? val.area[1] : val.area[0]) : accountInfo.village_id,
      ...val,
      year: val.year ? val.year.substring(0,4) : null,
      sort: sortVal
    };
    delete paramss.area;
    delete paramss._timestamp;
    const params: any = paginationHandle(paramss);
    setParams(params);
    let datas = await breakDownList(params);
    return tableDataHandle(datas)
  }
  const modalColumn=[
    {
      key:'id',
      dataIndex:'id',
      title:'打分ID'
    },
    {
      key:'created_at',
      dataIndex:'created_at',
      title:'打分日期'
    },
    {
      key:'item_name',
      dataIndex:'item_name',
      width:150,
      title:'打分项'
    },
    {
      key:'operate_name',
      dataIndex:'operate_name',
      title:'打分方式'
    },
    {
      key:'integral',
      dataIndex:'integral',
      title:'分数'
    },
    {
      key:'image_url',
      dataIndex:'image_url',
      title:'证明图片',
      width:120,
      render:pic=><img src={pic} style={{width:'100px'}}/>
    },
    {
      key:'status',
      dataIndex:'status',
      title:'积分状态'
    },
    {
      key:'checked_at',
      dataIndex:'checked_at',
      title:'检查时间'
    },
    {
      key:'settled_at',
      dataIndex:'settled_at',
      title:'结算时间'
    },
    {
      key:'settle_user_name',
      dataIndex:'settle_user_name',
      title:'结算人'
    }
  ];
  const changePageInfo=(e)=>{
    setPaginaInfo({...paginaInfo,page:e});
    getRecordList(record,e);
  }
  return (
    <div>
      <ProTable
        headerTitle=""
        rowKey="id"
        options={false}
        search={{
          collapsed:collapsed,
          onCollapse:()=>setCollapsed(!collapsed)
        }}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="EXPORT_YEAR-BREAK">
            <Button type="primary" onClick={exportList}>
              导出
            </Button>
          </ButtonAuth>
        ]}
        tableAlertRender={false}
        request={(params) => getYearBreakDownList(params)}
        columns={columns}
      />
      {/* 结算记录 */}
      <Modal 
        title={scoreModal.title} 
        width={1200}
        visible={scoreModal.visible}
        onCancel={()=>setScoreModal({...scoreModal,visible:false})}
        footer={false}>
          <div className="record-top">
            <span>所属地区：{record.area}</span>
            <span>家庭户主：{record.owner_name}</span>
            <span>年份：{record.year}年</span>
            <span>已结算积分：{record.integral}</span>
          </div>
          <Table
            columns={modalColumn}
            dataSource={dataSource}
            pagination={false}
            loading={tableLoading}/>
          <Pagination 
            className="modal-pagination" 
            total={paginaInfo.total} 
            current={paginaInfo.page} 
            hideOnSinglePage={true} 
            onChange={changePageInfo}
          />
      </Modal>
    </div>
  )
}


export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  areaList: info.areaList
}))(YearBreakDown);
