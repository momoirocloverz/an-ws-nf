import React, { useEffect, useRef, useState } from 'react';
import { tableDataHandle, mask } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, message, Modal, Cascader
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import ImportBtn from '@/components/buttons/ImportBtn';
import ProspectModal from '@/components/agricultureSubsidies/ProspectiveApplicantModal';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { deleteProspect, getProspects } from '@/services/agricultureSubsidies';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

function EligibleList({ user, areaList }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [initialized, setInitialized] = useState(false);
  const tableRef = useRef();

  useEffect(() => {
    if (user) {
      setInitialized(true);
    }
  }, [user]);

  const loadData = async (rawParams) => {
    const userInfo = JSON.parse( localStorage.getItem('userInfo') );
    const params = {
      name: rawParams.name,
      idNumber: rawParams.identity,
      region: rawParams?.area_name?.length ? [rawParams.area_name[0] ?? 0, rawParams.area_name[1] ?? 0, rawParams.area_name[2] ?? 0] : [userInfo.city_id, userInfo.town_id, userInfo.village_id],
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    const result = await getProspects(params);
    if (result.code !== 0) {
      message.error(`读取列表失败: ${result.msg}`);
      throw new Error(result.msg);
    }
    // result.data.data.map(item => {
    //   item.area = item.city_name + '/' + item.town_name + '/' + item.village_name
    // })
    // setStoredParams(params);
    const transformed = result.data.data ?? [];
    return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  };

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 140,
    },
    {
      title: '手机号',
      dataIndex: 'identity',
      hideInSearch: true,
      render: (__, record) => (mask(record.mobile)),
    },
    {
      title: '身份证号',
      dataIndex: 'identity',
      render: (__, record) => (mask(record.identity, { headLength: 4 })),
    },
    {
      title: '授权地区',
      dataIndex: 'area_name',
      hideInSearch: user.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaLists = (user.role_type === 4 && areaList.length > 0) ? areaList[0].children : areaList;
        return (
          <Cascader options={areaLists} changeOnSelect/>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      hideInSearch: true
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <ButtonAuth type="EDIT">
            <Button
              type="link"
              onClick={() => {
                setSelectedRow({ ...record, action: 'modify' });
                setIsModalVisible(true);
                setIsEdit(true)
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
            <Button
              type="link"
              onClick={() => {
                Modal.confirm({
                  content: `确认删除${record.name}?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      await deleteProspect(record.id);
                      message.success('删除成功!');
                      tableRef.current.reload();
                    } catch (e) {
                      message.error(new Error(`删除失败: ${e.message}!`));
                    }
                  },
                });
              }}
            >
              删除
            </Button>
          </ButtonAuth>
        </div>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      { initialized && (
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        toolBarRender={() => [
          <ButtonAuth type="IMPORT">
            <Button
              type="primary"
              onClick={() => {
                console.log(user.role_type)
                if(user.role_type === 3) {
                  window.location.href = 'https://img.wsnf.cn/acfile/%E7%94%B3%E6%8A%A5%E4%BA%BA%E5%91%98%E5%8C%B9%E9%85%8D%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx';
                } else {
                  window.location.href = 'https://img.wsnf.cn/acfile/%E7%94%B3%E6%8A%A5%E4%BA%BA%E5%91%98%E5%8C%B9%E9%85%8D%E5%AF%BC%E5%85%A5%E5%B8%82%E7%BA%A7%E6%A8%A1%E6%9D%BF.xlsx';
                }
              }}
            >
              下载模板
            </Button>
          </ButtonAuth>,
          <ButtonAuth type="IMPORT">
            <ImportBtn api={user.role_type === 3 ? 'import_match_people' : 'import_match_people_new'} onSuccess={() => tableRef.current?.reload()} />
          </ButtonAuth>,
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setSelectedRow({ action: 'create' });
                setIsModalVisible(true);
                setIsEdit(false)
              }}
            >
              +新建
            </Button>
          </ButtonAuth>,
        ]}
      />
      )}
      <ProspectModal
        context={selectedRow}
        visible={isModalVisible}
        isEdit={isEdit}
        areaList={areaList}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          tableRef.current?.reload();
        }}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  areaList: info.areaList
}))(EligibleList);
