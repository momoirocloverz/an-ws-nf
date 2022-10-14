import React, { useState, useEffect } from 'react';
import {
  Form,
  Modal,
  message,
  Upload,
  Button,
} from 'antd';
import { IMG_UPLOAD_URL } from '@/services/api';
import { uploadEditorImg } from '@/services/operationCanter';
import { getLocalToken } from '@/utils/utils';
import { UploadOutlined } from '@ant-design/icons';
import { TableList } from '../data.d';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './style.less';
import ImgMoreUpload from '@/components/imgMoreUpload';


const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  typeList: any,
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  values: TableList;
  isEdit: boolean;
}


const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit, onCancel, values, isEdit } = props;
  const [fileList, setFileList] = useState<Array<any>>([]);
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const [formValue, setFormValue] = useState({
    title: values.title,
    doorplate: values.doorplate,
    owner_name: values.owner_name,
    real_name: values.operator_name,
    item_name: values.item_name,
    image: values.image,
    created_at: values.created_at,
    direction: values.direction,
    integral: values.integral
  });

  // 新建|编辑
  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    if (isEdit) {
      fieldsValue['pic_id'] = values['id']
    }
    console.log(fileList,'filelist')

    form.resetFields();
    fieldsValue['image_arr'] = fileList;
    onSubmit(fieldsValue);
  };

  useEffect(() => {
    if (isEdit) {
      const imageList = [...formValue.image]
      const arr = imageList.map((item:any) => {
        return {
          uid: item.id,
          name: '图片',
          status: 'done',
          url: item.url
        }
      })
      setFileList(arr)
      arr.length >= 3 ? setUploadBtnShow(false) : setUploadBtnShow(true);
    } else {
      setUploadBtnShow(true);
    }
  }, []);

  const getImgData = (arr=[]) => {
    setFileList(arr)
  }

  return (
    <Modal
      width={900}
      maskClosable= {false}
      destroyOnClose
      title={isEdit ? '编辑' : '新增'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
        setUploadBtnShow(true);
        setFileList([]);
      }}
    >
      <Form
        form={form}
        initialValues={formValue}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="owner_name"
          label="家庭户主"
        >
          <div>{formValue.owner_name}</div>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="doorplate"
          label="门牌号"
        >
          <div>{formValue.doorplate}</div>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="real_name"
          label="检查人员"
        >
          <div>{formValue.real_name}</div>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="title"
          label="所属小组"
        >
          <div>{formValue.title}</div>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="item_name"
          label="检查项"
        >
          <div>{formValue.item_name}</div>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="integral"
          label="分数"
        >
          <div>{formValue.integral ? (formValue.direction === 'INCREASE' ? '+' + formValue.integral + '分' : '-' + formValue.integral + '分') : ''}</div>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="created_at"
          label="照片上传时间"
        >
          <div>{formValue.created_at}</div>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="cover_image"
          label="上传图片"
        >
          <ImgMoreUpload values={fileList} getImgData={getImgData} max={3} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
