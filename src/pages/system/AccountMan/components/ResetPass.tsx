import React, { useState } from 'react';
import { Form, Input, Modal, } from 'antd';
import {validatePassword} from "@/utils/utils";

const FormItem = Form.Item;
interface CreateFormProps {
  modalVisible: boolean;
  adminId: number | string;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const ResetPass: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, adminId } = props;

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    handleAdd({
      ...fieldsValue,
      adminId,
    });
    form.resetFields();
  };

  return (
    <Modal
      width={800}
      destroyOnClose
      maskClosable= {false}
      title="重置密码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="password"
          label="新密码"
          required
          rules={[{ validator: (r, v) => {
            return validatePassword(v);
          }}]}
        >
          <Input.Password placeholder="请输入密码" />
        </FormItem>
        <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            name="confirm"
            label="再次输入密码"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: '请再次输入密码',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('您两次输入的密码不匹配');
                },
              }),
            ]}
          >
          <Input.Password placeholder="请再次输入密码" autoComplete="new-password" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default ResetPass;
