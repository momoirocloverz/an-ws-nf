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
          message.error(`????????????: ${error?.msg || ''}`);
        });
        if (results.length > errors.length) {
          message.warn('??????????????????');
          setAccessVisible(false);
          actionRef.current?.reload();
        }
      } else {
        message.success('????????????');
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
      title: '??????ID',
      dataIndex: 'user_id',
      hideInSearch: true,
    },
    {
      title: '????????????',
      dataIndex: 'real_name',
      hideInSearch: false,
    },
    {
      title: '????????????',
      dataIndex: 'nickname',
      hideInSearch: false,
    },
    {
      title: '?????????',
      dataIndex: 'mobile',
      hideInSearch: false,
    },
    {
      title: '??????',
      dataIndex: 'avatar_url',
      hideInSearch: true,
      renderText: (val, record) => {
        if (!val) {
          return (<span>???</span>)
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
      title: '????????????',
      dataIndex: 'city_town',
      hideInSearch: true,
    },
    {
      title: '??????',
      dataIndex: 'citizen_type_name',
      hideInSearch: true,
      render: (item, record) => ( record.citizen_type_parent_name + (record.citizen_type_name != null ? ('-' + record.citizen_type_name) : ''))
    },
    {
      title: '????????????',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '??????',
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
              ??????
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
              ????????????
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
          searchText: '??????',
        }}
        toolBarRender={(action, { selectedRows }) => [
            <Button
              type="primary"
              onClick={() => {
                const { pageNum, pageSize, ...exportParams } = storedParams;
                getCitizenList({ ...exportParams, asFile: 1 }).then((result) => {
                  downloadAs(result, `${new Date().toLocaleString()}????????????.xls`, 'application/vnd.ms-excel');
                }).catch((e) => {
                  message.error(`????????????: ${e.message}`);
                });
              }}
            >
              ??????
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
        title="????????????"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            ??????
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            ??????
          </Button>,
        ]}
      >
        <Checkbox onChange={(e) => setUserPermissions({ ...userPermissions, envInspection: e.target.checked })} checked={userPermissions.envInspection}>????????????????????????</Checkbox>
      </Modal>
    </>
  )
}
export default List;
