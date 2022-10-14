import React, { useEffect, useState } from 'react';
import {
  DatePicker,
  Form, Input, InputNumber, message, Modal, Radio,
} from 'antd';
import moment from 'moment';
import {createGruppenfuhrer, createOverview, modifyGruppenfuhrer, modifyOverview} from '@/services/myHometown';
import ImgUpload from '@/components/imgUpload';
import {isGruppenfuhrerOptions} from "@/components/myHometown/Gruppenfuhrer";

export default function GruppenfuhrerModal({
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
        const result = await createGruppenfuhrer(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyGruppenfuhrer(params);
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
        initialValues={{...context, is_leader: context.is_leader && (isGruppenfuhrerOptions.find(o=>o.label===context.is_leader)?.value) }}
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
          label="组别"
          name="group"
          rules={[{ required: true, message: '请输入组别名称' }]}
        >
          <Input placeholder="格式: 数字+组 (示例: ’10组‘)" />
        </Form.Item>
        <Form.Item
          label="是否时网格长"
          name="is_leader"
          rules={[{ required: true, message: '请选择是否时网格长' }]}
        >
          <Radio.Group options={isGruppenfuhrerOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
