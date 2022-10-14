import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {TableListItem} from "@/pages/customer/master/data";
import {Button, message} from "antd";
import React, {useRef, useState} from "react";
import {deleteCitizenTypeList, getCitizenTypeList} from "@/services/citizens";
import {tableDataHandle} from "@/utils/utils";
import CreateConfigModal from "./createConfigModal";
import ButtonAuth from "@/components/ButtonAuth";
import styles from "@/components/environmentalInspections/index.less";
import MainModal from "@/pages/customer/citizens/components/mainModal";


function RowList({data, tableRef, list}) {
  const [selectRow, setSelectRow] = useState({});
  const [visible, setVisible] = useState(false);
  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '子项分类',
      dataIndex: 'name',
      hideInSearch: true,
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
      width: 160,
      render: (item, record) => (
        <>
          <ButtonAuth type="EDIT">
          <Button
            type="link"
            onClick={() => {
              setSelectRow({...record, action: 'modify'});
              setVisible(true);
            }}
          >
            编辑
          </Button>
          </ButtonAuth>
          <ButtonAuth type="DELETE">
          <Button
            type="link"
            onClick={async () => {
              const result = await deleteCitizenTypeList({id: record.id})
              if (result.code === 0) {
                message.success('删除成功');
                tableRef.current?.reload();
              } else {
                message.error(result.msg);
              };
            }}
          >
            删除
          </Button>
          </ButtonAuth>
        </>
      ),
    },
  ]
  return (
    <>
      <ProTable
        rowClassName={styles.subItemRow}
        dataSource={data}
        columns={tableColumns}
        rowKey="id"
        options={false}
        search={false}
        pagination={{
          showSizeChanger: false,
          showTotal: undefined,
        }}
        toolBarRender={false}
      />
      {/*<CreateConfigModal*/}
      {/*  visible={visible}*/}
      {/*  context={selectRow}*/}
      {/*  options={list}*/}
      {/*  onCancel={() => setVisible(false)}*/}
      {/*  onSuccess={() => {*/}
      {/*    setVisible(false);*/}
      {/*    tableRef.current?.reload();*/}
      {/*  }}*/}
      {/*/>*/}
      <MainModal
        visible={visible}
        context={selectRow}
        onCancel={() => setVisible(false)}
        onSuccess={() => {
          setVisible(false);
          tableRef.current?.reload();
        }}
      />
    </>
  )
}

function Config() {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  const [selectRow, setSelectRow] = useState({});
  const [mainVisible, setMainVisible] = useState(false);
  const [mainRow, setMainRow] = useState({})
  const [options, setOptions] = useState([]);
  const loadData = async (rawParams) => {
    const params = {
      name: rawParams.name,
      page: rawParams.current,
      page_size: rawParams.pageSize,
    };
    const result = await getCitizenTypeList(params);
    const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
      id: row.id,
      name: row.name,
      parent_id: row.parent_id,
      created_at: row.created_at,
      list: row.list,
    })) : [];
    setOptions(transformed);
    return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
  };
  const columns: ProColumns = [
    {
      title: '主项分类',
      dataIndex: 'name',
      hideInSearch: false,
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
      width: 180,
      render: (item, record) => (
        <>
          <ButtonAuth type="EDIT">
            <Button
              type="link"
              onClick={() => {
                setMainRow({...record, action: 'modify'});
                setMainVisible(true);
              }}
            >
              编辑
            </Button>
          </ButtonAuth>
          {/*<ButtonAuth type="EDIT">*/}
          {/*<Button*/}
          {/*  type="link"*/}
          {/*  onClick={() => {*/}
          {/*    setSelectRow({...record, action: 'modify'});*/}
          {/*    setVisible(true);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  删除*/}
          {/*</Button>*/}
          {/*</ButtonAuth>*/}
        </>
      ),
    },
  ];
  return (
    <>
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="id"
        search={{
          searchText: '搜索',
        }}
        toolBarRender={() => [
          <ButtonAuth type="CREATE">
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
                setSelectRow({ action: 'create' });
              }}
            >
              + 新建
            </Button>
          </ButtonAuth>
        ]}
        options={false}
        request={loadData}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (<RowList data={record.list} tableRef={actionRef} list={options} />), // dummy
          rowExpandable: (record) => true,
        }}
      />
      <MainModal
        visible={mainVisible}
        context={mainRow}
        onCancel={() => setMainVisible(false)}
        onSuccess={() => {
          setMainVisible(false);
          actionRef.current?.reload();
        }}
      />
      <CreateConfigModal
        visible={visible}
        context={selectRow}
        options={options}
        onCancel={() => setVisible(false)}
        onSuccess={() => {
          setVisible(false);
          actionRef.current?.reload();
        }}
      />
    </>
  )
}
export default Config;
