import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, message, Modal, Cascader, Select } from 'antd';
import Moment from 'moment';
import ButtonAuth from '@/components/ButtonAuth';
import CreateForm from './components/CreateForm';
import LogList from './components/LogList';
import { getScoreList } from '@/services/integral';
import { getChooseGroupList, getGroupChange } from '@/services/customer';
import { getFamilyPicList, editFamilyImage, deleteFamilyImage } from '@/services/familyImage';
import CarouselImg from '@/components/CarouselImg';
// import {checkPermissions} from '@/components/ColumnAuth';
import { checkPermissions } from '@/components/Authorized/CheckPermissions';
import styles from './style.less';
import _ from 'lodash'

/**
 * 更新
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  try {
    const imageArr = [...fields.image_arr];
    const imageStr = imageArr.map(item => {
      return item.uid
    }).join(',')
    const obj = {
      pic_id: fields.pic_id,
      image_id: imageStr,
      city_id: fields.city_id,
      town_id: fields.town_id,
      village_id: fields.village_id,
      admin_id: fields.admin_id
    }
    const _data = await editFamilyImage(obj)
    if (_data.code === 0) {
      message.success('更新成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('更新失败');
    return false;
  }
};

/**
 * 删除
 * @param pic_id
 */
const handleDelet = async (id: number) => {
  try {
    const _data = await deleteFamilyImage({ pic_id: id })
    if (_data.code === 0) {
      message.success('删除成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('删除失败');
    return false;
  }
}



const FamilyImageList: React.FC<any> = (props) => {

  const { userAuthButton, location, accountInfo, areaList, chooseGroupList } = props;
  const { Option } = Select;
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [historyValues, setHistoryValues] = useState<number>(0);
  const [historyModalVisible, handleHistoryModalVisible] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [scoreTypeList, setScoreTypeList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [hasAreaAuth, setHasAreaAuth] = useState(false);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
      width: 80
    },
    {
      title: '户主姓名',
      dataIndex: 'owner_name',
      formItemProps: {
        defaultValue: _.get(location, 'query.owner', null)
      }
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaLists = (areaList.length > 0 && accountInfo.role_type === 4) ? areaList[0].children : areaList;
        return (
          <Cascader options={areaLists} onChange={areaChange} changeOnSelect />
        )
      }
    },
    {
      title: '小组名称',
      dataIndex: 'title',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return <Cascader
          options={groupList}
          fieldNames={{ label: 'title', value: 'group_id' }}
          placeholder="请选择小组"
        />
      }
    },
    {
      title: '门牌号',
      dataIndex: 'doorplate',
    },
    {
      title: '检查项',
      dataIndex: 'item_name',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        return <Cascader
          options={scoreTypeList}
          fieldNames={{ label: 'item_name', value: 'item_id' }}
          placeholder="请选择检查项"
        />;
      }
    },
    {
      title: '分数',
      dataIndex: 'integral',
      render: (_: any, record: any) => {
        return record.integral ? (
          <span>{record.direction === 'INCREASE' ? '+' + record.integral + '分' : '-' + record.integral + '分'}</span>
        ) : null
      },
      hideInSearch: true
    },
    {
      title: '照片上传时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '检查人',
      dataIndex: 'operator_name',
      hideInSearch: true
    },
    {
      title: '照片内容',
      dataIndex: 'image',
      render: (_: any, record: any) => {
        const urls = record.image.map((item: any) => {
          return item.url
        })
        return record.image && record.image.length > 0 ? (
          <CarouselImg urlList={urls} />
        ) : null
      },
      hideInSearch: true
    },
    {
      title: '加減分',
      key: 'direction',
      hideInTable: true,
      valueEnum: { INCREASE: '加分', DECREASE: '减分' },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <>
          <ButtonAuth type="EDIT">
            <a
              onClick={() => {
                setIsEdit(true);
                handleModalVisible(true);
                setFormValues(record);
              }}
            >
              编辑
            </a>
          </ButtonAuth>
          <br />
          <ButtonAuth type="DELETE">
            <a
              className={styles.colorTap}
              onClick={async () => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '是否要删除该条照片信息？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await handleDelet(record.id);
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  },
                });
              }}>
              删除
            </a>
          </ButtonAuth>
          <br />
          <ButtonAuth type="UPDATE_RECORD">
            <a
              onClick={() => {
                setIsRead(true);
                handleHistoryModalVisible(true);
                setHistoryValues(record);
              }}
            >
              修改记录
          </a>
          </ButtonAuth>
        </>
      )
    },
  ];

  // 获取列表数据 dataSource
  const getFamilyImageList = async (val: any) => {
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id = user.role_type == 4 ? user.city_id : val.area[0];
      val.town_id = user.role_type == 4 ? val.area[0] : val.area[1];
      val.village_id = user.role_type == 4 ? val.area[1] : val.area[2];
    }
    val.area = undefined;
    const valObj = { ...val }
    const timeArr = valObj['created_at'] || []
    const itemIndex = valObj['item_name'] || []
    const groupIndex = valObj['title'] || []
    valObj['integral_id'] = itemIndex[0]
    valObj['group_id'] = groupIndex[0]
    if (timeArr && timeArr.length > 0) {
      valObj['start_time'] = Moment(timeArr[0]).valueOf() / 1000
      valObj['end_time'] = Moment(timeArr[1]).valueOf() / 1000
      delete valObj['created_at']
    }
    // valObj['owner_name'] = _.get(location, 'query.owner', '')
    const _params = paginationHandle(valObj);
    const _data = await getFamilyPicList(_params);
    if (accountInfo.role_type === 3) {
      getGroupTotal();
    } // else {
    //   setGroupList([])
    // }
    return tableDataHandle(_data)
  };

  //获取小组数据
  const areaChange = async (e: any) => {
    let user = JSON.parse(localStorage.getItem('userInfo'));
    if (e.length > 0) {
      if (user.role_type == 4 && e.length > 1) {
        getGroup(e)
      } else if (user.role_type != 4 && e.length > 2) {
        getGroup(e)
      }
    } else {
      formRef.current.setFieldsValue({ title: '' })
      setGroupList([])
    }
    formRef.current.setFieldsValue({ area: e });
  }
  // 小组数据调用
  const getGroup = async (area: any[]) => {
    let user = JSON.parse(localStorage.getItem('userInfo'));
    const _data = await getGroupChange({
      city_id: user.role_type === 4 ? user.city_id : area[0],
      town_id: user.role_type === 4 ? area[0] : area[1],
      village_id: user.role_type === 4 ? area[1] : area[2]
    })
    if (_data.code === 0) {
      const _arr = _data.data || []
      setGroupList(_arr)
    }
  }

  // 获取积分项下拉框数据
  const getScoreType = async () => {
    try {
      const _data = await getScoreList({});
      const { code, data, msg } = _data || {};
      if (code === 0) {
        setScoreTypeList(data);
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error('检查项获取失败');
    }
  };

  // 获取分组下拉
  const getGroupTotal = async () => {
    try {
      const _data = await getChooseGroupList({});
      if (_data.code === 0) {
        setGroupList(_data.data)
        return true;
      } else {
        message.error(_data.msg);
        return false;
      }
    } catch (err) {
      message.error('获取信息失败');
      return false;
    }
  }

  const getAuthArr = () => {
    let authArr: string[] = [];
    for (let i = 0; i < userAuthButton.length; i++) {
      if (window.location.pathname === userAuthButton[i].path) {
        authArr = [].concat(userAuthButton[i].permission);
        break;
      }
    }
    let hasColumnAuth: any = checkPermissions("COLUMN_ADDRESS", authArr, true, false)
    setHasAreaAuth(hasColumnAuth)
  }

  useEffect(() => {
    getScoreType();
    getAuthArr();
  }, [props.userAuthButton]);
  const areaColumn = {
    hideInSearch: true,
    title: '所属地区',
    dataIndex: 'area',
    width: 120
  }
  // console.log("colmun", columns,hasAreaAuth,columns.splice(8,0,areaColumn));
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        // columns={hasAreaAuth?[...columns.slice(0,8),areaColumn,...columns.slice(8)]:columns}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        options={false}
        tableAlertRender={false}
        rowKey="id"
        search={{ labelWidth: 100 }}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        // scroll={{ x: 1500, }}
        request={(params) => getFamilyImageList(params)}
      />
      {
        formValues && Object.keys(formValues).length || createModalVisible ? (
          <CreateForm
            isEdit={isEdit}
            onSubmit={async (value) => {
              let success = null;
              if (isEdit) {
                success = await handleUpdate(value);
              }
              if (success) {
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
            values={formValues}
          />
        ) : null
      }
      {
        historyModalVisible ? (
          <LogList
            onClose={() => {
              handleHistoryModalVisible(false)
            }
            }
            historyValues={historyValues}
            modalVisible={historyModalVisible}
          />
        ) : null
      }
    </PageHeaderWrapper>
  );
};

// export default FamilyImageList;
export default connect(({ user, info }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
  accountInfo: user.accountInfo,
  areaList: info.areaList
}))(FamilyImageList);
