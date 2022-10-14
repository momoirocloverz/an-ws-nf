import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {TableListItem} from "@/pages/customer/master/data";
import ButtonAuth from "@/components/ButtonAuth";
import {Avatar, Button, Checkbox, message, Modal} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {getCitizenList, getCitizenTypeList} from "@/services/citizens";
import {tableDataHandle} from "@/utils/utils";
import InfoEdit from "./infoEdit";
import {setFamilyParty, setIsEnvInspector, setPhoto} from "@/services/customer";
import {getGruppenfuhrers} from "@/services/myHometown";
import {downloadAs} from "@/pages/agricultureSubsidies/utils";
import {UserOutlined} from "@ant-design/icons";

function List() {
  useEffect(() => {
    getListType();
  }, []);
  const getListType = async () => {
    const result = await getCitizenTypeList();
    if (result.code === 0) {
      setCategory(result.data);
    }
  };
  const permissionUpdateFunctions: Record<string, (params) => Promise<unknown>> = {
    envInspection: setIsEnvInspector,
  };
  const [ accessVisible, setAccessVisible ] = useState(false);
  const [ userPermissions, setUserPermissions ] = useState({});
  const [ initialUserPermissions, setInitialUserPermissions ] = useState({});
  const [ userObj, setUserObj ] = useState({});
  const [category, setCategory] = useState([]);
  const actionRef = useRef<ActionType>();
  const [selectRow, setSelectRow] = useState({});
  const [visible, setVisible] = useState(false);
  const handleCancel = () => {
    setAccessVisible(false);
  }

  const handleOk = async () => {
    const tasks = [];
    Object.entries(userPermissions).forEach(([key, value]) => {
      if (value !== initialUserPermissions[key]){
        tasks.push(permissionUpdateFunctions[key]({ ...userObj, can: value ? 1 : 0 }));
      }
    });
    try {
      const results = await Promise.all(tasks);
      const errors = results.filter((result) => (result?.code !== 0));
      if (errors.length > 0) {
        errors.forEach((error) => {
          message.error(`编辑失败: ${error?.msg || ''}`);
        });
        if (results.length > errors.length) {
          message.warn('部分编辑成功');
          setAccessVisible(false);
          actionRef.current?.reload();
        }
      } else {
        message.success('编辑成功');
        setAccessVisible(false);
        actionRef.current.reload();
      }
    } catch (e) {
      message.error(e.message);
    }
  }
  const [storedParams, setStoredParams] = useState({});
  const loadData = async (rawParams) => {
    const params = {
      real_name: rawParams.real_name,
      nickname: rawParams.nickname,
      mobile: rawParams.mobile,
      page: rawParams.current,
      page_size: rawParams.pageSize,
    };
    setStoredParams(params);
    const result = await getCitizenList(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      real_name: row.real_name,
      mobile: row.mobile,
      avatar_url: row.avatar,
      // avatar_id: row.avatar[0]?.id,
      nickname: row.nickname,
      sex: row.sex,
      city_town: row.city_town,
      created_at: row.created_at,
      citizen_type_parent_name: row.citizen_type_parent_name,
      citizen_type_parent: row.citizen_type_parent,
      citizen_type_name: row.citizen_type_name,
      citizen_type: row.citizen_type,
      inspect_qyxm: row.inspect_qyxm
    })) : [];
    return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户ID',
      dataIndex: 'user_id',
      hideInSearch: true,
    },
    {
      title: '用户姓名',
      dataIndex: 'real_name',
      hideInSearch: false,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      hideInSearch: false,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      hideInSearch: false,
    },
    {
      title: '头像',
      dataIndex: 'avatar_url',
      hideInSearch: true,
      renderText: (val, record) => {
        if (!val) {
          return (<span>无</span>)
        }

        return (
          <div onClick={
            () => {
              window.open(val);
            }
          }>
            <Avatar src={record.avatar_url} size={64} icon={<UserOutlined />} />
          </div>
        );
      }
    },
    {
      title: '所属地区',
      dataIndex: 'city_town',
      hideInSearch: true,
    },
    {
      title: '分类',
      dataIndex: 'citizen_type_name',
      hideInSearch: true,
      render: (item, record) => ( record.citizen_type_parent_name + (record.citizen_type_name != null ? ('-' + record.citizen_type_name) : ''))
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, value) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <ButtonAuth type="EDIT">
            <Button
              type="link"
              onClick={() => {
                setSelectRow(value);
                setVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <ButtonAuth type="ACCESS_EDIT">
            <Button
              type="link"
              onClick={() => {
                setAccessVisible(true);
                setUserPermissions({
                  envInspection: !!value.inspect_qyxm,
                });
                setInitialUserPermissions({
                  envInspection: !!value.inspect_qyxm,
                });
                setUserObj({
                  user_id: value.user_id
                });
              }}
            >
              巡查权限
            </Button>
          </ButtonAuth>
        </div>
      ),
    },
  ];
  return (
    <>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="user_id"
        search={{
          searchText: '搜索',
        }}
        toolBarRender={(action, { selectedRows }) => [
            <Button
              type="primary"
              onClick={() => {
                const { pageNum, pageSize, ...exportParams } = storedParams;
                getCitizenList({ ...exportParams, asFile: 1 }).then((result) => {
                  downloadAs(result, `${new Date().toLocaleString()}市民列表.xls`, 'application/vnd.ms-excel');
                }).catch((e) => {
                  message.error(`导出失败: ${e.message}`);
                });
              }}
            >
              导出
            </Button>
        ]}
        options={false}
        request={loadData}
        columns={columns}
      />
      <InfoEdit
        context={selectRow}
        visible={visible}
        category={category}
        onCancel={() => setVisible(false)}
        onSuccess={() => {
          setVisible(false);
          actionRef.current?.reload();
        }}
      />
      <Modal
        visible={accessVisible}
        title="设置权限"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Checkbox onChange={(e) => setUserPermissions({ ...userPermissions, envInspection: e.target.checked })} checked={userPermissions.envInspection}>全域秀美检查权限</Checkbox>
      </Modal>
    </>
  )
}
export default List;
