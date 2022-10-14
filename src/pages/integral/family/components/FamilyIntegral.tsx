import { history, connect } from 'umi';
import {
  Button,
  message,
  Upload,
  Cascader,
  Modal,
  Form,
  Input,
  DatePicker,
  Space,
  Table,
  Spin,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import Moment from 'moment';
import CreateForm from './CreateForm';
import ShowRecord from './ShowRecord';
import { TableListItem } from '../data.d';
import styles from '../index.less';
import {
  integralFamilyList,
  upLoadIntegral,
  upLoadItemIntegral,
  updateIntegralRecord,
  getGroupSearch,
  settleIntegral,
} from '@/services/integral';
import { getGroupChange } from '@/services/customer';
import { tableDataHandle, paginationHandle, getLocalToken, getApiParams } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import { ConnectState } from '@/models/connect';
import { PUBLIC_KEY } from '@/services/api';

const { RangePicker } = DatePicker;
/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  try {
    const _data = await upLoadIntegral(fields);
    if (_data.code === 0) {
      message.success('更新成功');
      return true;
    }
    message.error(_data.msg);
    return false;
  } catch (err) {
    message.error('更新失败');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  try {
    fields.family_id = fields.family_ids[0];
    delete fields.family_ids;
    const _data = await upLoadItemIntegral(fields);
    if (_data.code === 0) {
      message.success('更新成功');
      return true;
    }
    message.error(_data.msg);
    return false;
  } catch (err) {
    message.error('更新失败');
    return false;
  }
};

const handleUpdateRecord = async (fields: any) => {
  try {
    fields.family_id = fields.family_ids[0];
    delete fields.family_ids;
    const _data = await updateIntegralRecord(fields);
    if (_data.code === 0) {
      message.success('更新成功');
      return true;
    }
    message.error(_data.msg);
    return false;
  } catch (err) {
    message.error('更新失败');
    return false;
  }
};

// 导入文件
const token = getLocalToken();
const addApiName = {
  api_name: 'import_family_record',
};
const data = getApiParams(addApiName, PUBLIC_KEY);

// 打分状态
const GRADE_TYPE: any = {
  0: { text: '全部' },
  1: { text: '已打' },
  2: { text: '未打' },
};
const SORT_TYPE: any = {
  integral: { text: '按总积分排序' },
  time_sort: { text: '按检查时间排序' },
};
const SETTLEMENT_TYPE: any = {
  0: { text: '未结算' },
  1: { text: '已结算' },
};
const SORT_VALUE: any = {
  asc: { text: '升序' },
  desc: { text: '降序' },
};
const typeEnum = (val: Array<any>) => {
  const _enum = {};
  if (val.length) {
    val.forEach((element: any) => {
      _enum[element.group_id] = {
        text: element.title,
      };
    });
  }
  return _enum;
};

const TableList: React.FC<any> = (props) => {
  const { accountInfo, roleAreaList } = props;
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [showModalVisible, setShowModalVisible] = useState<boolean>(false);
  const [recordValue, setRecordValue] = useState({});
  const [formValues, setFormValues] = useState({});
  const [pageParams, setPageParams] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const [isEditRecord, setIsEditRecord] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [reloadRecord, setReloadRecord] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [bathPointVisible, setBathPointVisible] = useState(false);
  const [scoreModal, setScoreModal] = useState({
    title: '积分结算',
    visible: false,
  });
  const [form] = Form.useForm();
  const [formBatch] = Form.useForm();
  const [record, setRecord] = useState({});
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const actionBatchRef = useRef<ActionType>();
  const formBatchRef = useRef<any>();
  const [year, setYear] = useState('2021-01-01 00:00:00'); // 打分
  const [selectedRows, setSelectRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [isSpinLoading, setIsSpinLoading] = useState(false);

  // 在批量结算积分的时候，年份时间选择控制
  const disabledDate = (current) => {
    return (
      current < Moment('2019').startOf('year') ||
      current > Moment(Moment().format('YYYY')).startOf('year')
    );
  };

  // 点击年份进行搜索
  const onChangeYear = (time) => {
    if (time) {
      // console.log(`${Moment(time).format('YYYY')}-01-01 00:00:00`);
      setYear(`${Moment(time).format('YYYY')}-01-01 00:00:00`);
      actionBatchRef.current?.reload();
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '家庭户主',
      dataIndex: 'owner_name',
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3,
      renderFormItem: (item, props) => {
        return <Cascader options={roleAreaList} onChange={areaChange} changeOnSelect />;
      },
    },
    {
      title: '所属小组',
      dataIndex: 'group_name',
      valueEnum: typeEnum(groupList),
      renderText: (_, record) => <span>{record.group_name}</span>,
      filterDropdownVisible: false,
      filterIcon: <div />
    },
    {
      title: '门牌号',
      dataIndex: 'doorplate',
      hideInSearch: true,
    },
    {
      title: '未结算总积分',
      dataIndex: 'unable_integral',
      hideInSearch: true,
    },
    // {
    //   title: '总积分',
    //   dataIndex: 'family_integral',
    //   hideInSearch: true
    // },
    {
      title: '打分时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '家庭排名',
      dataIndex: 'family_rank',
      hideInSearch: true,
    },
    {
      title: '小组排名',
      dataIndex: 'group_rank',
      hideInSearch: true,
    },
    // {
    //   title: '打分状态',
    //   dataIndex: 'status',
    //   valueEnum: GRADE_TYPE,
    //   renderText: (_, record) => (<span>{record.status === 1 ? '已打分' : '未打分'}</span>),
    //   filterDropdownVisible: false,
    //   filterIcon: <div></div>,
    //   formItemProps: {
    //     showSearch: true,
    //     allowClear: true
    //   }
    // },
    {
      title: '排序类型',
      dataIndex: 'sort_type',
      valueEnum: SORT_TYPE,
      hideInTable: true,
      render: (_, record) => {
        return <span>{record.status === 1 ? '已打分' : '未打分'}</span>;
      },
    },
    {
      title: '排序方式',
      dataIndex: 'sort_value',
      valueEnum: SORT_VALUE,
      hideInTable: true,
      render: (_, record) => {
        return <span>{record.status === 1 ? '已打分' : '未打分'}</span>;
      },
    },
    {
      title: '结算状态',
      dataIndex: 'is_settle',
      valueEnum: SETTLEMENT_TYPE,
      renderText: (_, record) => <span>{record.is_settle_text}</span>,
      filterDropdownVisible: false,
      filterIcon: <div />
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: '140px',
      render: (_, record) => (
        <>
          <ButtonAuth type="VIEW_SCORE">
            <a
              onClick={() => {
                setRecordValue(record);
                setShowModalVisible(true);
              }}
            >
              积分记录
            </a>
          </ButtonAuth>
          <br />
          <ButtonAuth type="UPDATA_SCORE">
            <a
              onClick={() => {
                handleModalVisible(true);
                setIsEdit(true);
                setFormValues(record);
              }}
            >
              更新积分
            </a>
          </ButtonAuth>
          <br />
          <ButtonAuth type="VIEW_HISTORY">
            <a
              onClick={() => {
                history.push({
                  pathname: '/integral/family/history',
                  query: { family_id: record.family_id },
                });
              }}
            >
              操作记录
            </a>
          </ButtonAuth>
          <br />
          <ButtonAuth type="OVER_YEAR_SETTLEMENT">
            <a
              onClick={() => {
                form.setFieldsValue({
                  area: `${record.area}/${record.doorplate}`,
                  family_name: record.owner_name,
                  settle_year: undefined,
                  // 'check_time':undefined,
                  check_score: undefined,
                });
                setRecord(record);
                setScoreModal({ ...scoreModal, visible: true });
              }}
            >
              历年结算
            </a>
          </ButtonAuth>
        </>
      ),
    },
  ];

  const columnsSelect: ProColumns<TableListItem>[] = [
    {
      title: '结算年份',
      dataIndex: 'year',
      hideInTable: true,
      renderFormItem: () => (
        // 选择时间进行搜索
        <DatePicker
          disabledDate={disabledDate}
          onChange={onChangeYear}
          picker="year"
          defaultValue={Moment(year)}
        />
      ),
    },
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '家庭户主',
      dataIndex: 'owner_name',
      hideInSearch: true,
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: true,
      renderFormItem: (item, props) => {
        return <Cascader options={roleAreaList} onChange={areaChange} changeOnSelect />;
      },
    },
    {
      title: '所属小组',
      dataIndex: 'group_name',
      hideInSearch: true,
    },
    {
      title: '门牌号',
      dataIndex: 'doorplate',
      hideInSearch: true,
    },
    {
      // title: '未结算总积分',
      title: '当年未结算积分',
      dataIndex: 'unable_integral',
      hideInSearch: true,
    },
    {
      title: '打分时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '家庭排名',
      dataIndex: 'family_rank',
      hideInSearch: true,
    },
    {
      title: '小组排名',
      dataIndex: 'group_rank',
      hideInSearch: true,
    },
  ];

  // 获取列表数据
  const getIntegralFamilyList = async (val: any) => {
    if (val.sort_type && val.sort_value) {
      val[val.sort_type] = val.sort_value;
      delete val.sort_type;
      delete val.sort_value;
    }
    if (accountInfo.role_type === 3) {
      getGroupList();
    }
    if (val.area) {
      val.city_id = accountInfo.role_type == 4 ? accountInfo.city_id : val.area[0];
      val.town_id = accountInfo.role_type == 4 ? val.area[0] : val.area[1];
      val.village_id = accountInfo.role_type == 4 ? val.area[1] : val.area[2];
    }
    val.area = undefined;
    val.group_id = +val.group_name;
    delete val.group_name;
    const params: any = paginationHandle(val);
    params.status = Number(params.status);
    // console.log(params);
    if (params.created_at) {
      params.point_start_time = Moment(params.created_at[0]).valueOf() / 1000;
      params.point_end_time = Moment(params.created_at[1]).valueOf() / 1000;
      delete params.created_at;
    }
    // console.log(params);
    setPageParams(params);
    const data = await integralFamilyList(params);
    return tableDataHandle(data);
  };

  const getData = async (val: any) => {
    const params: any = paginationHandle(val);
    // console.log(params);
    // return;
    params.point_start_time = Moment(year).valueOf() / 1000;
    const data = await integralFamilyList(params);
    const list = data.data.data;

    let ids = '';
    list.forEach((item: any) => {
      item.id += (params.page - 1) * params.page_size;
      ids += `${item.family_id},`;
    });
    ids = ids.substring(0, ids.length - 1);

    const params_year = Moment(year).format('YYYY');
    const params1 = {
      family_id: ids,
      checked_start_time: `${params_year}-01-01`,
      checked_end_time: `${params_year}-12-31`,
      year: params_year,
    };
    // 这里是当年未结算
    const data1 = await settleIntegral(params1);
    const list1 = data1.data;

    list.forEach((item: any, index) => {
      item.unable_integral = list1[index].integral;
    });
    return tableDataHandle(data);
  };

  // 获取小组数据
  const areaChange = async (e: any) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (e.length > 0) {
      if (user.role_type === 4 && e.length === 2) {
        getGroup(e);
      } else if (user.role_type !== 4 && e.length === 3) {
        getGroup(e);
      }
    } else {
      formRef.current.setFieldsValue({ group_name: '' });
      setGroupList([]);
    }
    formRef.current.setFieldsValue({ area: e });
  };
  // 小组数据调用
  const getGroup = async (area: any[]) => {
    const params = {};
    if (accountInfo.role_type === 4 && area.length == 2) {
      Object.assign(params, {
        town_id: area[0],
        village_id: area[1],
      });
    } else if (area.length == 3) {
      Object.assign(params, {
        city_id: area[0],
        town_id: area[1],
        village_id: area[2],
      });
    } else {
      return;
    }
    const _data = await getGroupChange(params);
    if (_data.code === 0) {
      const _arr = _data.data || [];
      setGroupList(_arr);
    }
  };

  // 表格数据变动时调用
  const tableChange = async (pagination, filters, sorter, extra) => {
    console.log(sorter, 'sorter');
  };

  const uploadProps = {
    name: 'file',
    action: '/farmapi/gateway',
    headers: {
      authorization: token,
    },
    showUploadList: false,
    data,
    onChange(info: any) {
      setLoading(true);
      if (info.file.status !== 'uploading') {
        console.log(info.file);
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 0) {
          message.success(`${info.file.name} 文件导入成功`);
        } else {
          message.error(info.file.response.msg);
        }
        setLoading(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件导入失败`);
        setLoading(false);
      }
    },
  };
  // 导出列表
  const exportList = async () => {
    const group_name = pageParams.group_name ? `&group_name=${pageParams.group_name}` : '';
    const owner_name = pageParams.owner_name ? `&group_name=${pageParams.owner_name}` : '';
    const family_rank = pageParams.family_rank ? `&group_name=${pageParams.family_rank}` : '';
    const group_rank = pageParams.group_rank ? `&group_name=${pageParams.group_rank}` : '';
    const status = pageParams.status ? `&group_name=${pageParams.status}` : '';
    const point_start_time = pageParams.point_start_time
      ? `&group_name=${pageParams.point_start_time}`
      : '';
    const point_end_time = pageParams.point_end_time
      ? `&group_name=${pageParams.point_end_time}`
      : '';
    let city_id = '';
    let town_id = '';
    let village_id = '';
    if ([1, 2].includes(accountInfo.role_type)) {
      city_id = pageParams.city_id ? `&city_id=${pageParams.city_id}` : '';
      town_id = pageParams.town_id ? `&town_id=${pageParams.town_id}` : '';
      village_id = pageParams.village_id ? `&village_id=${pageParams.village_id}` : '';
    } else if (accountInfo.role_type === 4) {
      // city_id = pageParams.city_id ? `&city_id=${pageParams.city_id}` : ''
      town_id = pageParams.town_id ? `&town_id=${pageParams.town_id}` : '';
      village_id = pageParams.village_id ? `&village_id=${pageParams.village_id}` : '';
    }
    const adminId = JSON.parse(localStorage.getItem('userInfo')).admin_id;
    window.open(
      `/farmapi/gateway?api_name=export_integral_item_list&version=1.2.0&os=h5&sign&is_export=1${group_name}${owner_name}${family_rank}${group_rank}${status}${point_start_time}${point_end_time}&admin_id=${adminId}${city_id}${town_id}${village_id}`,
    );
  };

  // 获取小组列表
  const getGroupList = async () => {
    try {
      const _data = await getGroupSearch();
      const { code, data, msg } = _data || {};
      if (code === 0) {
        const obj: any = {};
        data.forEach((item: any) => {
          obj[item.title] = { text: item.title };
        });

        setGroupList(data);
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error('小组获取失败');
    }
  };
  useEffect(() => {}, []);
  const YEAR = new Date().getFullYear();
  const onRecordRef = (table: any) => {
    setReloadRecord(table);
  };
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const handleCheckInfo = () => {
    // if(form.getFieldValue('check_time')){
    if (form.getFieldValue('settle_year')) {
      getIntegralInfo();
    }
    // }
  };
  const getIntegralInfo = () => {
    const year = Moment(form.getFieldValue('settle_year')).format('YYYY');
    // let startTime=Moment(form.getFieldValue('check_time')[0]).format('MM-DD');
    // let endTime=Moment(form.getFieldValue('check_time')[1]).format('MM-DD');
    const params = {
      family_id: record.family_id,
      checked_start_time: `${year}-01-01`,
      checked_end_time: `${year}-12-31`,
      year,
    };
    settleIntegral(params).then((res) => {
      if (res.code == 0) {
        form.setFieldsValue({
          check_score: res.data[0].integral,
        });
      }
    });
  };
  const setModalOk = () => {
    const year = Moment(form.getFieldValue('settle_year')).format('YYYY');
    // let startTime=Moment(form.getFieldValue('check_time')[0]).format('MM-DD');
    // let endTime=Moment(form.getFieldValue('check_time')[1]).format('MM-DD');
    const params = {
      family_id: record.family_id,
      checked_start_time: `${year}-01-01`,
      checked_end_time: `${year}-12-31`,
      year,
      confirm: 1,
    };
    settleIntegral(params).then((res) => {
      if (res.code == 0) {
        message.success('结算成功');
        setScoreModal({ ...scoreModal, visible: false });
        actionRef.current.reload();
      }
    });
  };
  const handleDisableRank = (current) => {
    const year = Moment(form.getFieldValue('settle_year')).format('YYYY');
    if (year != new Date().getFullYear()) {
      return Moment(current).format('YYYY') != year;
    }
    return Moment(current).format('YYYY') > new Date().getFullYear() - 1;
  };

  // 这里批量处理当前分数
  const dealBatchPoint = (list) => {
    // console.log(list);
    let ids = '';
    list.forEach((item) => {
      ids += `${item.family_id},`;
    });
    ids = ids.substring(0, ids.length - 1);
    const cur_year = Moment(year).format('YYYY');
    const params = {
      family_id: ids,
      // checked_start_time: `${cur_year}-01-01`,
      // checked_end_time: `${cur_year}-12-31`,
      year: cur_year,
      confirm: 1,
    };

    // console.log(params);
    // return;
    setIsSpinLoading(true);
    settleIntegral(params).then((res) => {
      if (res.code == 0) {
        message.success('结算成功');
        setSelectedRowKeys([]);
        setSelectRows([]);
        actionBatchRef.current.reload();
      } else {
        message.error('结算失败');
      }
      setIsSpinLoading(false);
    });
  };
  // 批量积分结算，选中设置本地选中列表
  const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectRows(selectedRows);
  };

  return (
    <div>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        options={false}
        search={{
          collapsed,
          onCollapse: () => setCollapsed(!collapsed),
        }}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default',
        }}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="INTEGRAL_FAMILY_DOWNLOAD">
            <Button
              type="primary"
              onClick={() => {
                // 这里展示批量计算积分
                setBathPointVisible(true);
              }}
            >
              批量结算积分
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="INTEGRAL_FAMILY_DOWNLOAD">
            <Button
              type="primary"
              onClick={() => {
                window.location.href = '/打分项模板.xlsx';
              }}
            >
              打分项模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="INTEGRAL_FAMILY_IMPORT">
            <Upload {...uploadProps} disabled={loading}>
              <Button type="primary" disabled={loading} loading={loading}>
                {loading ? '正在导入...' : '打分项导入'}
              </Button>
            </Upload>
          </ButtonAuth>,
          <ButtonAuth type="UPDATA_ALL_SCORE">
            <Button
              type="primary"
              onClick={() => {
                handleModalVisible(true);
                setIsEdit(false);
              }}
            >
              批量更新家庭积分
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="FAMILY_SCORE_EXPORT">
            <Button
              type="primary"
              onClick={() => {
                exportList();
              }}
            >
              导出未结算积分
            </Button>
          </ButtonAuth>,
        ]}
        tableAlertRender={false}
        request={(params) => getIntegralFamilyList(params)}
        columns={columns}
        onChange={tableChange}
      />
      {(formValues && Object.keys(formValues).length) || createModalVisible ? (
        <CreateForm
          isEdit={isEdit}
          isEditRecord={isEditRecord} // 修改打分记录
          values={formValues}
          onSubmit={async (value) => {
            let success = null;
            if (isEdit) {
              if (isEditRecord) {
                success = await handleUpdateRecord(value);
              } else {
                success = await handleUpdate(value);
              }
            } else {
              success = await handleAdd(value);
            }
            if (success) {
              if (isEditRecord) {
                reloadRecord.current.reload();
              }
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
              setFormValues({});
            }
          }}
          onCancel={() => {
            handleModalVisible(false);
            setFormValues({});
          }}
          modalVisible={createModalVisible}
        />
      ) : null}
      {showModalVisible ? (
        <ShowRecord
          onRef={onRecordRef}
          values={recordValue}
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              setShowModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onEdit={(record) => {
            handleModalVisible(true);
            setIsEdit(true);
            setIsEditRecord(true);
            setFormValues(record);
          }}
          onCancel={() => {
            setShowModalVisible(false);
            // setIsEdit(false);
            setIsEditRecord(false);
          }}
          modalVisible={showModalVisible}
        />
      ) : null}
      {/* 积分结算 */}
      <Modal
        title={scoreModal.title}
        width={650}
        visible={scoreModal.visible}
        onCancel={() => setScoreModal({ ...scoreModal, visible: false })}
        maskClosable={false}
        onOk={setModalOk}
      >
        <Form {...layout} form={form}>
          <Form.Item
            label="所属地区"
            name="area"
            rules={[{ required: true, message: '请选择所属地区' }]}
          >
            <Input type="text" placeholder="请选择所属地区" disabled />
          </Form.Item>

          <Form.Item
            label="家庭名称"
            name="family_name"
            rules={[{ required: true, message: '请输入家庭名称' }]}
          >
            <Input type="text" placeholder="请输入家庭名称" disabled />
          </Form.Item>

          <Form.Item
            label="结算年份"
            name="settle_year"
            rules={[{ required: true, message: '请选择结算年份' }]}
          >
            <DatePicker
              picker="year"
              disabledDate={(current) => Moment(current).format('YYYY') > YEAR - 1}
              onChange={handleCheckInfo}
            />
          </Form.Item>

          {/* <Form.Item
            label="检查时间"
            name="check_time"
            rules={[{required:true,message:'请选择检查时间'}]}
          >
            <RangePicker format={'MM-DD'} disabledDate={current=>handleDisableRank(current)} onChange={handleCheckInfo}/>
          </Form.Item> */}

          <Form.Item
            label="结算积分"
            name="check_score"
            rules={[{ required: true, message: '请选择时间进行系统核算积分' }]}
          >
            <Input type="text" disabled placeholder="系统核算" />
          </Form.Item>
          <p style={{ color: 'red', margin: '10px 0px 0px 20px' }}>
            注：积分结算一经提交将不可修改，请认真核对，如有疑问返回修改再做提交
          </p>
        </Form>
      </Modal>

      <Modal
        title="批量积分结算"
        width={1200}
        visible={bathPointVisible}
        onCancel={() => {
          setBathPointVisible(false);
        }}
        // onOk={() => {
        //   dealBatchPoint(selectedRows);
        // }}
        maskClosable={false}
        // confirmLoading={isSpinLoading}
        footer={[
          <Button key="cancel" onClick={() => setBathPointVisible(false)}>
            取消
          </Button>,
          <Button
            type="primary"
            key="confirm"
            disabled={!(selectedRows.length > 0)}
            loading={isSpinLoading}
            onClick={() => {
              Modal.confirm({
                title: '是否确认结算积分？（积分结算一经提交将不可修改，请认真核对！）',
                onOk: () => {
                  // 批量积分结算处理
                  dealBatchPoint(selectedRows);
                },
              });
            }}
          >
            积分结算
          </Button>,
        ]}
      >
        <Spin indicator={<LoadingOutlined />} spinning={isSpinLoading} tip="批量结算中...">
          <ProTable<TableListItem>
            headerTitle="批量积分结算"
            rowKey="family_id"
            columns={columnsSelect}
            actionRef={actionBatchRef}
            // formRef={formBatchRef}

            rowSelection={{
              selectedRowKeys,
              // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
              // 注释该行则默认不显示下拉选项
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              // defaultSelectedRowKeys: [1],
              preserveSelectedRowKeys: true,
              onChange: onSelectChange,
              getCheckboxProps(value: any) {
                return {
                  disabled: !(value.unable_integral > 0),
                };
              },
            }}
            tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
              <Space size={24}>
                <span>已选 {selectedRowKeys.length} 项</span>
                <span>{`已选家庭户数: ${selectedRowKeys.length}户`}</span>
                <span>{`未结算总积分: ${selectedRows.reduce(
                  (pre, item) => pre + item.unable_integral,
                  0,
                )} 分`}</span>

                {/* <Button
                type="primary"
                style={{ marginRight: 8 }}
                onClick={() => {
                  Modal.confirm({
                    title: '是否确认结算积分？',
                    onOk: () => {
                      // 批量积分结算处理
                      dealBatchPoint(selectedRows);
                    },
                  });
                }}
              >
                积分结算
              </Button> */}
              </Space>
            )}
            pagination={{
              position: ['bottomCenter'],
              showQuickJumper: true,
              defaultCurrent: 1,
              pageSize: 10,
              size: 'default',
            }}
            // search={{
            //   defaultCollapsed: false,
            //   optionRender: (searchConfig, formProps, dom) => [
            //     ...dom.reverse(),
            //     <DatePicker
            //       disabledDate={disabledDate}
            //       onChange={onChangeYear}
            //       picker="year"
            //       defaultValue={Moment(year)}
            //     />,
            //   ],
            // }}
            scroll={{ x: 1300 }}
            options={false}
            // form={formBatch}
            request={(params) => getData(params)}
            // request={getData}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  chooseGroupList: info.chooseGroupList,
  accountInfo: user.accountInfo,
  roleAreaList: info.roleAreaList,
}))(TableList);
