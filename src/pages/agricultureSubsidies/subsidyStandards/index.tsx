/* eslint-disable import/no-unresolved */
import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import {
  Button, Cascader, DatePicker, message, Modal,
} from 'antd';
// eslint-disable-next-line no-unused-vars
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  deleteSubsidyStandard,
  getCategoryList,
  getCropList,
  getSubsidyStandards,
} from '@/services/agricultureSubsidies';
import moment from 'moment';
import SubsidyStandardForm from '@/components/agricultureSubsidies/SubsidyStandardForm';
import { tableDataHandle } from '@/utils/utils';
import _ from 'lodash';
import { seasons, USER_TYPES } from '@/pages/agricultureSubsidies/consts';
import {
  findAuthorizationsByPath,
  redirectToFarmlandMap,
  transformCategoryTree, traverseTree,
} from '@/pages/agricultureSubsidies/utils';
// eslint-disable-next-line no-unused-vars
import { CascaderOptionType } from 'antd/es/cascader';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './index.less';

type TableListItem = {
  key: number;
  id: number;
  category: number;
  crops: number | string;
  year: number;
  season: number;
  standard: number | string;
  //-----------------------
  /* eslint-disable camelcase */
  crops_name: string;
  crops_id: string;
  scale_name: string;
  scale_id: string;
  scale_parent_id: string;
};

function undefinedCheck(value) {
  return value === '0' ? undefined : value;
}
// eslint-disable-next-line no-unused-vars
function disableYears(current) {
  // return current && current < moment().endOf('year');
  return false;
}

type FormContext = 'modify' | 'create';
function SubsidyStandards({ authorizations }) {
  // const [data, setData] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formContext, setFormContext] = useState<FormContext>('create');
  const [formContent, setFormContent] = useState({});
  const [categoryTree, setCategoryTree] = useState<CascaderOptionType[]>([]);
  const [cropList, setCropList] = useState({});
  const isMounted = useRef(true);
  const tableRef = useRef();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    // ????????????
    {
      title: '??????',
      dataIndex: 'category',
      // valueEnum: { ...categoryList, 0: '??????' },
      renderFormItem: () => (<Cascader options={categoryTree} />),
      filters: undefined,
      render: (__, record) => (record.scale_name),
    },
    // ????????????
    {
      title: '????????????',
      key: 'subCategory',
      hideInSearch: true,
      filters: undefined,
      render: (__, record) => (traverseTree(categoryTree, [record.scale_parent_id, record.scale_id], 'value', 'label')?.[1]),
    },
    // {
    //   title: '????????????',
    //   dataIndex: 'crops',
    //   valueEnum: { ...cropList, 0: '??????' },
    //   filters: undefined,
    //   render: (__, record) => (record.crops_name),
    // },
    {
      title: '??????',
      dataIndex: 'season',
      valueEnum: { ...seasons, 0: '??????' },
      filters: undefined,
      render: (__, record) => {

        const arr = [15, 16, 19, 20, 21, 22];
        return !arr.includes(record.scale_parent_id) ? seasons[record.season]:'-';
      }
    },
    {
      title: '??????',
      dataIndex: 'year',
      initialValue: moment(),
      renderFormItem: () => <DatePicker picker="year" disabledDate={disableYears} />,
    },
    {
      title: '????????????(???/???)',
      dataIndex: 'standard',
      hideInSearch: true,
      render: (__, record) => (record['standard'] + (record['scale_id'] === 16 ? '???/???' : '???/???'))
    },
    {
      title: '??????',
      key: 'actions',
      hideInSearch: true,
      render: (__, record) => (
        <div>
          <Button
            type="link"
            onClick={() => {
              setFormContext('modify');
              setIsFormVisible(true);
              setFormContent(record);
            }}
          >
            ??????
          </Button>
          <Button
            type="link"
            onClick={() => {
              Modal.confirm({
                content: `????????????"${record.year}${seasons[record.season.toString()] ?? ''}${record.crops_name ?? ''}${
                  record.scale_name ?? ''}"????????????????`,
                onOk: async () => {
                  try {
                    await deleteSubsidyStandard(record.id);
                    message.success('????????????????????????!');
                    // eslint-disable-next-line no-unused-expressions
                    tableRef.current?.reload();
                  } catch (e) {
                    message.error('????????????????????????!');
                  }
                },
              });
            }}
          >
            ??????
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (authorizations.length > 0 && findAuthorizationsByPath(authorizations, '/agriculture-subsidies/subsidy-standards').indexOf(USER_TYPES.CITY_OFFICIAL) < 0) {
      redirectToFarmlandMap();
    }
  }, [authorizations]);

  // FIXME: memory leak
  const loadData = async (params) => {
    console.log(params)
    try {
      const result = await getSubsidyStandards(
        params.year && new Date(params.year).getFullYear(),
        undefinedCheck(params.season),
        _.last(params.category),
        params.current,
        params.pageSize,
      );
      result.data.data.forEach((e, i) => {
        result.data.data[i].standard = e.standard_price;
      });
      // @ts-ignore
      const transformedResult = tableDataHandle(result);
      if (isMounted.current) {
        return transformedResult;
      }
      return undefined;
    } catch (e) {
      console.log(e)
      message.error(`??????????????????????????????: ${e.message}`);
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

  useEffect(() => {
    getCategoryList()
      .then((result) => {
        if (isMounted.current) {
          setCategoryTree(transformCategoryTree(result.data));
        }
      })
      .catch((e) => message.error(`??????????????????????????????: ${e.message}`));
    getCropList()
      .then((result) => {
        if (isMounted.current) {
          const crops = {};
          result.data.forEach((e) => {
            crops[e.id.toString()] = e.crops_name;
          });
          // @ts-ignore
          setCropList(crops);
        }
      })
      .catch((e) => message.error(`???????????????????????????: ${e.message}`));
    return () => {
      isMounted.current = false;
    };
  }, []);

  const formEnums = useMemo(() => ({ crops: cropList, seasons, categories: categoryTree }), [cropList, categoryTree]);
  const onSuccess = useCallback(() => {
    setIsFormVisible(false);
    // @ts-ignore
    // eslint-disable-next-line no-unused-expressions
    tableRef.current?.reload();
  }, []);
  const onCancel = useCallback(() => {
    setIsFormVisible(false);
  }, []);

  return (
    <PageHeaderWrapper>
      <main className={styles.pageContainer}>
        <ProTable<TableListItem>
          // dataSource={data}
          actionRef={tableRef}
          request={loadData}
          columns={columns}
          rowKey="id"
          options={false}
          toolBarRender={() => [
            <Button
              key="primary"
              type="primary"
              onClick={() => {
                setFormContext('create');
                setIsFormVisible(true);
                setFormContent({});
              }}
            >
              ??????????????????
            </Button>,
          ]}
        />
      </main>
      <SubsidyStandardForm
        visible={isFormVisible}
        context={formContext}
        object={formContent}
        enums={formEnums}
        successCb={onSuccess}
        cancelCb={onCancel}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ user }: ConnectState) => ({
  authorizations: user.userAuthButton,
}))(SubsidyStandards);
