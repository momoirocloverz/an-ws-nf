import React, { useEffect } from 'react';
import {
  DatePicker,
  Form, Input, message, Modal,
} from 'antd';
import moment from 'moment';
import { createAnniversaryEvent, modifyAnniversaryEvent } from '@/services/partyOrganization';

type Context = {
  action: 'create' | 'modify';
  id: number;
  date: string;
  content: string;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: ()=>unknown;
  onSuccess: ()=>unknown;
}

function AnniversaryEventModal({
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
        const result = await createAnniversaryEvent(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyAnniversaryEvent(params);
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
          date: context.date && (!context.date.startsWith('0000-') || undefined) && moment(context.date),
          content: context.content,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="日期"
          name="date"
          rules={[{ required: true, message: '请输入日期' }]}
        >
          <DatePicker picker="date" />
        </Form.Item>
        <Form.Item
          label="事件"
          name="content"
          rules={[{ required: true, message: '请输入事件内容' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AnniversaryEventModal;
