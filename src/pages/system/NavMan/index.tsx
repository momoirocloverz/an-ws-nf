import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Table, Card, Divider, Button, Modal, message } from 'antd';
import { EditableRow, EditableCell } from './components/TableEditForm';
import { ExclamationCircleOutlined, PlusOutlined, } from '@ant-design/icons';
import { getNavList, createNav, deleteMenu, getMenuDetail, eidtMenu, setNavSort, setAuth } from '@/services/system';
import UpdateForm from './components/UpdateForm';
import CreateChildren from './components/CreateChildren';
import AuthorityForm from './components/authModal';

const NavMan = (props: any) => {
  const [tableData, setTableData] = useState([]);
  const [formValue] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [authorityVisible, setAuthorityVisible] = useState(false);
  const [childrenVisible, setChildrenVisible] = useState(false);
  const [childrenFormValue, setChildrenFormValue] = useState<any>({});
  const [isEdit, setIsEdit] = useState(false);
  const [formLevel, setFormLevel] = useState(1);
  const [selectedAuth, setSelectedAuth] = useState<any[]>([]);
  const [defaultSelectValues, setDefaultSelectValues] = useState<any[]>([]);

  const { dispatch } = props;

  const columnsArr = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '菜单路由',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
    },
    {
      title: '菜单类型',
      dataIndex: 'type',
      key: 'type',
      render: (val: any) => {
        if (val === 1) {
          return (<span>一级</span>)
        }

        if (val === 2) {
          return (<span>二级</span>) 
        }

        return (<></>)
      } 
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      editable: true,
      width: '120px',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (val: any, record: any) => (
        <>
          <a
            onClick={() => {
              Modal.confirm({
                title: '提示',
                icon: <ExclamationCircleOutlined />,
                content: '确定要删除该菜单吗？删除后拥有菜单权限的账号登陆后都不能看到该菜单。',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                  // 确认删除
                  deleteMenu({
                    menu_id: record.menu_id,
                  }).then(() => {
                    message.success('删除成功！')
                    getNavData();
                  })
                },
              });
            }}
          >
            删除
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              getMenuDetail({
                menu_id: record.menu_id
              }).then(res => {
                if (res.code === 0) {
                  const _data = res.data.menuInfo;
                  setChildrenFormValue({
                    ..._data,
                    path: _data.route,
                    name: _data.menu_name,
                    menu_id: _data.menu_id,
                  });
                  setFormLevel(_data.type);
                  setIsEdit(true);
                  setChildrenVisible(true);
                }
              })
            }}
          >
            编辑
          </a>
          { record.type === 1 ? <Divider type="vertical" /> : null }
          {
            record.type === 1 ? (<a onClick={ () => createChildrenNav(record)}>创建子菜单</a>) : null
          }
          { record.children.length === 0 ? <Divider type="vertical" /> : null }
          {
            record.children.length === 0 ? (<a onClick={ () => {
              setIsEdit(false);
              setChildrenVisible(false);
              setAuthorityVisible(true);
              const defaultSelect: any = [];
              record.auth.forEach((item: any) => {
                defaultSelect.push(item.path);
              });
              setSelectedAuth(record);
              setDefaultSelectValues(defaultSelect);
            }}>绑定权限</a>) : null
          }
        </>
      ),
    },
  ];

  useEffect(() => {
    getNavData();
  }, []);

  const getNavData = () => {
    getNavList({}).then(res => {
      const _data = res.data.rows;
      _data.forEach((el: any) => {
        if (el.children && el.children.length > 0) {
          el.children.forEach((el2: any) => {
            el2.children = []
          })
        }
      });
      setTableData(_data);
    })
  }

  const handleSave = (row:any) => {
    setNavSort({
      menu_id: row.menu_id,
      sort: row.sort,
    }).then( res => {
      if (res.code === 0) {
        message.success('设置成功');
        getNavData();
      } else {
        message.error(res.msg);
      }
    });
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = columnsArr.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record:any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handlesave: handleSave, 
      }),
    };
  });

  const tableHeader = (props:any) => {
    return (
      <div style={{float: 'right', paddingBottom: '10px'}}>
        <Button icon={<PlusOutlined />} type="primary" onClick={() => {
          setModalVisible(true);
        }}>
          创建一级菜单
        </Button>
      </div>
    );
  };

  const handleForm = async (fields: any) => {
    const hide = message.loading('正在添加');

    try {
      hide();
      return true;
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
      return false;
    }
  };

  const handleAuthorityForm = async (fields: any, values: any) => {
    try {
      const _data = await setAuth({
        menu_id: values.menu_id,
        auth_button: fields.join(',')
      });
      if (_data.code === 0) {
        message.success('绑定成功');
        return true;
      } else {
        message.error(_data.msg);
        return false;
      }
    } catch (err) {
      message.error('绑定失败');
      return false;
    }
  };

  const formCancle = () => {
    setModalVisible(false);
  }

  const setChildrenMenu = (val:any) => {
    let _obj = {};

    if (!val.isEdit) {
      // 创建子菜单
      _obj = {
        menu_name: val.name,
        icon: val.icon,
        orderid: val.orderid || 0,
        pid: val.menu_id,
        type: val.formType,
        route: val.path || ''
      };

      createNav({
        ..._obj
      }).then((res:any) => {
        if (res.code === 0) {
          message.success('添加成功');
          getNavData();
        } else {
          message.error(res.msg);
        }
      });
    } else {
      // 编辑菜单
      _obj = {
        menu_name: val.name,
        icon: val.icon,
        orderid: val.orderid || 0,
        pid: val.pid,
        menu_id: val.menu_id,
        type: val.formType,
        route: val.path || ''
      };
      eidtMenu({
        ..._obj, 
      }).then(res => {
        if (res.code === 0) {
          message.success('编辑成功!');
          getNavData();
        } else {
          message.error(res.msg);
        }
      });
    }
    console.log('子菜单  :', _obj);
 
  }

  const createMenu = (val:any) => {
    createNav({
      menu_name: val.name,
      pid: 0,
      route: val.path,
      type: 1,
      icon: val.icon,
      orderid: val.orderid,
    }).then((res:any) => {
      if (res.code === 0 ) {
        message.success('添加成功');
        getNavData();
      }
    }); 
  }

  // 创建子菜单
  const createChildrenNav = (val: any) => {
    const _value = val;
    console.log(val);
    setChildrenFormValue({});
    setChildrenFormValue({
      pid: val.pid,
      menu_id: val.menu_id,
    }); 
    setFormLevel(_value.level);
    setIsEdit(false);
    setChildrenVisible(true);
  }

  return (
    <PageHeaderWrapper>
      <Card>
        {
          childrenVisible ? (
            <CreateChildren
              title={ !isEdit ? '添加' : '编辑' }
              value={childrenFormValue}
              level={formLevel}
              isEdit={isEdit}
              onSubmit={async (value:any) => {
                const success = await handleForm(value);
                if (success === true) {
                  setChildrenVisible(false);
                  setChildrenMenu(value);
                }
              }}
              onCancel={() => {
                setChildrenFormValue({}); 
                setChildrenVisible(false); 
              }}
              modalVisible={childrenVisible}
            />
          ) : null
        }
        {
          modalVisible ? (
            <UpdateForm
              title='创建一级菜单'
              value={formValue}
              type="add"
              onSubmit={async value => {
                const success = await handleForm(value);
    
                if (success === true) {
                  setModalVisible(false);
                  createMenu(value); 
                }
              }}
              onCancel={formCancle}
              modalVisible={modalVisible}
            />
          ) : null
        }
        {
          authorityVisible ? (
            <AuthorityForm
              selected={defaultSelectValues}
              onSubmit={async value => {
                const success = await handleAuthorityForm(value, selectedAuth);
                if (success) {
                  setAuthorityVisible(false);
                  getNavData();
                }
              }}
              onCancel={() => { 
                setAuthorityVisible(false); 
              }}
              modalVisible={authorityVisible}
            />
          ) : null
        }
        <Table
          title={tableHeader}
          rowClassName={() => 'editable-row'}
          components={components}
          rowKey="menu_id"
          columns={columns}
          dataSource={tableData}
          pagination={{
            size: "small",
            hideOnSinglePage: true,
          }}
          />
      </Card>
    </PageHeaderWrapper>
  );
};

export default NavMan;