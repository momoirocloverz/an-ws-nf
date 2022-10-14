import {Form, Input, message, Modal, Radio, Select} from "antd";
import styles from './../index.less'
import {addCitizenTypeList} from "@/services/citizens";
import React, {useEffect, useState} from "react";
type Context = {
  action: 'create' | 'modify';
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

function CreateConfigModal({ options, context, visible, onCancel, onSuccess }: PropType) {
  useEffect(() => {
    if (visible) {
      setType(1);
      form.resetFields();
    }
  }, [visible]);
  const { Option } = Select;
  const [type, setType] = useState(1);
  const [form] = Form.useForm();
  const submit = async () => {
    let params
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    const result = await addCitizenTypeList(params);
    if (result.code === 0) {
      message.success('新建成功');
      onSuccess();
    } else {
      message.error(result.msg);
    }
  };

  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      onOk={submit}
      onCancel={() => onCancel()}
      destroyOnClose
    >
      <Form
        form={form}
        initialValues={{
          type: 1,
          parent_info: context.parent_id,
          name: context.name,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        onValuesChange={(changes) => {
          if ('type' in changes) {
            form.setFieldsValue({ parent_info: '' });
            setType(changes.type);
          }
        }}
      >
        <Form.Item
          label="主项类型"
          name="type"
          rules={[{ required: true, message: '请选择主项类型' }]}
        >
          <Radio.Group disabled={context.action === 'modify'}>
            <Radio value={1}>采用现有</Radio>
            <Radio value={2}>新建主项</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="主项名称"
          name="parent_info"
          rules={[{ required: true, message: '请输入主项名称' }]}
        >
          {type === 1 ?
              <Select disabled={context.action === 'modify'}>
                {
                  options.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            : <Input />}
        </Form.Item>
        <Form.Item
          label="子项名称"
          name="name"
          rules={[{ required: true, message: '请输入子项名称' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default CreateConfigModal;
