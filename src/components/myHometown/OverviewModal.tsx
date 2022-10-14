import React, { useEffect, useState } from 'react';
import {
  DatePicker,
  Form, Input, InputNumber, message, Modal,
} from 'antd';
import moment from 'moment';
import { createOverview, modifyOverview } from '@/services/myHometown';
import ImgUpload from '@/components/imgUpload';

export default function OverviewModal({
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
    params.image = params.image.map(p=>p.uid).join(',');
    setIsLoading(true);
    try {
      if (context.action === 'create') {
        const result = await createOverview(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyOverview(params);
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
        initialValues={{
          ...context,
          area_covered: context.area_covered && parseFloat(context.area_covered),
          total_population: context.total_population && parseInt(context.total_population, 10),
          total_households: context.total_households && parseInt(context.total_households, 10),
          group: context.group && parseInt(context.group, 10),
          party_member_people: context.party_member_people && parseInt(context.party_member_people, 10),
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="占地面积"
          name="area_covered"
          rules={[{ required: true, message: '请输入占地面积' }]}
        >
          <InputNumber
            min={0}
            precision={2}
            style={{ width: '200px' }}
            formatter={(value) => (`${value}亩`)}
          />
        </Form.Item>
        <Form.Item
          label="总人口"
          name="total_population"
          getValueProps={(v) => ({ value: v && parseInt(v, 10) })}
          rules={[{ required: true, message: '请输入总人口' }]}
        >
          <InputNumber
            min={0}
            precision={0}
            style={{ width: '200px' }}
            formatter={(value) => (`${value}人`)}
          />
        </Form.Item>
        <Form.Item
          label="总户数"
          name="total_households"
          getValueProps={(v) => ({ value: v && parseInt(v, 10) })}
          rules={[{ required: true, message: '请输入总户数' }]}
        >
          <InputNumber
            min={0}
            precision={0}
            style={{ width: '200px' }}
            formatter={(value) => (`${value}户`)}
          />
        </Form.Item>
        <Form.Item
          label="组别"
          name="group"
          getValueProps={(v) => ({ value: v && parseInt(v, 10) })}
          rules={[{ required: true, message: '请输入组别' }]}
        >
          <InputNumber
            min={0}
            precision={0}
            style={{ width: '200px' }}
            formatter={(value) => (`${value}组`)}
          />
        </Form.Item>
        <Form.Item
          label="党员人数"
          name="party_member_people"
          getValueProps={(v) => ({ value: v && parseInt(v, 10) })}
          rules={[{ required: true, message: '请输入党员人数' }]}
        >
          <InputNumber
            min={0}
            precision={0}
            style={{ width: '200px' }}
            formatter={(value) => (`${value}人`)}
          />
        </Form.Item>
        <Form.Item
          label="村级工作特色及荣誉"
          name="characteristic_honor"
          rules={[{ required: true, message: '请输入工作计划' }]}
        >
          <Input.TextArea maxLength={150} showCount autoSize={{ minRows: 5 }} />
        </Form.Item>
        <Form.Item
          label="图片"
          name="image"
          getValueProps={(v) => ({ values: v || [] })}
          rules={[{ required: true, message: '请上传图片' }]}
        >
          <ImgUpload getImgData={() => {}} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
