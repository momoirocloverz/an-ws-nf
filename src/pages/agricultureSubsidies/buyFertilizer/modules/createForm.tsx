import {Form, Modal, Input, DatePicker, InputNumber, Select, message} from "antd";
import React, {useEffect} from "react";
import Moment from "moment";
import { addFormulaFertilizerList, editFormulaFertilizerList } from "@/services/buyFertilizer";

function createForm({ visible, onCancel, onSuccess, context }) {
  useEffect(() => {
    visible && form.resetFields();
  }, [visible])
  const [form] = Form.useForm();
  const cropEnum = ['大小麦', '水稻'];
  const onSubmit = async () => {
    const params = await form.validateFields();
    params['year'] = Moment(params.year).format('YYYY');
    const result = context.id ? await editFormulaFertilizerList({ ...params, id: context.id }) : await addFormulaFertilizerList(params)
    if (result.code === 0) {
      onSuccess();
      message.success(context.id ? '编辑成功' : '创建成功');
    } else {
      message.error(result.msg);
    }
  }

  return (
    <Modal
      visible={visible}
      title={context.id ? '编辑' : '新建'}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{
          ...context,
          year: context.year ? Moment(context.year, 'YYYY') : '',
        }}
      >
        <Form.Item
          label="姓名"
          name="real_name"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="身份证号"
          name="identity"
          rules={[
            { required: true, message: '请填写身份证号' },
            {
              validator: (_, value) =>
                value.length === 15 || value.length === 18
                  ? Promise.resolve()
                  : Promise.reject('请输入正确的身份证号'),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="作物"
          name="crops_name"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Select>
            {cropEnum.map(item => (<Select.Option value={item} key={item}>{item}</Select.Option>))}
          </Select>
        </Form.Item>

        <Form.Item
          label="年份"
          name="year"
          rules={[{ required: true, message: '请选择' }]}
        >
          <DatePicker picker="year" />
        </Form.Item>
        <Form.Item
          label="实名制购肥量/吨"
          name="real_ton"
          rules={[{ required: true, message: '请输入购肥量' }]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default createForm;
