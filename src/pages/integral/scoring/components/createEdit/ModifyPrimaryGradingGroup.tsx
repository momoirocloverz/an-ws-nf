import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { modifyPrimaryGradingGroup } from '@/services/integral';

function ModifyPrimaryGradingGroup({
  visible, context, onSuccess, onCancel,
}) {
  const [formRef] = Form.useForm();
  if (visible) {
    formRef.setFields([
      { name: 'primaryGroupId', value: context.code },
      { name: 'primaryGroupName', value: context.name },
    ]);
  }
  useEffect(() => {

  }, [visible]);

  const submit = async () => {
    try {
      await formRef.validateFields();
    } catch (e) {
      return;
    }
    try {
      const values = formRef.getFieldsValue();
      const result = await modifyPrimaryGradingGroup(values.primaryGroupId, values.primaryGroupName);
      if (result.code === 0) {
        onSuccess();
      } else {
        throw new Error(result.msg);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      visible={visible}
      title="编辑主编码"
      onCancel={onCancel}
      onOk={() => submit()}
      destroyOnClose
    >
      <Form
        form={formRef}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        initialValues={{
          primaryGroupId: context.code,
          primaryGroupName: context.name,
        }}
      >
        <Form.Item
          name="primaryGroupId"
          label="主编码"
          rules={[{ required: true, message: '请输入主编码' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="primaryGroupName"
          label="主编码名称"
          rules={[{ required: true, message: '请输入主编码名称' }]}
        >
          <Input maxLength={30} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModifyPrimaryGradingGroup;
