import React, { useRef } from 'react';
import {
  Form, Input, Modal, message, Cascader,
} from 'antd';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import Lodash from 'lodash';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import TextArea from 'antd/es/input/TextArea';
import { FormValueType } from '../data.d';
import ButtonAuth from '@/components/ButtonAuth';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from '../data.d';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import {
  integralRuleList,
  addIntegralRule,
  editIntegralRule,
  deletIntegralRule,
} from '@/services/integral';

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue) => void;
  onCancel: () => void;
  values: any;
  isEdit: boolean;
  editorState: any;
  transformHTML: any;
  accountInfo: any;
  areaList: any;
  confirmLoading: any;
}

const VillageList: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const {
    modalVisible,
    onCancel,
    onSubmit,
    values,
    isEdit,
    accountInfo,
    areaList,
    confirmLoading,
  } = props;
  const actionRef = useRef<ActionType>();

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    // if (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) {
    //   fieldsValue.city_id = fieldsValue.area[0];
    //   fieldsValue.town_id = fieldsValue.area[1];
    //   fieldsValue.village_id = fieldsValue.area[2];
    //   delete fieldsValue.area;
    // } else {
    //   fieldsValue.city_id = accountInfo.city_id;
    //   fieldsValue.town_id = accountInfo.town_id;
    //   fieldsValue.village_id = accountInfo.village_id;
    // }
    // if (contentTxtField(editorState)) {
    // if (isEdit) {
    //   fieldsValue.id = values.id;
    // }
    form.resetFields();
    // fieldsValue.content = transformDraftStateToHtml(editorState);
    onSubmit({
      comment: fieldsValue.content,
      item_id: values.item_id,
    });
    // }
  };
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '主编码',
      dataIndex: 'p_code',
      hideInSearch: true,
    },
    {
      title: '主项名称',
      dataIndex: 'p_name',
    },
    {
      title: '子项编码',
      dataIndex: 's_code',
      hideInSearch: true,
    },
    {
      title: '子项名称',
      dataIndex: 's_name',
    },
    {
      title: '打分项规则内容',
      dataIndex: 'comment',
      hideInSearch: true,
      render: (item, record:any) => {
        return (
          <div>{record.comment}</div>
        )
      },
      width: 400,
      ellipsis: true,
    },
    // {
    //   title: '所属地区',
    //   dataIndex: 'area',
    //   hideInSearch: true
    // }
  ];

  const getIntegralList = async (val: any) => {
    console.log(values, 'valuesssss')
    val.city_id = values.city_id;
    val.town_id = values.town_id;
    val.village_id = values.village_id;
    val.info = '1';
    const valObj = { ...val };
    const _params = paginationHandle(valObj);
    const _data = await integralRuleList(_params);
    return tableDataHandle(_data);
  };

  return (
    <Modal
      width={900}
      maskClosable={false}
      destroyOnClose
      title='善治分细则'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        options={false}
        search={{
          searchText: '搜索',
        }}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default',
        }}
        // toolBarRender={(action, { selectedRows }) => [
        //   <ButtonAuth type="CREATE">
        //     <Button
        //       icon={<PlusOutlined />}
        //       type="primary"
        //       onClick={() => {
        //         handleModalVisible(true);
        //         setIsEdit(false);
        //       }}
        //     >
        //       新建
        //     </Button>
        //   </ButtonAuth>,
        // ]}
        toolBarRender={false}
        tableAlertRender={false}
        request={(params) => getIntegralList(params)}
        columns={columns}
      />
    </Modal>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  chooseGroupList: info.chooseGroupList,
  accountInfo: user.accountInfo,
  roleAreaList: info.roleAreaList,
}))(VillageList);
