import ProTable, { ProColumns } from '@ant-design/pro-table';
import { history, Reducer, Effect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableImage from '@/components/ImgView/TableImage';
import styles from './index.less';
import React, {useRef, useState} from 'react';
import ButtonAuth from '@/components/ButtonAuth';
import {Button, message, Modal, Cascader} from 'antd';
import {deleteLandCirculation, landCirculationList} from '@/services/landCirculation';
import { tableDataHandle, mask } from '@/utils/utils';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import EditModel from '@/pages/agricultureSubsidies/landCirculation/modules/editModel';
import DetailModal from "@/pages/agricultureSubsidies/landCirculation/modules/detailModal";
import CarouselImg from "@/components/CarouselImg";
import { connect, ConnectState } from 'umi';

type TableListItem = {
  id: number;
  subsidy_object: string;
  identity: string;
  mobile: string;
  circulation_area: number;
  contract_imgs: any;
};

function LandCirculation({ user, areaList }) {
  const tableRef = useRef();
  const [selectedRow, setSelectedRow] = useState({});
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const tableColumns = [
    {
      title: '补贴对象',
      dataIndex: 'subsidy_object',
    },
    {
      title: '联系电话',
      dataIndex: 'mobile',
      render: (__, record) => (mask(record.mobile)),
    },
    {
      title: '身份证号',
      dataIndex: 'identity',
      render: (__, record) => (mask(record.identity, { headLength: 4 })),
    },
    {
      title: '流转面积',
      dataIndex: 'circulation_area',
    },
    {
      title: '授权地区',
      dataIndex: 'area_name',
      hideInSearch: user.role_type === 3 ? true : false,
      renderFormItem: () => {
        let areaLists = (user.role_type === 4 && areaList.length > 0) ? areaList[0].children : areaList;
        return (
          <Cascader options={areaLists} changeOnSelect/>
        )
      }
    },
    {
      title: '合同照片',
      dataIndex: 'contract_imgs',
      hideInSearch: true,
      align: 'center',
      render: (_: any, record: any) => {
        const urls = record.contract_imgs.map((item: any) => {
          return item.url
        })
        return record.contract_imgs && record.contract_imgs.length > 0 ? (
          <CarouselImg urlList={urls} />
        ) : null
      },
      // render: (item) => (<TableImage src={item.length ? item[0].url : ''} />),
      width: 140,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
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
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          <Button
            type="link"
            onClick={() => {
              setIsDetailVisible(true)
              setSelectedRow({ ...record });
              // history.push({
              //   pathname: 'landCirculationDetail',
              //   query: {
              //     id: record.id
              //   }
              // })
            }}
          >
            流转详情
          </Button>
          <ButtonAuth type="DELETE">
            <Button
              type="link"
              danger
              onClick={() => {
                Modal.confirm({
                  content: `确认删除?`,
                  icon: <ExclamationCircleOutlined />,
                  onOk: async () => {
                    try {
                      await deleteLandCirculation({id: record.id});
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
  ]

  const loadData = async (rawParams) => {
    const params = {
      subsidy_object: rawParams.subsidy_object,
      identity: rawParams.identity,
      mobile: rawParams.mobile,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    }
    const result = await landCirculationList(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      subsidy_object:row.subsidy_object,
      identity: row.identity,
      mobile: row.mobile,
      circulation_area: row.circulation_area,
      contract_imgs: row.contract_imgs,
      area_name: `${row.city_name}/${row.town_name}/${row.village_name}`,
      area: [row.city_id, row.town_id, row.village_id],
      created_at: row.created_at,
      file_id: row.file_id,
      file_id_url: row.file_id_url
    })) : [];
    return tableDataHandle({...result, data: {...(result.data), data: transformed}});
  }
  return (
    <PageHeaderWrapper>
      <div className={styles.page}>
        <ProTable
          actionRef={tableRef}
          request={loadData}
          columns={tableColumns}
          rowKey="id"
          options={false}
          toolBarRender={() => [
            <ButtonAuth type="CREATE">
              <Button
                type="primary"
                onClick={() => {
                  setSelectedRow({ action: 'create' });
                  setIsModalVisible(true);
                }}
              >
                +新增
              </Button>
            </ButtonAuth>
          ]}
        />
        {
          isModalVisible ? (
            <EditModel
              context={selectedRow}
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onSuccess={() => {
                setIsModalVisible(false);
                tableRef.current?.reload();
              }}
            />
          ) : null
        }
        {
          isDetailVisible ? (
            <DetailModal
              context={selectedRow}
              visible={isDetailVisible}
              onCancel={() => {
                setIsDetailVisible(false);
                tableRef.current?.reload();
              }}
              onSuccess={() => {
                setIsModalVisible(false);
                tableRef.current?.reload();
              }}
            />
          ) : null
        }
      </div>
    </PageHeaderWrapper>
  )
}
export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  areaList: info.areaList
}))(LandCirculation);
