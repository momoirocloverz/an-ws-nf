/* eslint-disable import/no-unresolved */
import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
import {
  Button, message, Popover,  Modal
} from 'antd';
// eslint-disable-next-line no-unused-vars
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getEntityList, _delDeclaresUserInfo } from '@/services/agricultureSubsidies';
import { tableDataHandle } from '@/utils/utils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  ownershipTypes, USER_TYPES,
} from '@/pages/agricultureSubsidies/consts';
import {
  findAuthorizationsByPath,
  redirectToFarmlandMap, transformUploadedImageData,
} from '@/pages/agricultureSubsidies/utils';
// eslint-disable-next-line no-unused-vars
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import ModifyEntityDetailsModal from '@/components/agricultureSubsidies/ModifyEntityDetailsModal';
import { SimpleUploadedFileType } from '@/pages/agricultureSubsidies/types';
import styles from './index.less';
import ButtonAuth from '@/components/ButtonAuth';
import ImportBtn from '@/components/buttons/ImportBtn';

type TableListItem = {
  id: string;
  ownershipType: string;
  businessName: string;
  name: string;
  idNumber: string;
  phoneNumber: string;
  accountNumber: string;
  bankName: string;
  hasResidenceCard: number;
  residenceCardNumber: string;
  idFront: SimpleUploadedFileType[];
  idBack: SimpleUploadedFileType[];
  licenses: SimpleUploadedFileType[];
  creditUnionCode: string;
};

function EntityList({ authorizations }) {
  // const [data, setData] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formContent, setFormContent] = useState({});
  const isMounted = useRef(true);
  const tableRef = useRef();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '性质',
      dataIndex: 'ownershipType',
      valueEnum: ownershipTypes,
      filters: undefined,
    },
    {
      title: '主体名称',
      dataIndex: 'businessName',
      render: (__, record) => (record.businessName || '--'),
      hideInSearch: true,
    },
    {
      title: '姓名/法人',
      dataIndex: 'name',
    },
    {
      title: '身份证',
      dataIndex: 'idNumber',
      render: (item, record) => (
        <span>{record.idNumber ? record.idNumber.replace(/(?<=\d{3})\d{12}(?=\d{2})/, '************') : ''}</span>
      ),
    },
    {
      title: '电话',
      dataIndex: 'phoneNumber',
      hideInSearch: true,
      render: (item, record) => (
        <span>{record.phoneNumber ? record.phoneNumber.replace(/(\d{3})\d*(\d{4})/, '$1****$2') : ''}</span>
      ),
    },
    {
      title: '银行账户/对公账户',
      dataIndex: 'accountNumber',
      render: (__, record) => (record.hasResidenceCard ? '--' : record.accountNumber),
      hideInSearch: true,
    },
    {
      title: '开户银行',
      dataIndex: 'bankName',
      render: (__, record) => (record.hasResidenceCard ? '--' : record.bankName || '--'),
      hideInSearch: true,
    },
    {
      title: '市民卡账户',
      dataIndex: 'residenceCardNumber',
      render: (__, record) => (record.hasResidenceCard ? record.residenceCardNumber : '--'),
      hideInSearch: true,
    },
    {
      title: '信用社代码',
      dataIndex: 'creditUnionCode',
      render: (__, record) => (record.creditUnionCode || '--'),
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      render: (__, record) => (
        <>
          <div>
            <ButtonAuth type="EDIT">
              <a
                onClick={() => {
                  setFormContent(record);
                  setIsModalVisible(true);
                }}
              >
                编辑
              </a>
            </ButtonAuth>
          </div>
          {
            record.admin_id > 0 ? (
              <div>
                <ButtonAuth type="EDIT">
                  <a
                    onClick={() => {
                      Modal.confirm({
                        content: `确认删除${record.name}?`,
                        icon: <ExclamationCircleOutlined />,
                        onOk: async () => {
                          try {
                            const data = await _delDeclaresUserInfo(record.id);
                            if(data.code === 0){
                              message.success('删除成功!');
                              tableRef.current.reload();
                            }else{
                              message.error(data.msg);
                            }
                          } catch (e) {
                            message.error(new Error(`删除失败: ${e.message}!`));
                          }
                        },
                      });
                    }}
                  >
                    删除
                  </a>
                </ButtonAuth>
              </div>
            ) : null
          }
        </>


      ),
    },
  ];

  useEffect(() => {
    if (authorizations.length > 0 && findAuthorizationsByPath(authorizations, '/agriculture-subsidies/entity-management').indexOf(USER_TYPES.VILLAGE_OFFICIAL) < 0) {
      redirectToFarmlandMap();
    }
  }, [authorizations]);

  // FIXME: memory leak
  const loadData = async (params) => {
    try {
      const result = await getEntityList({
        idNumber: params.idNumber,
        name: params.name,
        ownershipType: params.ownershipType,
        pageNum: params.current,
        pageSize: params.pageSize,
      });
      const firstPass: any[] = [];
      result.data.data.data.forEach((e, i) => {
        firstPass[i] = {};
        firstPass[i].id = e.id;
        firstPass[i].admin_id = e.admin_id;
        firstPass[i].ownershipType = e.subsidy_type;
        firstPass[i].businessName = e.subsidy_type === 1 ? '--' : e.real_name;
        firstPass[i].name = e.subsidy_type === 1 ? e.real_name : e.legal_name;
        firstPass[i].contractor = e.real_name;
        firstPass[i].legalRep = e.legal_name;
        firstPass[i].idNumber = e.identity;
        firstPass[i].phoneNumber = e.mobile;
        firstPass[i].hasResidenceCard = e.is_citizen_card;
        firstPass[i].accountNumber = e.bank_card_number;
        firstPass[i].bankName = e.bank_name;
        firstPass[i].residenceCardNumber = firstPass[i].hasResidenceCard ? e.bank_card_number : null;
        firstPass[i].idFront = transformUploadedImageData([e.identity_card_front]);
        firstPass[i].idBack = transformUploadedImageData([e.identity_card_back]);
        firstPass[i].licenses = transformUploadedImageData(e.business_license ?? []);
        firstPass[i].creditUnionCode = e.credit_num;
      });
      const { data, ...pagination } = result.data.data;
      // @ts-ignore
      const transformedResult = tableDataHandle({ code: result.code, data: { ...pagination, data: firstPass } });
      if (isMounted.current) {
        return transformedResult;
      }
      return undefined;
    } catch (e) {
      message.error(`农户数据读取失败: ${e.message}`);
      return tableDataHandle({
        code: -1,
        data: [],
        pagination: {
          page: 1,
          item_total: 0,
          page_count: 1,
          page_total: 1,
        },
      });
    }
  };

  useEffect(() => () => {
    isMounted.current = false;
  }, []);

  const onSuccess = useCallback(() => {
    setIsModalVisible(false);
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    tableRef.current?.reload();
  }, []);
  const onCancel = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  return (
    <PageHeaderWrapper>
      <main className={styles.pageContainer}>
        <ProTable<TableListItem>
          actionRef={tableRef}
          request={loadData}
          columns={columns}
          rowKey="id"
          options={false}
          toolBarRender={() => [
            <ButtonAuth type="IMPORT">
              <Button
                type="primary"
                onClick={() => {
                  window.location.href = 'https://img.wsnf.cn/acfile/%E4%B8%AA%E4%BA%BA%E8%AE%A4%E8%AF%81.xlsx';
                }}
              >
                个人模板
              </Button>
              <Button
                type="primary"
                style={{marginLeft: '10px'}}
                onClick={() => {
                  window.location.href = 'https://img.wsnf.cn/acfile/%E4%BC%81%E4%B8%9A%E8%AE%A4%E8%AF%81.xlsx';
                }}
              >
                企业模板
              </Button>
            </ButtonAuth>,
            <ButtonAuth type="IMPORT">
              <Popover
                content={
                  <div>
                    <div><ImportBtn api={'import_declares_userinfo_real'} btnText={"导入个人"} onSuccess={() => tableRef.current?.reload()} /></div>
                    <div style={{marginTop: '20px'}}><ImportBtn api={'import_declares_userinfo_legal'} btnText={"导入企业"} onSuccess={() => tableRef.current?.reload()} /></div>
                  </div>
                }
                trigger="click"
              >
                <Button type="primary">导入</Button>
              </Popover>
            </ButtonAuth>,
          ]}
        />
      </main>
      <ModifyEntityDetailsModal
        context={formContent}
        visible={isModalVisible}
        cancelCb={onCancel}
        successCb={onSuccess}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ user }: ConnectState) => ({
  authorizations: user.userAuthButton,
}))(EntityList);
