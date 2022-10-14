import React, {useState, useEffect} from "react";
import {Form, Input, Modal, Button, message, Select, InputNumber} from "antd";
import ImgMoreUpload from "@/components/imgMoreUpload";
import {SimpleUploadedFileType} from "@/pages/agricultureSubsidies/types";
import {transformUploadedImageData} from "@/pages/agricultureSubsidies/utils";
import { 
  editAgricultural, 
  addAgricultural 
} from "@/services/agricultureSubsidies";
import { connect } from 'dva';
import PdfUpload from "@/components/pdfUpload";
import { subsidyType } from '../../consts';
const { Option } = Select;

type Context = {
  action: 'create' | 'modify';
  id: number;
  subsidy_object: string;
  identity: string;
  mobile: string;
  // circulation_area: string;
  contract_imgs: any;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  user: any;
  areaList: any;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

const EditModel: React.FC<PropType> = (props) => {
  const { context, visible, onCancel, onSuccess, user, areaList } = props;
  const [ form ] = Form.useForm();
  const [ documents, setDocuments ] = useState<SimpleUploadedFileType[]>([]);
  const [ pdfUrl, setPdfUrl ] = useState<Array<any>>([]);
  const [ initialValues ] = useState({
    name: context.name,
    id_card: context.id_card,
    agricultural_item: context.agricultural_item,
    agricultural_model: context.agricultural_model,
    count: context.count,
    sale_price: context.sale_price,
    central_subsidies: context.central_subsidies,
    provincial_subsidies: context.provincial_subsidies,
    city_subsidies: context.city_subsidies,
    subsidies_amount: context.subsidies_amount,
    subsidies_status: context?.subsidies_status ? context?.subsidies_status.toString() : '2'
  })

  // useEffect(() => {
  //   if (visible) {
  //     form.resetFields();
  //     setDocuments(transformUploadedImageData(context.contract_imgs || []));
  //     // TODO: ⬇⬇⬇
  //     // setPdfUrl(transformUploadedImageData(context.file_id || []));
      
  //     if(context.file_id_url) {
  //       let arr = context.file_id_url.split('/')
  //       setPdfUrl([
  //         {
  //           uid: context.pdf_id,
  //           url: context.file_id_url,
  //           name: arr[arr.length - 1]
  //         }
  //       ])
  //     }
  //   }
  // }, [visible]);
  
  const onSubmit = async () => {
    let params
    try {
      params = await form.validateFields();
      Object.keys(params).forEach((key) => {
        if(params[key] == undefined) {
          params[key] = '';
        }
      })
    } catch (e) {
      return;
    }
    console.log(params, 'formvalue')
    params.id = context.id ? context.id : null;
    // 
    const result = params.id ? await editAgricultural(params) : await addAgricultural(params);
    if (result.code === 0) {
      message.success('提交成功');
      onSuccess()
    } else {
      message.error(result.msg);
    }
  }
  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={600}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Form
        form={form}
        initialValues={initialValues}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: '请输入姓名' }]}
          >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          label="身份证号"
          name="id_card"
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
          <Input placeholder="请填写身份证号"></Input>
        </Form.Item>
        <Form.Item
          label="机具品目"
          name="agricultural_item"
          rules={[{ required: true, message: '请输入机具品目' }]}
        >
          <Input placeholder="请输入机具品目" />
        </Form.Item>
        <Form.Item
          label="机具型号"
          name="agricultural_model"
          rules={[{ required: true, message: '请输入机具型号' }]}
        >
          <Input placeholder="请输入机具型号" />
        </Form.Item>
        <Form.Item
          label="数量"
          name="count"
          rules={[{ 
            validator: (r, value) => {
              if (value === undefined) {
                return Promise.reject(new Error('请输入数量'));
              }
              if (value <= 0 || value > 99999) {
                return Promise.reject(new Error('值域为0-99999'));
              }
              return Promise.resolve();
            },
          }]}
          required
        >
          <Input type="number" placeholder="请输入数量" />
        </Form.Item>
        <Form.Item
          label="销售价格"
          name="sale_price"
          rules={[{
            validator: (r, value) => {
              if (value === undefined) {
                return Promise.reject(new Error('请输入销售价格'));
              }
              if (value <= 0 || value > 99999) {
                return Promise.reject(new Error('值域为0-99999'));
              }
              return Promise.resolve();
            },
          }]}
          required
        >
          <InputNumber precision={2} />
        </Form.Item>
        <Form.Item
          label="中央补贴"
          name="central_subsidies"
          rules={[{ 
            validator: (r, value) => {
              if (value && (value <= 0 || value > 99999)) {
                return Promise.reject(new Error('值域为0-99999'));
              }
              return Promise.resolve();
            },  
          }]}
        >
          <InputNumber precision={2} />
        </Form.Item>
        <Form.Item
          label="省级补贴"
          name="provincial_subsidies"
          rules={[{ 
            validator: (r, value) => {
              if (value && (value <= 0 || value > 99999)) {
                return Promise.reject(new Error('值域为0-99999'));
              }
              return Promise.resolve();
            },
          }]}
        >
          <InputNumber precision={2} />
        </Form.Item>
        <Form.Item
          label="市级补贴"
          name="city_subsidies"
          rules={[{ 
            validator: (r, value) => {
              if (value && (value <= 0 || value > 99999)) {
                return Promise.reject(new Error('值域为0-99999'));
              }
              return Promise.resolve();
            },  
          }]}
        >
          <InputNumber precision={2} />
        </Form.Item>
        <Form.Item
          label="补贴资金总额"
          name="subsidies_amount"
          rules={[{ 
            validator: (r, value) => {
              if (value && (value <= 0 || value > 99999)) {
                return Promise.reject(new Error('值域为0-99999'));
              }
              return Promise.resolve();
            },
          }]}
        >
          <InputNumber precision={2} />
        </Form.Item>
        <Form.Item
          label="补贴状态"
          name="subsidies_status"
          rules={[{ required: true, message: '请选择补贴状态' }]}
        >
          <Select
            placeholder="请选择课程类型"
            disabled={context.action === 'modify' ? true : false}
          >
            {
              Object.keys(subsidyType).map((item: any) => {
                return <Option key={item} value={item}>{subsidyType[item]}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default connect(({ user, info }) => ({
  user: user.accountInfo,
  areaList: info.areaList
}))(EditModel);
