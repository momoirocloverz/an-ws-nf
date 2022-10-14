import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, Select, Upload, Button } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: any;
  familyList:any;
  dispatch: Dispatch;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const CreateFormUnassigned: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit: handleAdd, onCancel, isEdit, values } = props;

  const { dispatch, familyList } = props;

  const [formValue, setFormValue] = useState({
    user_id: values.user_id,
    family_id: values.family_id,
  });

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    handleAdd({
      ...fieldsValue,
      user_id: formValue.user_id,
      family_id: formValue.family_id
    });
  };

  useEffect(() => {
    dispatch({
      type: 'info/queryFamilyList',
    });
  }, []);

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title={isEdit?'编辑家庭':'新建家庭'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form 
        form={form}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="选择家庭"
          name="family_id"
          rules={[{ required: true, message: '请选择家庭' }]}
        >
          <Select>
            {
              familyList.map((item: any) => {
                return (<Option key={item.family_id} value={item.family_id}>{item.owner_name}</Option>)
              })
            }
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, }: ConnectState) => ({
  familyList: info.familyList
}))(CreateFormUnassigned);
