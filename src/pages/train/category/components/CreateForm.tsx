import React, { useState, useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { FormValueType } from '../data.d';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  values: FormValueType;
  isEdit: boolean;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, values, isEdit } = props;

  const [formValue, setFormValue] = useState({
    title: values.title
  });

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    if (isEdit) {
      fieldsValue.id = values.id;
    }
    form.resetFields();
    handleAdd(fieldsValue);
  };

  return (
    <Modal
      destroyOnClose
      width={800}
      title={isEdit ? '编辑类目' : '新建类目'}
      visible={modalVisible}
      maskClosable= {false}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form 
        form={form}
        initialValues={formValue}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="类目名称"
          name="title"
          rules={[{ required: true, message: '请输入类目名称' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
