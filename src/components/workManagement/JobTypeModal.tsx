import React, { useEffect, useState } from 'react';
import {
  Form, Input, InputNumber, message, Modal, Radio,
} from 'antd';
import {createJobType, modifyJobType} from "@/services/workManagement";
import {gender} from "@/components/workManagement/JobTypes";

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

function JobTypeModal({
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
      if (context.action === 'create') {
        const result = await createJobType(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyJobType(params);
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
          gender: Object.prototype.hasOwnProperty.call(gender, context.gender) ? context.gender : undefined,
          jobDesc: context.jobDesc,
          rate: context.rate,
          rateDesc: context.rateDesc,
          notes: context.notes,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="工种类型"
          name="name"
          rules={[{ required: true, message: '请输入工种类型' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="性别"
          name="gender"
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Radio.Group>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="工种明细"
          name="jobDesc"
          rules={[{ max: 20, message: '最多20字符' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="单价(元/小时)"
          name="rate"
          rules={[{ required: true, message: '请输入单价' }]}
        >
          <InputNumber min={0} precision={2} />
        </Form.Item>
        <Form.Item
          label="标准明细"
          name="rateDesc"
          rules={[{ required: true, message: '请输入标准明细' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="备注"
          name="notes"
          rules={[{ max: 255, message: '最多255字符' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default JobTypeModal;
