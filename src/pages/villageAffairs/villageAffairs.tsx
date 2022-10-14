import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Cascader, DatePicker, message, Modal } from 'antd';
import { connect } from '@@/plugin-dva/exports';
import ButtonAuth from '@/components/ButtonAuth';
import {
  addVote,
  getVoteList,
  editVote,
  delVote,
  votePartakeList,
  delVotePartake,
  addVotePartake,
  editVotePartake,
} from '@/services/home';
import { tableDataHandle, fileDownload } from '@/utils/utils';
import { ConnectState } from '@/models/connect';
import CreateForm from '@/pages/villageAffairs/components/CreateForm';
import { FormValueType } from '@/pages/OperationCenter/BannerConfig/data';
import ImgView from '@/components/ImgView';
import TypeForm from './components/TypeForm';

const { RangePicker } = DatePicker;
const VillageAffairs: React.FC<any> = (props) => {
  const { accountInfo, areaList } = props;
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [typeValues, setTypeValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [readOnly, setReadOnly] = useState(false); // 是否仅查看
  const [region, setRegion] = useState([]);
  const [storedParams, setStoredParams] = useState({});
  const [typeVisiable, setTypeVisiable] = useState(false); // 是否展示当前新增类别
  const [tabs, setTabs] = useState([
    { key: '村事共商', tab: '村事共商', badgeContent: 0 },
    { key: '参与人分类', tab: '参与人分类', badgeContent: 0 },
  ]);
  const [activeKey, setActiveKey] = useState('村事共商');
  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '所属地区',
      dataIndex: 'area_name',
      hideInSearch: false,
      renderFormItem: () => {
        const areaLists = areaList;
        return (
          <Cascader
            options={areaLists}
            disabled={accountInfo.role_id == 3}
            value={region}
            onChange={(v) => setRegion(v)}
          />
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '详情',
      dataIndex: 'details',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '图片信息',
      dataIndex: 'imgs_id',
      align: 'center',
      hideInSearch: true,
      renderText: (val, record) => {
        return <ImgView url={val[0].url} width={100} />;
      },
    },
    {
      title: '应参与人数',
      dataIndex: 'partake_num',
      align: 'center',
      hideInSearch: true,
    },

    {
      title: '已参与人数',
      dataIndex: 'already_partake_num',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      renderFormItem: () => {
        return <RangePicker showTime />;
      },
    },
    {
      title: '截止时间',
      dataIndex: 'end_time',
      align: 'center',
      hideInSearch: true,
    },

    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      width: 120,
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <Button
            type="link"
            onClick={() => {
              setIsEdit(true);
              handleModalVisible(true);
              setFormValues({ ...record });
              setReadOnly(record.already_partake_num > 0);
            }}
          >
            {record.already_partake_num > 0 ? '查看' : '编辑'}
          </Button>
          <Button
            type="link"
            onClick={() => {
              Modal.confirm({
                content: `确认删除?`,
                onOk: async () => {
                  try {
                    const res = await delVote({ id: record.id });
                    if (res.code === 0) {
                      message.success(res.msg);
                      actionRef?.current.reload();
                    } else {
                      message.error(res.msg);
                    }
                  } catch (e) {
                    // message.error(...)
                  }
                },
              });
            }}
          >
            删除
          </Button>
          {record.already_partake_num > 0 && (
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: '确认导出？',
                  onOk: async () => {
                    try {
                      const res = await getVoteList({ id: record.id, is_export: 1 });
                      // console.log(res);
                      fileDownload(res, record.title, 'xls');
                    } catch (e) {
                      // message.error(...)
                    }
                  },
                });
              }}
            >
              导出
            </Button>
          )}
        </div>
      ),
    },
  ];
  const tableColumns1 = [
    {
      title: '类别名称',
      dataIndex: 'type_name',
      align: 'center',
    },
    {
      title: '具体人员姓名',
      dataIndex: 'str',
      align: 'center',
      hideInSearch: true,
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column', justifyContent: 'center' }}>
          <div> {record.str?.length > 0 ? record.str[0] : '暂无人员'}</div>
          <div> {record.str?.length > 1 ? `${record.str[1]}...` : ''}</div>
        </div>
      ),
    },
    {
      title: '人数',
      dataIndex: 'type_nums',
      align: 'center',
      hideInSearch: true,
      render: (item, record) => <div>{record.str.length}</div>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      renderFormItem: () => {
        return <RangePicker showTime />;
      },
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      width: 120,
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <Button
            type="link"
            onClick={() => {
              // console.log(record);
              setIsEdit(true);
              setTypeVisiable(true);
              setTypeValues(record);

              setReadOnly(false);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            onClick={() => {
              Modal.confirm({
                content: `确认删除?`,
                onOk: async () => {
                  try {
                    const res = await delVotePartake({ id: record.id });
                    if (res.code === 0) {
                      message.success('删除成功！');
                      actionRef?.current.reload();
                    } else {
                      message.error(res.msg);
                    }
                  } catch (e) {
                    // message.error(...)
                  }
                },
              });
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  const loadData = async (rawParams) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (rawParams.created_at) {
      rawParams.start_time = rawParams.created_at[0];
      rawParams.end_time = rawParams.created_at[1];
    }
    if (activeKey === '村事共商') {
      rawParams.city_id = user.role_type == 3 ? user.city_id : region[0];
      rawParams.town_id = user.role_type == 3 ? user.town_id : region[1];
      rawParams.village_id = user.role_type == 3 ? user.village_id : region[2];
    } else {
      rawParams.city_id = user.city_id || '';
      rawParams.town_id = user.town_id || '';
      rawParams.village_id = user.village_id || '';
    }

    try {
      const result =
        activeKey === '村事共商' ? await getVoteList(rawParams) : await votePartakeList(rawParams);
      if (result?.code !== 0) {
        if (result?.code) {
          throw new Error(result.msg);
        }
        // TODO: other errors
        throw new Error('');
      }
      setStoredParams(rawParams);
      if (activeKey === '参与人分类' && result.data?.data?.length > 0) {
        for (const item of result.data.data) {
          const str = item.str.split(',');
          item.str = str;
        }
      }
      return tableDataHandle({ ...result, data: { ...result.data, data: result.data.data } });
    } catch (e) {
      message.error(`读取列表失败: ${e.message}`);
      return {
        data: [],
        page: 1,
        total: 0,
        success: true,
      };
    }
  };
  /**
   * 更新节点
   * @param fields
   */
  const handleUpdate = async (fields: any) => {
    try {
      const _data =
        activeKey === '村事共商' ? await editVote(fields) : await editVotePartake(fields);
      if (_data.code === 0) {
        message.success('更新成功');
        setIsEdit(false);
        handleModalVisible(false);
        setTypeVisiable(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
        setFormValues({});
        setTypeValues({});
      } else {
        message.error(_data.msg);
      }
    } catch (err) {
      message.error('更新失败');
    }
  };
  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = async (fields: FormValueType) => {
    try {
      const _data = activeKey === '村事共商' ? await addVote(fields) : await addVotePartake(fields);
      if (_data.code === 0) {
        message.success('添加成功');
        setIsEdit(false);
        handleModalVisible(false);
        setTypeVisiable(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
        setFormValues({});
        setTypeValues({});
      } else {
        message.error(_data.msg);
      }
    } catch (err) {
      message.error('添加失败');
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    let region = [];
    if (user.role_type == 3) {
      region = [user.city_id, user.town_id, user.village_id];
    }
    setRegion(region);
  }, []);
  return (
    <>
      <PageHeaderWrapper
        tabActiveKey={activeKey}
        tabList={tabs}
        onTabChange={(v) => {
          setActiveKey(v);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      >
        {activeKey === '村事共商' && (
          <ProTable
            actionRef={actionRef}
            request={loadData}
            columns={tableColumns}
            rowKey="id"
            options={false}
            toolBarRender={() => [
              <ButtonAuth type="VILLAGE_OFFICIAL">
                <Button
                  type="primary"
                  onClick={() => {
                    handleModalVisible(true);
                    setIsEdit(false);
                    setReadOnly(false);
                  }}
                >
                  +新建
                </Button>
              </ButtonAuth>,
            ]}
          />
        )}

        {activeKey === '参与人分类' && (
          <ProTable
            actionRef={actionRef}
            request={loadData}
            columns={tableColumns1}
            rowKey="id"
            options={false}
            toolBarRender={() => [
              <ButtonAuth type="VILLAGE_OFFICIAL">
                <Button
                  type="primary"
                  onClick={() => {
                    setTypeVisiable(true);
                    setIsEdit(false);
                    setReadOnly(false);
                  }}
                >
                  +新建
                </Button>
              </ButtonAuth>,
            ]}
          />
        )}
      </PageHeaderWrapper>

      {(formValues && Object.keys(formValues).length) || createModalVisible ? (
        <CreateForm
          isEdit={isEdit}
          readOnly={readOnly}
          rowParams={storedParams}
          onSubmit={(value: any) => {
            if (isEdit) {
              handleUpdate(value);
            } else {
              handleAdd(value);
            }
          }}
          onCancel={() => {
            handleModalVisible(false);
            setFormValues({});
          }}
          modalVisible={createModalVisible}
          values={{ ...formValues }}
        />
      ) : null}

      {(typeValues && Object.keys(typeValues).length) || typeVisiable ? (
        <TypeForm
          isEdit={isEdit}
          rowParams={storedParams}
          onSubmit={(value: any) => {
            // console.log(value);
            // return;
            if (isEdit) {
              handleUpdate(value);
            } else {
              handleAdd(value);
            }
          }}
          onCancel={() => {
            setIsEdit(false);
            setTypeVisiable(false);
            setTypeValues({});
          }}
          modalVisible={typeVisiable}
          values={typeValues}
        />
      ) : null}
    </>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(VillageAffairs);
