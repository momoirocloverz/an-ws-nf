import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Modal,
  message,
  Select,
  DatePicker,
  Cascader
} from 'antd';
import { uploadEditorImg } from '@/services/operationCanter';
import Moment from 'moment';
import Lodash from 'lodash';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { FormValueType } from '../data.d';
import ImgUpload from '@/components/imgUpload';
import PdfUpload from '@/components/pdfUpload';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import './edit.css';
import { values } from 'lodash';
import _ from 'lodash';
const { Option } = Select;

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  values: any;
  isEdit: boolean;
  editorState: any;
  transformHTML: any;
  accountInfo: any;
  areaList: any;
}

const transformDraftStateToHtml = (editorState:any) => {
  if (!editorState.getCurrentContent) {
    return '';
  }
  return draftToHtml(convertToRaw(editorState.getCurrentContent()));
};

const transformHtmlToDraftState = (html = '') => {
  console.log(html, 'html')
  html = html.replace(/<img/g, '<img style="width:100%;"')
  const blocksFromHtml = htmlToDraft(html);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
  return EditorState.createWithContent(contentState);
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const { modalVisible, onSubmit, onCancel, values, isEdit, accountInfo, areaList } = props;
  const [editorState, setEditorState] = useState<any>(transformHtmlToDraftState(values.content));
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
  const [ pdfUrl, setPdfUrl ] = useState<Array<any>>([]);
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(modalVisible && values.file_url) {
      let arr = values.file_url.split('/')
      setPdfUrl([
        {
          uid: values.pdf_id,
          url: values.file_url,
          name: arr[arr.length - 1]
        }
      ])
    }
  }, [modalVisible])

  const [formValue, setFormValue] = useState({
    title: values.title,
    cover_image: values.cover_image,
    // category_id: values.category_id,
    // category_id: values.parent_category_id === 1 ? [values.parent_category_id, values.category_id] : [values.category_id],
    category_id: values.category_id?.toString() || undefined,
    timed_release: (isEdit && values.timed_release) ? Moment(values.timed_release * 1000) : '',
    area: (values.city_id && values.town_id && values.village_id) ? [values.city_id,values.town_id,values.village_id] : [],
    
  });
  const getText = (str: any) =>  {
    let _str = str.replace(/<[^<>]+>/g, "").replace(/&nbsp;/gi, "");
    return _str.replace(/\s+/g, "");
  }

  // 新建|编辑
  const okHandle = async () => {
    const fieldsValue:any = await form.validateFields();
    if (contentTxtField(editorState)) {
      if (isEdit) {
        fieldsValue['article_id'] = values['article_id']
      }
      fieldsValue.content = transformDraftStateToHtml(editorState);
      if (imgUrl[0]) {
        fieldsValue['cover_image_id'] = imgUrl[0].uid;
      } else {
        fieldsValue['cover_image_id'] = 0;
      }
      if(pdfUrl[0]) {
        fieldsValue['pdf_id'] = pdfUrl[0].uid;
      } else {
        fieldsValue['pdf_id'] = 0;
      }
      if (typeof fieldsValue['timed_release'] === 'object') {
        const time = Moment(fieldsValue['timed_release']).valueOf() / 1000;
        fieldsValue['timed_release'] = Math.floor(time);
      } else if (fieldsValue['timed_release'] === null || fieldsValue['timed_release'] === '') {
        fieldsValue['timed_release'] = 0
      }
      if ((accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) && values.type !== 'article') {
        fieldsValue.city_id = fieldsValue.area[0];
        fieldsValue.town_id = fieldsValue.area[1];
        fieldsValue.village_id = fieldsValue.area[2];
        delete fieldsValue.area;
      } else {
        if(accountInfo.role_type === 2) {
          fieldsValue.city_id = 0;
        }
        fieldsValue.city_id = accountInfo.city_id
        fieldsValue.town_id = accountInfo.town_id
        fieldsValue.village_id = accountInfo.village_id
      }
      onSubmit({
        ...fieldsValue,
        admin_id: accountInfo.admin_id
      });
      form.resetFields();
    }
  };

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
  }

  const contentTxtField = (txt: any) => {
    const _content = transformDraftStateToHtml(editorState);
    const _str = getText(_content);
    const imgIsTrue = _content.indexOf('<img')
    if (Lodash.size(_str) === 0 && imgIsTrue < 0) {
      message.error('请输入文章内容！');
      return _str;
    }
    return true;
  }

  useEffect(() => {
    if (isEdit) {
      if (values.cover_image_id !== 0) {
        setImgUrl([{
          uid: values.cover_image_id,
          name: '图片',
          status: 'done',
          url: values.cover_image
        }]);
      }
      setUploadBtnShow(false);
    } else {
      setUploadBtnShow(true);
    }
  }, []);

  const uploadImageCallBack = (file:any) => new Promise(
    async (resolve, reject) => {
      setLoading(true)
      const _data = await uploadEditorImg({'file': file})
      setLoading(false)
      let _url = ''
      if (_data.code === 0) {
        _url = _data.data && _data.data.url || ''
      }
      resolve({
        data: {
          link: _url
        }
      })
    }
  )

  const getValues = async (e: any) => {
    console.log(e ,' eeee')
  }

  const getImgData = (arr = []) => {
    setImgUrl(arr)
  }

  const getPdfData = (arr = []) => {
    setPdfUrl(arr)
  }

  var typeList
  if(values.type === 'caiwu') {
    typeList = [
      {name: '财务报表', category_id: '7'},
      {name: '重大事项', category_id: '8'},
      {name: '资产资源交易', category_id: '9'},
    ]
  } else {
    typeList = [
      {name: '政策法规', category_id: '2'},
      {name: '行业动态', category_id: '3'}
    ]
  }
  

  return (
    <Modal
      width={900}
      maskClosable= {false}
      destroyOnClose
      title={isEdit ? '编辑文章' : '新增文章'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
        setUploadBtnShow(true);
        setImgUrl([]);
      }}
    >
      <Form
        form={form}
        initialValues={formValue}
      >
        {
          (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) && (values.type !== 'article') ? (
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
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="title"
          label="文章标题"
          rules={[
            {
              required: true,
              message: '请输入30字以内的文章标题',
              max: 30
            }
          ]}
        >
          <Input placeholder="请输入"/>
        </FormItem>
        {
          values.from === 'sanwu' && (values.type === 'caiwu' || values.type === 'article') ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              name="category_id"
              label="文章分类"
              rules={[
                {
                  required: true,
                  message: '请选择文章分类'
                }
              ]}
            >
              {/* <Cascader
                onChange={getValues}
                options={typeList}
                fieldNames={{label: 'name', value: 'category_id'}}
                placeholder="请选择分类"
              /> */}
              <Select
                placeholder="请选择分类"
                onChange={getValues}
                allowClear
              >
                {typeList.length > 0 && typeList.map((item:any, index:number) => {
                  return <Option key={index} value={item.category_id}>{item.name}</Option>
                })}
              </Select>
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="timed_release"
          label="定时发布"
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          name="cover_image"
          label="上传封面"
          rules={[
            {
              required: false,
              message: '请上传封面图'
            }
          ]}
        >
          <ImgUpload values={imgUrl} getImgData={getImgData} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="文章内容"
          name="content"
          required
        >
          <Editor
            editorClassName="demo-editor"
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            localization={{
              locale: 'zh',
            }}
            toolbar={
              {
                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                image: {
                  uploadCallback: uploadImageCallBack,
                  alt: { present: true, previewImage: true },
                  previewImage: true,
                }
              }
            }
          />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="PDF文件"
          name="pdf_url"
        >
          <PdfUpload values={pdfUrl} getPdfData={getPdfData} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(CreateForm);
