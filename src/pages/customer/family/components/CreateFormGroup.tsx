import React, { useState, useEffect, } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, Button } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { TableListItem } from '../data.d';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: TableListItem;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  chooseGroupList: any;
  accountInfo: any;
  areaList: any;
}

const CreateFormGroup: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, isEdit, values, accountInfo, areaList } = props;
  const [formValue] = useState({
    leader: values.leader,
    title: values.title,
    group_id: values.group_id,
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id, values.town_id, values.village_id] : [],
  });
  const [ areaResult, setAreaList] = useState([])

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    if (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) {
      fieldsValue.city_id = fieldsValue.area[0];
      fieldsValue.town_id = fieldsValue.area[1];
      fieldsValue.village_id = fieldsValue.area[2];
      delete fieldsValue.area;
    } else {
      fieldsValue.city_id = accountInfo.city_id
      fieldsValue.town_id = accountInfo.town_id
      fieldsValue.village_id = accountInfo.village_id
    }
    handleAdd({
      ...fieldsValue,
      group_id: formValue.group_id,
      isEdit,
      admin_id: accountInfo.admin_id
    });
  };

  // 获取属地列表
  const getAreaList = async () => {
    let _result: any = [...areaList];
    console.log(_result, 'result')
    if (accountInfo.role_type === 4) {
      _result[0].children.forEach((item: any) => {
        if (item.town_id === accountInfo.town_id) {
          _result[0].children = [item];
        }
      })
    }
    setAreaList(_result);
  }

  useEffect(() => {
    getAreaList()
  }, []);

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title={isEdit ? '编辑小组' : '新建小组'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        initialValues={formValue}
        form={form}>
        {
          (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="选择属地"
              name="area"
              rules={[{ required: true, message: '请选择属地' }]}
            >
              <Cascader disabled={isEdit ? true : false} options={areaResult} />
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="小组名称"
          name="title"
          rules={[{ required: true, message: '请输小组名称, 最大长度为15位', max: 15 }]}
        >
          <Input placeholder="请输入用户名" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  chooseGroupList: info.chooseGroupList,
  areaList: info.areaList,
  accountInfo: user.accountInfo
}))(CreateFormGroup);
