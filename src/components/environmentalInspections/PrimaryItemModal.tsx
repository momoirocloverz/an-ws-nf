import React, { useEffect, useState } from 'react';
import {
  Form, Input, message, Modal,
} from 'antd';
import {
  modifyPrimaryInspectionItem,
} from '@/services/environmentalInspections';

type Context = {
  action: 'create' | 'modify';
  id: number;
  name: string;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

export default function PrimaryItemModal({
  context, visible, onCancel, onSuccess,
}: PropType) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    params.id = context.id;
    try {
      // if (context.action === 'create') {
      //   const result = await createInspectionItem(params);
      //   if (result.code === 0) {
      //     message.success('创建成功!');
      //     onSuccess();
      //   } else {
      //     throw new Error(result.msg);
      //   }
      // }
      if (context.action === 'modify') {
        const result = await modifyPrimaryInspectionItem(params);
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
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={800}
      onCancel={onCancel}
      onOk={submit}
      confirmLoading={isSubmitting}
    >
      <Form
        form={form}
        initialValues={{
          name: context.name,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        onValuesChange={(changes) => {
        }}
      >
        <Form.Item
          label="主项名称"
          name="name"
          rules={[{ required: true, message: '请输入主项名称' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
