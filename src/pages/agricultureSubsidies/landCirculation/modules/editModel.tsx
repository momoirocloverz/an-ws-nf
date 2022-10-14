import React, {useState, useEffect} from "react";
import {Form, Input, Modal, Button, message, Cascader} from "antd";
import ImgMoreUpload from "@/components/imgMoreUpload";
import {SimpleUploadedFileType} from "@/pages/agricultureSubsidies/types";
import {transformUploadedImageData} from "@/pages/agricultureSubsidies/utils";
import {addLandCirculation, editLandCirculation} from "@/services/landCirculation";
import { connect } from 'dva';
import PdfUpload from "@/components/pdfUpload";

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
  const {context, visible, onCancel, onSuccess, user, areaList} = props;
  const [form] = Form.useForm();
  const [documents, setDocuments] = useState<SimpleUploadedFileType[]>([]);
  const [ pdfUrl, setPdfUrl ] = useState<Array<any>>([]);
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setDocuments(transformUploadedImageData(context.contract_imgs || []));
      // TODO: ⬇⬇⬇
      // setPdfUrl(transformUploadedImageData(context.file_id || []));

      if(context.file_id_url) {
        let arr = context.file_id_url.split('/')
        setPdfUrl([
          {
            uid: context.pdf_id,
            url: context.file_id_url,
            name: arr[arr.length - 1]
          }
        ])
      }
    }
  }, [visible]);

  const onSubmit = async () => {
    let params
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    params.id = context.id ? context.id : null;
    if([1, 2, 4].includes(user.role_type)) {
      params.city_id = params.area[0] ?? 0;
      params.town_id = params.area[1] ?? 0;
      params.village_id = params.area[2] ?? 0;
    } else {
      params.city_id = user.city_id;
      params.town_id = user.town_id;
      params.village_id = user.village_id;
    }
    // TODO: ⬇⬇⬇
    console.log(pdfUrl, 'length')
    params.file_id = Array.isArray(pdfUrl) && pdfUrl.length > 0 ? pdfUrl[0].uid : undefined;
    params.contract_imgs = documents?.map((d) => d.uid).join(',') ?? '';
    console.log(params, 'params')
    const result = params.id ? await editLandCirculation(params) : await addLandCirculation(params);
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
        initialValues={{
          subsidy_object: context.subsidy_object,
          identity: context.identity,
          mobile: context.mobile,
          area: context.area
          // circulation_area: context.circulation_area,
        }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        <Form.Item
          label="补贴对象"
          name="subsidy_object"
          rules={[{ required: true, message: '请输入' }]}
          >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="身份证号"
          name="identity"
          rules={[
            { required: true, message: '请填写' },
            {
              validator: (_, value) =>
                value.length === 15 || value.length === 18
                  ? Promise.resolve()
                  : Promise.reject('请输入正确的身份证号'),
            },
          ]}
        >
          <Input placeholder="请填写农户身份证号"></Input>
        </Form.Item>
        <Form.Item
          label="联系电话"
          name="mobile"
          rules={[{ required: true, message: '请输入' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        {/*<Form.Item*/}
        {/*  labelCol={{ span: 5 }}*/}
        {/*  wrapperCol={{ span: 15 }}*/}
        {/*  label="流转面积"*/}
        {/*  name="circulation_area"*/}
        {/*  rules={[{ required: true, message: '请输入' }]}*/}
        {/*>*/}
        {/*  <Input placeholder="请输入" />*/}
        {/*</Form.Item>*/}
        {[1, 2, 4].includes(user.role_type) ? (
          <Form.Item
            label="授权地区"
            name="area"
            rules={[{ required: true, message: '请选择授权地区' }]}
          >
            <Cascader options={areaList} placeholder="请选择授权地区" />
          </Form.Item>
        ) : null}
         <Form.Item
           label="合同照片"
           name="contract_imgs"
           rules={[{
             validator: () => {
               if (documents.length > 0) {
                 return Promise.resolve();
               }
               return Promise.reject(new Error('合同照片为必填项'));
             },
           }]}
           required
         >
           <ImgMoreUpload max={30} values={documents} getImgData={(v) => setDocuments(v)} />
         </Form.Item>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="PDF文件"
          name="pdf_url"
        >
          <PdfUpload
            values={pdfUrl}
            getPdfData={(arr = []) => {
              setPdfUrl(arr)
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default connect(({ user, info }) => ({
  user: user.accountInfo,
  areaList: info.areaList
}))(EditModel);
