import React, { useRef, useState } from 'react';
import { tableDataHandle } from '@/utils/utils';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, message, Modal,
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { getJobTypes, removeJobType } from '@/services/workManagement';
import ImportBtn from '@/components/buttons/ImportBtn';
import ExportButton from '@/components/agricultureSubsidies/ExportButton';
import JobTypeModal from '@/components/workManagement/JobTypeModal';
import { getMachines, exportMachines } from '@/services/machineManagement';

const machineType = {
  0: '拖拉机机具（默认）',
  1: '深松机',
  2: '旋耕机',
  3: '免耕播种机',
  4: '灭茬机',
  5: '灭茬旋耕机',
  6: '播种机',
  7: '耕地犁',
  8: '稻麦收割机',
  9: '翻转犁',
  10: '打捆机',
  11: '玉米收割机',
  12: '秸秆粉碎还田机',
  13: '深翻犁',
  14: '插秧机',
  15: '植保机',
  16: '穴直播机',
  17: '装载机',
  18: '甘蔗种植机',
  19: '甘蔗收割机',
  20: '中耕机',
  21: '喷药机',
  22: '耙地机',
};

const status = {
  0: '离线',
  1: '在线',
};

function Machines() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [storedParams, setStoredParams] = useState({});
  const tableRef = useRef();
  const loadData = async (rawParams) => {
    const params = {
      group: rawParams.group,
      type: rawParams.type,
      phoneNumber: rawParams.phoneNumber,
      name: rawParams.name,
      number: rawParams.number,
      pageNum: rawParams.current,
      pageSize: rawParams.pageSize,
    };
    try {
      const result = await getMachines(params);
      if (result?.code !== 0) {
        if (result?.code) {
          throw new Error(result.msg);
        }
        // TODO: other errors
        throw new Error('');
      }
      setStoredParams(params);
      const transformed = Array.isArray(result.data.data) ? result.data.data.map((row) => ({
        id: row.id,
        number: row.terminal_code,
        group: row.group_name,
        type: row.machine_type,
        name: row.owner_name,
        phoneNumber: row.owner_phone,
        width: row.tool_width,
        status: row.machine_condition,
        plate: row.plate_number,
      })) : [];
      return tableDataHandle({ ...result, data: { ...(result.data), data: transformed } });
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

  const tableColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '地区分组',
      dataIndex: 'group',
      align: 'center',
    },
    {
      title: '终端编号',
      dataIndex: 'number',
      align: 'center',
    },
    {
      title: '农机类型',
      dataIndex: 'type',
      align: 'center',
      valueEnum: machineType,
    },
    {
      title: '机主姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '机主电话',
      dataIndex: 'phoneNumber',
      align: 'center',
    },
    {
      title: '作业宽幅(米)',
      dataIndex: 'width',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '农机状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: true,
      valueEnum: status,
    },
    {
      title: '农机车牌',
      dataIndex: 'plate',
      align: 'center',
      hideInSearch: true,
    },
    // {
    //   title: '操作',
    //   key: 'actions',
    //   hideInSearch: true,
    //   align: 'center',
    //   render: (item, record) => (
    //     <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
    //       <ButtonAuth type="EDIT">
    //         <Button
    //           type="link"
    //           onClick={() => {
    //             setSelectedRow({ ...record, action: 'modify' });
    //             setIsModalVisible(true);
    //           }}
    //         >
    //           编辑
    //         </Button>
    //       </ButtonAuth>
    //       <ButtonAuth type="DELETE">
    //         <Button
    //           type="link"
    //           onClick={() => {
    //             Modal.confirm({
    //               content: `确认删除${record.name}?`,
    //               icon: <ExclamationCircleOutlined />,
    //               onOk: async () => {
    //                 try {
    //                   await removeJobType(record.id);
    //                   message.success('删除成功!');
    //                   tableRef.current.reload();
    //                 } catch (e) {
    //                   message.error(new Error(`删除失败: ${e.message}!`));
    //                 }
    //               },
    //             });
    //           }}
    //         >
    //           删除
    //         </Button>
    //       </ButtonAuth>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      <ProTable
        actionRef={tableRef}
        request={loadData}
        columns={tableColumns}
        rowKey="id"
        options={false}
        toolBarRender={() => [
          <ButtonAuth type="EXPORT">
            <ExportButton
              func={exportMachines}
              params={storedParams}
              customDownloadObject={{ name: `${new Date().toLocaleString()}农机导出列表.xlsx`, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }}
            />
          </ButtonAuth>,
        ]}
      />
    </>
  );
}

export default Machines;
