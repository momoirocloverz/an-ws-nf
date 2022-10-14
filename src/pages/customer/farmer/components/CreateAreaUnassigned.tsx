import React, { useState, useEffect } from 'react';
import { Form, Modal, Cascader } from 'antd';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  values: any;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  areaList: any;
  accountInfo: any;
}

const CreateAreaUnassigned: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    values,
    areaList,
    accountInfo
  } = props;

  const [formValue, setFormValue] = useState({
    area: (values.city_id === 0 || values.town_id === 0 || values.village_id === 0) ? [] : [values.city_id, values.town_id, values.village_id],
    user_id: values.user_id
  });
  const [areaResult, setAreaResult] = useState([]);

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    fieldsValue.city_id = fieldsValue.area[0];
    fieldsValue.town_id = fieldsValue.area[1];
    fieldsValue.village_id = fieldsValue.area[2];
    delete fieldsValue.area;
    handleAdd({
      ...fieldsValue,
      user_id: formValue.user_id,
    });
  };

  // 获取地址
  const getAreaList = () => {
    let _result: any = [...areaList];
    if (accountInfo.role_type === 4) {
      _result[0].children.forEach((item: any) => {
        if (item.town_id === accountInfo.town_id) {
          _result[0].children = [item];
        }
      })
    }
    setAreaResult(_result);
  }

  useEffect(() => {
    getAreaList();
  }, [])

  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      title='编辑属地'
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form 
        form={form}
        initialValues={formValue}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="属地"
          name="area"
          rules={[{ required: true, message: '请选择属地' }]}
        >
          <Cascader options={areaResult} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  areaList: info.areaList,
  accountInfo: user.accountInfo
}))(CreateAreaUnassigned);
