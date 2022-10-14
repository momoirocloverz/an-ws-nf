import React, { useEffect } from 'react';
import {
  DatePicker,
  Form, Input, message, Modal, Radio,
} from 'antd';
import moment from 'moment';
import { createEvaluationReport, modifyEvaluationReport } from '@/services/partyOrganization';

type Context = {
  action: 'create' | 'modify';
  id: number;
  name: string,
  period: [number, string],
  score: string,
  grade: string,
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: ()=>unknown;
  onSuccess: ()=>unknown;
}

function EvaluationReportModal({
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
        const result = await createEvaluationReport(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyEvaluationReport(params);
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
          year: context.period?.[0] && moment(context.period?.[0], 'YYYY'),
          timespan: context.period?.[1] &&( context.period[1] === '上半年' ? 0 : context.period[1] === '下半年' ? 1 : undefined),
          score: context.score,
          grade: context.grade,
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
          label="年份"
          name="year"
          rules={[{ required: true, message: '请输入年份' }]}
        >
          <DatePicker picker="year" />
        </Form.Item>
        <Form.Item
          label="日期范围"
          name="timespan"
          rules={[{ required: true, message: '请选择范围' }]}
        >
          <Radio.Group>
            <Radio value={0}>上半年</Radio>
            <Radio value={1}>下半年</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="得分"
          name="score"
          rules={[{ required: true, message: '请输入得分' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="档次"
          name="grade"
          rules={[{ required: true, message: '请输入档次' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EvaluationReportModal;
