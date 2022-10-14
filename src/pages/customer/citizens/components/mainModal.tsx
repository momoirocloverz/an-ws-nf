import {Form, Input, message, Modal} from "antd";
import React from "react";
import {editCitizenTypeList} from "@/services/citizens";

type Context = {
  action: 'create' | 'modify';
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

function MainModal({ context, visible, onSuccess, onCancel }: PropType) {
  const [form] = Form.useForm();
  const submit = async () => {
    let params
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    const result = await editCitizenTypeList({...params, id: context.id});
    if (result.code === 0) {
      message.success('修改成功');
      onSuccess();
    } else {
      message.error(result.msg);
    };
  }
  return (
    <Modal
      title={'编辑'}
      visible={visible}
      onOk={submit}
      onCancel={() => onCancel()}
      destroyOnClose
    >
      <Form
        form={form}
        initialValues={{
          name: context.name,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default MainModal;
