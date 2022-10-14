import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: any;
  masterTypeList: any;
  masterLevel: any;
  areaList: any;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const RejectModal: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, values,} = props;
  const [formValue] = useState({
    expert_id: values.expert_id,
  });

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    handleAdd({
      ...fieldsValue,
      expert_id: formValue.expert_id,
    });
  };


  return (
    <Modal
      width={800}
      maskClosable={false}
      destroyOnClose
      title="提示"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form 
        initialValues={formValue}
        form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="reason"
          label="填写拒绝理由"
          rules={[{ required: true, message: '请输入30字以内的拒绝理由', max: 30 }]}
        >
          <Input.TextArea placeholder="请输入" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ }: ConnectState) => ({
 
}))(RejectModal)