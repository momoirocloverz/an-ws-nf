import React, { useState } from 'react';
import { Form, Input, Modal, Select, message, Radio } from 'antd';
import _ from 'lodash';

const { Option } = Select;
const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  valueEnum: any
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit, onCancel, valueEnum } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addType, setAddType] = useState<number>(1)
  const [formDafult] = useState({ type: 1 })
  
  const okHandle = async () => {
    setConfirmLoading(true)
    const fieldsValue:any = await form.validateFields();
    delete fieldsValue.type // 删除多余类型字段
    if (addType === 1) {
      delete fieldsValue.town_id
    } else {
      delete fieldsValue.town_name
    }
    form.resetFields();
    await onSubmit(fieldsValue);
    setConfirmLoading(false);
  };

  // 改变新建类型
  const changeAddType: any = (val:any) => {
    const data = _.get(val, 'target.value', 1)
    setAddType(data)
  }

  return (
    <Modal
      destroyOnClose
      maskClosable= {false}
      title='新建行政村'
      visible={modalVisible}
      confirmLoading={confirmLoading}
      onOk={okHandle}
      onCancel={() => { onCancel() }}
    >
      <Form form={form} initialValues={formDafult}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="新建类型"
          name="type"
          rules={[{ required: true, message: '请选择新建类型' }]}
        >
          <Radio.Group onChange={changeAddType}>
            <Radio value={1}>新建</Radio>
            <Radio value={2}>已有</Radio>
          </Radio.Group>
        </FormItem>
        {
          addType === 1 ? (
            <Form.Item
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              name="town_name"
              label="乡镇名称"
              rules={[{ required: true, message: '请输入乡镇名称,最长10个字符', max: 10 }]}
              >
                <Input placeholder="请输入乡镇名称,最长10个字符" maxLength={10} />
            </Form.Item>
          ) : (
            <Form.Item
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              name="town_id"
              label="乡镇名称"
              rules={[{ required: true, message: '请选择乡镇' }]}
              >
                <Select
                  placeholder="请选择乡镇"
                  allowClear
                >
                  {Object.keys(valueEnum).map(item => {
                    return <Option value={item} key={item}>{valueEnum[item]}</Option>
                  })}
                </Select>
            </Form.Item>
          )
        }
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="village_name"
          label="村庄名称"
          rules={[{ required: true, message: '请输入行政村名称,最长10个字符', max: 10 }]}
          >
            <Input placeholder="请输入行政村名称,最长10个字符" maxLength={10} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForm;
