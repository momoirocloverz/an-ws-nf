import React, { useEffect } from 'react';
import {
  DatePicker,
  Form, Input, message, Modal,
} from 'antd';
import moment from 'moment';
import { createPartyMember, modifyPartyMember } from '@/services/myHometown';

type Context = {
  action: 'create' | 'modify';
  id: number;
  name: string;
  phoneNumber: string;
  registrationDate: string;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: ()=>unknown;
  onSuccess: ()=>unknown;
}

function PartyMemberModal({
  context, visible, onCancel, onSuccess,
}:PropType) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  const submit = async () => {
    let params;
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    params.id = context.id;
    try {
      if (context.action === 'create') {
        const result = await createPartyMember(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyPartyMember(params);
        if (result.code === 0) {
          message.success('修改成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
    } catch (e) {
      message.error(`提交失败: ${e.message}`);
    }
  };

  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={800}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form
        form={form}
        initialValues={{
          name: context.name,
          phoneNumber: context.phoneNumber,
          registrationDate: context.registrationDate && (!context.registrationDate.startsWith('0000-') || undefined) && moment(context.registrationDate),
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phoneNumber"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="入党日期"
          name="registrationDate"
          rules={[{
            validator: (rule, value) => {
              if (value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('入党日期为必选项'));
            },
          }]}
          required
        >
          <DatePicker
            picker="date"
            disabledDate={(d) => d > moment()}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PartyMemberModal;
