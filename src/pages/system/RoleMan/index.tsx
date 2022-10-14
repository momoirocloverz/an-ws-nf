import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'umi';
import { Table, Button, message, Divider, Card, Modal } from 'antd';
import { getRolePageList, createRole, editRole, deleteRole, setRoleMemu, getMenuAuthList } from '@/services/system';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CreateForm, { formValueState } from './components/Form';
import RouteModal from './components/RouteModal';
import { arrToStr }  from '@/utils/utils';

interface RoleProps {
  dispatch: Dispatch;
  navList: Array<any>;
}

const RoleMan: React.FC<RoleProps> = props => {
  const { navList, dispatch } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [roleVisible, setRoleVisible] = useState(false);
  const [intiValue, setInitValue] = useState<formValueState>({});
  const [roleList, setRoleList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const [roleId, setRoleId] = useState();
  const [navListDetail, setNavList] = useState<any>(navList);


  const columns = [
    {
      title: '序号',
      dataIndex: 'role_id',
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
    },
    {
      title: '角色类型',
      dataIndex: 'role_type',
      render: (_: any, record: any) => {
        let cont = '';
        if (record.role_type === 1) {
          cont = '平台管理员'
        } else if (record.role_type === 2) {
          cont = '运营人员'
        } else if (record.role_type === 3) {
          cont = '村级信息员'
        } else if (record.role_type === 4) {
          cont = '乡镇管理员'
        }
        return <span>{cont}</span>
      }
    },
    {
      title: '描述',
      dataIndex: 'describe',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align:'center',
      render: (val: any, record: any) => (
        <>
          {/* <a
            onClick={() => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '确定要删除该角色？请先检查该角色下是否有账号或账号中的角色已做变更。若未变更，删除后该角色下所有账号看到的是空页面。',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  // 确认删除
                  deleteRole({
                    role_id: record.role_id,
                  }).then( res => {
                    if (res.code === 0) {
                      getRoleListData(page, pageSize);
                    } else {
                      message.error(res.msg);
                    }
                  });
                },
              });
            }}
          >
            删除
          </a>
          <Divider type="vertical" />*/}
          <a
            onClick={() => {
              setIsEdit(true);
              setModalVisible(true);
              setInitValue(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setRoleId(record.role_id);
              setSelectedMenu(record.selected_menu);
              setRoleVisible(true);
            }}
           >权限</a>
        </>
      ),
    },
  ];

  const handleChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: {
      currentDataSource: [];
    }
  ) => {
    console.log('pagination  :', pagination);
  };

  const pageChange = (pageVal: any, pageSizeVal: any) => {
    console.log(' page  : ' + page + '  pageSize  :' + pageSize);
    setPage(pageVal);
    setPageSize(pageSizeVal);
    getRoleListData(pageVal, pageSizeVal);
  };

  useEffect(() => {
    getRoleListData(page, pageSize);
    getNavDetail();
    dispatch({
      type: 'system/queryNavList',
    })
  }, []);

  const tableHeader = () => {
    return (
      <div style={{float: 'right', paddingBottom: '10px'}}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => addRule()}>
          添加角色
        </Button>
      </div>
    );
  };

  const handleAdd = async (fields: any) => {
    const hide = message.loading('正在添加');
    console.log('files :', fields);

    try {
      hide();
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  const addRule = () => {
    setIsEdit(false);
    setModalVisible(true);
  };

  const formCancle = () => {
    setModalVisible(false);
    setInitValue({});
  };

  const getRoleListData = (pageVal:any, pageSize:any) => {
    getRolePageList({
      page: pageVal,
      page_size: pageSize,
    }).then((res:any) => {
      if (res.code === 0) {
        const _data = res.data;
        setRoleList(_data.data);
        setPageTotal(_data.total);
        setPage(_data.current_page);
      }else {
        message.error(res.msg);
      }
    })
  }

  const createRoleData = (val:any) => {
    let { role_name, describe, role_type } = val;
    if (!val.isEdit) {
      // 创建新角色
      createRole({
        role_name,
        describe,
        role_type
      }).then(res => {
        if (res.code === 0) {
          message.success('新增角色成功！');
          getRoleListData(page, pageSize);
        } else {
          message.error(res.msg);
        }
      });
    } else {
      editRole({
        role_id: val.role_id,
        role_name,
        describe,
        role_type
      }).then(res => {
        if (res.code === 0) {
          message.success('编辑角色成功！');
          getRoleListData(page, pageSize);
        } else {
          message.error(res.msg);
        }
      });
    }
  }

  // 设置角色权限
  const setRoleMenuData = (val: any) => {
    let _idStr = arrToStr(val);
    setRoleMemu({
      role_id: roleId,
      menu_ids: _idStr,
    }).then(res => {
      if (res.code === 0) {
        message.success('设置成功!');
        getRoleListData(page, pageSize);
      } else {
        message.error(res.msg);
      }
    });
  }

  const getNavDetail = async () => {
    const _data = await getMenuAuthList({});
    if (_data.code === 0) {
      setNavList(_data.data.rows);
    }
  }

  return (
    <PageHeaderWrapper>
      <Card>
        <Table
          rowKey={'role_id'}
          title={tableHeader}
          columns={columns}
          dataSource={roleList}
          onChange={() => handleChange}
          pagination={{
            size: "small",
            defaultPageSize: pageSize,
            total: pageTotal,
            showQuickJumper: true,
            onChange: pageChange,
          }}
        />
        {(intiValue && Object.keys(intiValue).length) || modalVisible ? (
          <CreateForm
            value={intiValue}
            isEdit={isEdit}
            onSubmit={async value => {
              const success = await handleAdd(value);

              if (success === true) {
                setInitValue({});
                setModalVisible(false);
                createRoleData(value);
              }
            }}
            onCancel={formCancle}
            modalVisible={modalVisible}
          />
        ) : null}
        {
          roleVisible ? (
            <RouteModal
              value={navListDetail}
              selected={selectedMenu}
              modalVisible={roleVisible}
              onSubmit={async (val) => {
                console.log('权限 :', val);
                setRoleMenuData(val);
                setRoleVisible(false);
              }}
              onCancel={ () => {
                setRoleVisible(false);
              }}
            />
          ) : null
        }
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ system }: ConnectState) => ({
  navList: system.navList,
}))(RoleMan);
