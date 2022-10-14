import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Radio, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
// 角色类型
const ROLE_TYPE = [{
  lable: '平台管理员',
  value: 1
},{
  lable: '运营人员',
  value: 2
},{
  lable: '村级信息员',
  value: 3
},{
  lable: '乡镇管理员',
  value: 4
}];

export interface formValueState {
  role_name?: string;
  describe?: string;
  role_id?: number | string;
  role_type?: number | string;
}

interface CreateFormProps {
  value: formValueState;
  modalVisible: boolean;
  isEdit: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, value, isEdit } = props;
  const [formValue] = useState<formValueState>({
    role_name: value.role_name,
    describe: value.describe,
    role_id: value.role_id,
    role_type: value.role_type
  });

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    handleAdd({
      ...fieldsValue,
      isEdit,
      role_id: formValue.role_id,
    });
  };

  const cancleForm = () => {
    form.resetFields();
    onCancel();
  }

  return (
    <Modal
      width={800}
      destroyOnClose
      title={isEdit ? '编辑角色' : '新增角色'}
      visible={modalVisible}
      maskClosable= {false}
      onOk={okHandle}
      onCancel={cancleForm}
    >
      <Form 
        form={form}
        initialValues={formValue}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="角色名称"
          name="role_name"
          rules={[{ required: true, message: '请输入10个字以内的角色名称', max: 10 }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="角色类型"
          name="role_type"
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <Select>
            {
              ROLE_TYPE.map((item, index) => {
                return <Option key={index} value={item.value}>{item.lable}</Option>
              })
            }
          </Select>
        </FormItem> 
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述"
          name="describe"
          rules={[{ required: true, message: '请输入50个字以内的描述信息', max: 50 }]}
        >
          <Input.TextArea placeholder="请输入" />
        </FormItem>  
      </Form>
    </Modal>
  );
};

export default CreateForm;
