import {Button, Form, Input, message, Modal, Upload, Cascader} from "antd";
import React, {useEffect, useState} from "react";
import ImgView from "@/components/ImgView";
import {UploadOutlined} from "@ant-design/icons";
import {IMG_UPLOAD_URL} from "@/services/api";
import {getLocalToken} from "@/utils/utils";
import {editCitizenList} from "@/services/citizens";

type Context = {

}

type PropType = {
  category: [];
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
};

function InfoEdit({ category, context, visible, onCancel, onSuccess }: PropType) {
  useEffect(() => {
    form.resetFields();
  }, [visible]);
  const [form] = Form.useForm();
  const submit = async () => {
    let params
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    console.log(params)
    let formPrams = JSON.parse(JSON.stringify(params));
    formPrams.citizen_type_parent = params.citizen[0];
    formPrams.citizen_type = params.citizen[1];
    delete formPrams.citizen;
    const result = await editCitizenList(formPrams);
    if (result.code === 0) {
      message.success('修改成功');
      onSuccess();
    } else {
      message.error(result.msg);
    }
  }
  return (
    <Modal
      title="编辑"
      visible={visible}
      onOk={submit}
      width={800}
      onCancel={() => onCancel()}
    >
      <Form
        form={form}
        initialValues={{
          user_id: context.user_id,
          real_name: context.real_name,
          identity: context.identity,
          mobile: context.mobile,
          city_id: 1,
          citizen: [context.citizen_type_parent, context.citizen_type],
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="用户id"
          name="user_id"
        >
          <span>{ context.user_id }</span>
        </Form.Item>
        <Form.Item
          label="用户姓名"
          name="real_name"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="用户昵称"
        >
          <span>{ context.nickname }</span>
        </Form.Item>
        <Form.Item
          label="手机号"
          name="mobile"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="头像"
        >
          <img src={context.avatar_url} width="100px" height="100px" />
        </Form.Item>
        <Form.Item
          name="city_id"
          label="属地"
        >
          <span>平湖市</span>
        </Form.Item>
        <Form.Item
          label="用户类型"
          name="citizen"
          rules={[{ required: true, message: '请选择' }]}
        >
          <Cascader options={category} fieldNames={{ label: 'name', value: 'id', children: 'list' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default InfoEdit;
