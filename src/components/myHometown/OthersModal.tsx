import React, { useEffect, useState } from 'react';
import {
  DatePicker,
  Form, Input, InputNumber, message, Modal, Radio,
} from 'antd';
import moment from 'moment';
import {
  createOthers, modifyOthers,
} from '@/services/myHometown';
import { isGruppenfuhrerOptions } from '@/components/myHometown/Gruppenfuhrer';

export default function OthersModal({
  context, visible, onCancel, onSuccess,
}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      if (context.action === 'create') {
        const result = await createOthers(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyOthers(params);
        if (result.code === 0) {
          message.success('修改成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
    } catch (e) {
      message.error(`提交失败: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={600}
      confirmLoading={isLoading}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form
        form={form}
        initialValues={{ ...context, is_leader: context.is_leader && (isGruppenfuhrerOptions.find((o) => o.label === context.is_leader)?.value) }}
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
          label="联系电话"
          name="mobile"
          rules={[{ required: true, message: '请输入联系电话' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="工种"
          name="profession_name"
          rules={[{ required: true, message: '请输入工种名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="备注"
          name="interpret"
        >
          <Input.TextArea autoSize={{ minRows: 5 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
