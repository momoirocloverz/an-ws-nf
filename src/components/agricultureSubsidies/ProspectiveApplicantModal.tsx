import React, { useEffect, useState } from 'react';
import {
  Form, Input, message, Modal, Cascader
} from 'antd';
import { createProspect, modifyProspect } from '@/services/agricultureSubsidies';
import { connect } from 'umi';
import accountInfo from '@/models/user';
import { ConnectState } from '@/models/connect';

type Context = {
  action: 'create' | 'modify';
  id: number;
  name: string,
  phoneNumber: string,
  idNumber: string,
}

type PropType = {
  context: Context | {};
  visible: boolean;
  areaList: any;
  user: any;
  onCancel: ()=>unknown;
  onSuccess: ()=>unknown;
}

const ProspectModal: React.FC<PropType> = (props) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { context, visible, areaList, onCancel, onSuccess, user,isEdit } = props;

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
    if([1, 2, 4].includes(user.role_type)) {
      params.city_id = params.area[0] ?? 0;
      params.town_id = params.area[1] ?? 0;
      params.village_id = params.area[2] ?? 0;
    } else {
      params.city_id = user.city_id;
      params.town_id = user.town_id;
      params.village_id = user.village_id;
    }
    try {
      setIsSubmitting(true);
      if (context.action === 'create') {
        const result = await createProspect(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyProspect(params);
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
      getContainer={false}
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
          phoneNumber: context.mobile,
          idNumber: context.identity,
          area: context.city_id ? [context.city_id, context.town_id, context.village_id] : []
        }}
        labelCol={{ span: 7 }}
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
          label="电话"
          name="phoneNumber"
          rules={[{ required: true, message: '请输入电话号码' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="身份证"
          name="idNumber"
          rules={[{ required: true, message: '请输入身份证' }]}
        >
          <Input />
        </Form.Item>
        {[1, 2, 4].includes(user.role_type) ? (
          <Form.Item
            label="授权地区"
            name="area"
            rules={[{ required: true, message: '请选择授权地区' }]}
          >
            <Cascader disabled={isEdit} options={areaList} placeholder="请选择授权地区" />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
}

export default connect(({ user }: ConnectState) => ({
  user: user.accountInfo
}))(ProspectModal);
