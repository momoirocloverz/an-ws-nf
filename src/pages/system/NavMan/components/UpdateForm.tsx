import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, } from 'antd';

const FormItem = Form.Item;

export interface formValueState {
  name?: string;
  path?: string;
  icon?: string;
  orderid?: number;
}

interface CreateFormProps {
  value: formValueState;
  title: string; 
  type: string;
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, value, title  } = props;
  const [formValue, setFormValue] = useState<formValueState>({
    name: value.name,
    path: value.path,
    icon: value.icon,
    orderid: value.orderid || 0,
  });

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    handleAdd(fieldsValue);
  };

  const cancleForm = () => {
    form.resetFields();
    onCancel();
  }

  console.log('value  : ', value);

  return (
    <Modal
      width={800}
      destroyOnClose
      title={title}
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
          label="菜单名称"
          name="name"
          rules={[{ required: true, message: '请输入至少10个字符的菜单名称！', max: 10 }]}
        >
          <Input placeholder="请输入菜单名称" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="菜单路由"
          name="path"
          rules={[{ required: true, message: '请输入该页面的路由', }]}
        >
          <Input placeholder="请输入菜单名称" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="图标编码"
          name="icon"
          rules={[
            { required: true, message: '请输入图标编码', type: 'string' },
          ]}
        >
          <Input placeholder="请输入图标字符" />
        </FormItem> 
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="排序"
          name="orderid"
        >
          <Input type="number" placeholder="请输入排序数字" />
        </FormItem>  
      </Form>
    </Modal>
  );
};

export default CreateForm;
