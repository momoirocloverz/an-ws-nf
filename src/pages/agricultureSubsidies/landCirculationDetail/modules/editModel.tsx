import React, {useState, useEffect} from "react";
import {Form, Input, Modal, Button, message, DatePicker} from "antd";
import { history } from "@@/core/history";
import {SimpleUploadedFileType} from "@/pages/agricultureSubsidies/types";
import {transformUploadedImageData} from "@/pages/agricultureSubsidies/utils";
import {editLandCirculationDetail, addLandCirculationDetail} from "@/services/landCirculation";
import Moment from "moment";

type Context = {
  action: 'create' | 'modify';
  id: number;
  parentId: number;
  agreement_number: strng;
  outflow_side: string;
  mobile: string;
  circulation_area: string;
  circulation_at: string;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

function EditModel({ context, visible, onCancel, onSuccess }: PropType) {
  useEffect(() => {
    if (visible) form.resetFields();
  }, [visible]);
  const [form] = Form.useForm();
  const onSubmit = async () => {
    let params
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    params.id = context.id ? context.id : null;
    params.land_circulation_id = context.parentId;
    console.log(params, 'params')
    const result = params.id ? await editLandCirculationDetail(params) : await addLandCirculationDetail(params);
    if (result.code === 0) {
      message.success('提交成功');
      onSuccess()
    } else {
      message.error(result.msg);
    }
  }
  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={600}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Form
        form={form}
        initialValues={{
          agreement_number: context.agreement_number,
          outflow_side: context.outflow_side,
          mobile: context.mobile,
          circulation_area: context.circulation_area,
          circulation_at: Moment(context.circulation_at),
        }}
      >
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="流转协议编号"
          name="agreement_number"
          rules={[{ required: true, message: '请输入' }]}
          >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="流出方"
          name="outflow_side"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input placeholder="请输入"></Input>
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="联系电话"
          name="mobile"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="流转面积"
          name="circulation_area"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input placeholder="请输入" suffix="亩" />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="日期"
          name="circulation_at"
          rules={[{ required: true, message: '请输入日期' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD" picker="date" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default EditModel;
