import React, { useEffect, useState } from 'react';
import {
  Form, Input, message, Modal, Radio, Select,
} from 'antd';
import { createInspectionItem, modifyInspectionItem } from '@/services/environmentalInspections';
import usePrimaryItemCategory from '@/components/environmentalInspections/usePrimaryItemCategory';

type Context = {
  action: 'create' | 'modify';
  id: number;
  name: string;
  type: string | number;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

function ItemModal({
  context, visible, onCancel, onSuccess,
}: PropType) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryType, setPrimaryType] = useState(1);
  const { data: [dict, options] } = usePrimaryItemCategory();

  useEffect(() => {
    if (visible) {
      setPrimaryType(1);
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
      if (context.action === 'create') {
        const result = await createInspectionItem(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyInspectionItem(params);
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
      destroyOnClose
    >
      <Form
        form={form}
        initialValues={{
          primaryCategoryAction: 1,
          primaryCategoryIdentifier: context.main_id,
          name: context.problem_cate,
          type: Math.max([undefined, '加分', '减分'].indexOf(context.just_negative), 0) || undefined,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        onValuesChange={(changes) => {
          if ('primaryCategoryAction' in changes) {
            form.setFieldsValue({ primaryCategoryIdentifier: undefined });
            setPrimaryType(changes.primaryCategoryAction);
          }
        }}
      >
        <Form.Item
          label="主项类型"
          name="primaryCategoryAction"
          rules={[{ required: true, message: '请选择主项类型' }]}
        >
          <Radio.Group disabled={context.action === 'modify'}>
            <Radio value={1}>采用现有</Radio>
            <Radio value={2}>新建主项</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="主项名称"
          name="primaryCategoryIdentifier"
          rules={[{ required: true, message: '请输入主项名称' }]}
        >
          {primaryType === 1 ? <Select options={options} disabled={context.action === 'modify'} /> : <Input />}
        </Form.Item>
        <Form.Item
          label="子项名称"
          name="name"
          rules={[{ required: true, message: '请输入子项名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="加减分"
          name="type"
          rules={[{ required: true, message: '请选择加减分' }]}
        >
          <Radio.Group>
            <Radio value={1}>加分</Radio>
            <Radio value={2}>减分</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ItemModal;
