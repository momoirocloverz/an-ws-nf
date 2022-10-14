import { Form, Modal, Input, DatePicker, Select, message } from 'antd';
import React, { useEffect } from 'react';
import Moment from 'moment';
import { addCondition, editCondition } from '@/services/buyFertilizer';

const { RangePicker } = DatePicker;
function CreateFormCondition({ visible, onCancel, onSuccess, context }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // eslint-disable-next-line no-use-before-define,@typescript-eslint/no-use-before-define,no-unused-expressions
    visible && form.resetFields();
  }, [visible]);
  const [form] = Form.useForm();
  const cropEnum = ['大小麦', '水稻'];
  const onSubmit = async () => {
    const params = await form.validateFields();
    params.year = Moment(params.year).format('YYYY');
    if (params.time_range.length) {
      // eslint-disable-next-line prefer-destructuring
      params.buy_start_time = Moment(params.time_range[0]).format('YYYY-MM-DD');
      // eslint-disable-next-line prefer-destructuring
      params.buy_end_time = Moment(params.time_range[1]).format('YYYY-MM-DD');
    }
    console.log(context)
    const result = context.id
      ? await editCondition({ ...params, id: context.id })
      : await addCondition(params);
    if (result.code === 0) {
      onSuccess();
      message.success(context.id ? '编辑成功' : '创建成功');
    } else {
      message.error(result.msg);
    }
  };

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
          time_range : context.buy_start_time ? ([
            Moment(context.buy_start_time, 'YYYY-MM-DD'),
            Moment(context.buy_end_time, 'YYYY-MM-DD'),
          ]) : ''
        }}
      >
        <Form.Item
          label="作物"
          name="crops_name"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Select>
            {cropEnum.map((item) => (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="年份" name="year" rules={[{ required: true, message: '请选择' }]}>
          <DatePicker picker="year" />
        </Form.Item>
        <Form.Item label="配方" name="formula" rules={[{ required: true, message: '请输入配方' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="购买时段"
          name="time_range"
          rules={[{ required: true, message: '请选择购买时段' }]}
        >
          <RangePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default CreateFormCondition;
