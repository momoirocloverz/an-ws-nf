import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, InputNumber, Upload, message, Button, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { IMG_UPLOAD_URL } from '@/services/api';
import { FormValueType } from '../data.d';
import { getLocalToken } from '@/utils/utils';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

const FormItem = Form.Item;
const { TextArea } = Input;

interface CreateFormProps {
  modalVisible: boolean;
  values: any;
  isEdit: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  accountInfo: any;
  areaList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [imgUrls, setImgUrls] = useState<Array<any>>([]);
  const [uploadBtnShow, setUploadBtnShow] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    isEdit,
    values,
    accountInfo,
    areaList
  } = props;
  const [formValue, setFormValue] = useState({
    product_name: values.product_name,
    product_id: values.product_id,
    integral: values.integral,
    quantity: values.quantity,
    description: values.description,
    process: values.process,
    prompt: values.prompt,
    images: values.image_ids ? values.image_ids.split(',').map((item:any, index:number) => {
      return {
        uid: item,
        name: '图片',
        status: 'done',
        url: values.image_url[index]
      }
    }) : [],
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id,values.town_id,values.village_id] : [],
    family_limit: values.family_limit ? Number(values.family_limit) : '',
    is_add: values.out_at ? 2 : 1
  });

  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    console.log(fieldsValue, 'fieldsValue')
    const imgIds = imgUrls.map(item => {
      return item.uid
    });
    fieldsValue.image_ids = imgIds.join(',');
    if (isEdit) {
      fieldsValue.product_id = formValue.product_id;
    }
    fieldsValue.is_add === 1 ? fieldsValue.is_add = 1 : fieldsValue.is_add = 0
    // if (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) {
    //   fieldsValue.city_id = fieldsValue.area[0];
    //   fieldsValue.town_id = fieldsValue.area[1];
    //   fieldsValue.village_id = fieldsValue.area[2];
    //   delete fieldsValue.area;
    // } else {
      fieldsValue.city_id = accountInfo.city_id
      fieldsValue.town_id = accountInfo.town_id
      fieldsValue.village_id = accountInfo.village_id
    // }
    form.resetFields();
    handleAdd({
      ...fieldsValue,
      admin_id: accountInfo.admin_id
    });
  };

  useEffect(() => {
    if (isEdit) {
      setImgUrls(formValue.images);
    }
  }, [])

  // 上传图片
  const imgUploadProps = {
    action: IMG_UPLOAD_URL(),
    listType: 'picture',
    className: 'upload-list-inline',
    headers: { Authorization: getLocalToken() },
    beforeUpload: (file: any) => {
      setLoading(true);
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式图片!');
        setLoading(false);
      }
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        message.error('图片体积不能超过 50MB!');
        setLoading(false);
      }
      const imgNumLimit = imgUrls.length < 5;
      if (!imgNumLimit) {
        message.error('最多上传5张!');
        setLoading(false);
      }
      return isJpgOrPng && isLt2M && imgNumLimit;
    },
    onSuccess: (res: any) => {
      setLoading(false);
      const _img = res.data;
      const _arr = [...imgUrls];
      _arr.push({
        uid: _img.id,
        name: '图片',
        status: 'done',
        url: _img.url
      })
      setImgUrls(_arr);
      if (imgUrls.length === 4) {
        setUploadBtnShow(false);
      } else {
        setUploadBtnShow(true);
      }
    },
    onRemove: (res: any) => {
      const _img = res || {};
      const _arr = [...imgUrls];
      _arr.forEach((item, index) => {
        if (item.uid === _img.uid) {
          _arr.splice(index, 1);
        }
      });
      setImgUrls(_arr);
      setUploadBtnShow(true);
    }
  }

  return (
    <Modal
      width={900}
      destroyOnClose
      maskClosable= {false}
      title={isEdit ? '编辑商品' : '新建商品'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        form={form}
        initialValues={formValue}
      >
        {/* {
          (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="选择属地"
              name="area"
              rules={[{ required: true, message: '请选择属地' }]}
            >
              <Cascader options={areaList} />
            </FormItem>
          ) : null
        } */}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="商品名称"
          name="product_name"
          rules={[{ required: true, message: '请输入10字以内的商品名称', max: 10 }]}
        >
          <Input placeholder="请输入商品名称" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="商品所需善治分"
          name="integral"
          rules={[{ required: true, message: '请输入0~99999的正整数', max: 99999, min: 0, type: 'number' }]}
        >
          <InputNumber style={{width: '100%'}} placeholder="请输入所需善治分" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="库存"
          name="quantity"
          rules={[{ required: true, message: '请输入0~99999的正整数', max: 99999, min: 0, type: 'number' }]}
        >
          <InputNumber style={{width: '100%'}} placeholder="请输入可兑换数量" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="家庭限制"
          name="family_limit"
          rules={[{ required: true, message: '请输入0~99999的正整数', max: 99999, min: 0, type: 'number' }]}
        >
          <InputNumber style={{width: '100%'}} placeholder="请输入家庭兑换数量限制" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="商品说明"
          name="description"
          rules={[{ required: true, message: '请输入100字以内的商品说明', max: 100 }]}
        >
          <TextArea placeholder="请对商品进行简要描述" rows={4} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="兑换流程"
          name="process"
          rules={[{ required: true, message: '请输入500字以内的商品说明', max: 500 }]}
        >
          <TextArea placeholder="请对商品兑换流程简要描述" rows={4} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="商品兑换温馨提示"
          name="prompt"
          rules={[{ required: true, message: '请输入500字以内的商品说明', max: 500 }]}
        >
          <TextArea placeholder="请对商品兑换温馨提示简要描述" rows={4} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="商品图片"
          name="image_ids"
          required
        >
          <Upload {...imgUploadProps}  fileList={imgUrls}>
            {
              uploadBtnShow ? (
                <Button loading={loading}>
                  <UploadOutlined /> Upload
                </Button>
              ) : null
            }
          </Upload>
        </FormItem>
        {
          formValue.is_add === 2 ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="商品兑换温馨提示"
              name="is_add"
            >
              <Radio.Group>
                <Radio value={1}>上架</Radio>
                <Radio value={2}>下架</Radio>
              </Radio.Group>
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