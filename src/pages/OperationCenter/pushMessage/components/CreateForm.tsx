import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Cascader, message } from 'antd';
import Moment from 'moment'
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

const { TextArea } = Input;
const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  values: any;
  isEdit: boolean;
  accountInfo: any;
  areaList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit, onCancel, values, isEdit, accountInfo, areaList } = props;
  const [bannerLink, setBannerLink] = useState(0);
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showCount, setShowCount] = useState<number>(0);
  const [formValue, setFormValue] = useState({
    // name: values.name,
    // icon_image: values.icon_image,
    // created_at: isEdit ? Moment(values.created_at) : '',
    // jump_value: values.jump_value,
    // jump_type: values.jump_type || 0,
    // image_id: values.icon || 0,
    // sort: values.sort,
    // is_show: values.is_show,
    title: values.title,
    content: values.content,
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id,values.town_id,values.village_id] : []
  });

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    if (accountInfo.role_type !== 3) {
      fieldsValue.city_id = fieldsValue.area[0] ? fieldsValue.area[0] : 0
      fieldsValue.town_id = fieldsValue.area[1] ? fieldsValue.area[1] : 0
      fieldsValue.village_id = fieldsValue.area[2] ? fieldsValue.area[2] : 0
      delete fieldsValue.area;
    } else {
      fieldsValue.city_id = accountInfo.city_id
      fieldsValue.town_id = accountInfo.town_id
      fieldsValue.village_id = accountInfo.village_id
    }
    if(isEdit) {
      fieldsValue.id = values.id
    }
    form.resetFields();
    onSubmit({
      ...fieldsValue, 
      admin_id: accountInfo.admin_id
    });
  };

  const onLinkChange = (val: number) => {
    setBannerLink(val)
    form.setFieldsValue({
      jump_value: ''
    })
  }

  const getImgData = (arr=[]) => {
    setImgUrl(arr)
  }

  useEffect(() => {
    if (isEdit) {
      setBannerLink(values.jump_type);
      setImgUrl([{
        uid: values.icon,
        name: '图片',
        status: 'done',
        url: values.icon_image
      }]);
      setUploadBtnShow(false);
    } else {
      setUploadBtnShow(true);
    }
  }, []);

  return (
    <Modal
      destroyOnClose
      maskClosable= {false}
      title={isEdit ? '编辑推送消息' : '新建推送消息'}
      visible={modalVisible}
      width={'50%'}
      confirmLoading={confirmLoading}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        form={form}
        initialValues={formValue}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="消息标题"
          name="title"
          rules={[{ required: true, message: '请输入30字以内的名称', max: 30 }]}
        >
          <Input placeholder="请输入标题" allowClear />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="消息内容"
          name="content"
          rules={[{ required: true, message: '请输入200字以内的名称', max: 200 }]}
        >
          <TextArea placeholder="请输入内容" rows={4} allowClear />
        </FormItem>
        {
          (accountInfo.role_type !== 3) ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="选择属地"
              name="area"
              rules={[{ required: true, message: '请选择属地' }]}
            >
              <Cascader options={areaList} changeOnSelect/>
            </FormItem>
          ) : null
        }
      </Form>
    </Modal>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(CreateForm);