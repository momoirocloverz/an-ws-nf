import React, { useState, useEffect } from 'react';
import {
  Form, Input, Modal, message, Cascader,
} from 'antd';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import Lodash from 'lodash';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import TextArea from 'antd/es/input/TextArea';


const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue) => void;
  onCancel: () => void;
  values: any;
  isEdit: boolean;
  editorState: any;
  transformHTML: any;
  accountInfo: any;
  areaList: any;
  confirmLoading: any;
}

// const transformDraftStateToHtml = (editorState: any) => {
//   if (!editorState.getCurrentContent) {
//     return '';
//   }
//   return draftToHtml(convertToRaw(editorState.getCurrentContent()));
// };
//
// const transformHtmlToDraftState = (html = '') => {
//   const blocksFromHtml = htmlToDraft(html);
//   const { contentBlocks, entityMap } = blocksFromHtml;
//   const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
//   return EditorState.createWithContent(contentState);
// };

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const {
    modalVisible,
    onSubmit,
    onCancel,
    values,
    isEdit,
    accountInfo,
    areaList,
    confirmLoading,
  } = props;
  // const [editorState, setEditorState] = useState<any>(transformHtmlToDraftState(values.comment));
  const [formValue, setFormValue] = useState({
    // title: values.title,
    // content: values.content,
    primaryGroupId: values.p_code,
    primaryGroupName: values.p_name,
    subGroupId: values.s_code,
    subGroupName: values.s_name,
    content: values.comment,
    area:
      values.city_id && values.town_id && values.village_id
        ? [values.city_id, values.town_id, values.village_id]
        : [],
  });

  const getText = (str: any) => {
    const _str = str.replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
    return _str.replace(/\s+/g, '');
  };

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    // if (accountInfo.role_type === 1 || accountInfo.role_type === 2 || accountInfo.role_type === 4) {
    //   fieldsValue.city_id = fieldsValue.area[0];
    //   fieldsValue.town_id = fieldsValue.area[1];
    //   fieldsValue.village_id = fieldsValue.area[2];
    //   delete fieldsValue.area;
    // } else {
    //   fieldsValue.city_id = accountInfo.city_id;
    //   fieldsValue.town_id = accountInfo.town_id;
    //   fieldsValue.village_id = accountInfo.village_id;
    // }
    // if (contentTxtField(editorState)) {
    // if (isEdit) {
    //   fieldsValue.id = values.id;
    // }
    form.resetFields();
    // fieldsValue.content = transformDraftStateToHtml(editorState);
    onSubmit({
      comment: fieldsValue.content,
      item_id: values.item_id,
    });
    // }
  };

  // const onEditorStateChange = (editorState: any) => {
  //   setEditorState(editorState);
  // };

  // const contentTxtField = (txt: any) => {
  //   const _content = transformDraftStateToHtml(editorState);
  //   const _str = getText(_content);
  //   if (Lodash.size(_str) === 0) {
  //     message.error('????????????????????????');
  //   }
  //   // ! ????????????
  //   // if (Lodash.size(_str) > 500) {
  //   //   message.error('????????????????????????500????????????');
  //   //   return false;
  //   // }
  //   return _str;
  // };

  return (
    <Modal
      width={900}
      maskClosable={false}
      destroyOnClose
      title={isEdit ? '????????????' : '????????????'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form
        form={form}
        initialValues={formValue}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        {/* {accountInfo.role_type === 1 */}
        {/* || accountInfo.role_type === 2 */}
        {/* || accountInfo.role_type === 4 ? ( */}
        {/*  <FormItem */}
        {/*    labelCol={{ span: 5 }} */}
        {/*    wrapperCol={{ span: 15 }} */}
        {/*    label="????????????" */}
        {/*    name="area" */}
        {/*    rules={[{ required: true, message: '???????????????' }]} */}
        {/*  > */}
        {/*    <Cascader options={areaList} /> */}
        {/*  </FormItem> */}
        {/*  ) : null} */}
        {/* <FormItem */}
        {/*  labelCol={{ span: 5 }} */}
        {/*  wrapperCol={{ span: 15 }} */}
        {/*  label="????????????" */}
        {/*  name="title" */}
        {/*  rules={[{ required: true, message: '?????????15????????????????????????', max: 15 }]} */}
        {/* > */}
        {/*  <Input placeholder="?????????" /> */}
        {/* </FormItem> */}

        <FormItem
          label="?????????"
          name="primaryGroupId"
          rules={[{ required: true, message: '??????????????????' }]}
          required
        >
          <Input disabled />
        </FormItem>
        <FormItem
          label="????????????"
          name="primaryGroupName"
          rules={[{ required: true, message: '?????????????????????' }]}
          required
        >
          <Input disabled />
        </FormItem>
        <FormItem
          label="?????????"
          name="subGroupId"
          rules={[{ required: true, message: '??????????????????' }]}
          required
        >
          <Input disabled />
        </FormItem>
        <FormItem
          label="????????????"
          name="subGroupName"
          rules={[{ required: true, message: '?????????????????????' }]}
          required
        >
          <Input disabled />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="content"
          rules={[{ required: true, message: '?????????????????????' }]}
          required
        >
          <TextArea maxLength={1000} style={{ minHeight: '200px' }} placeholder="??????????????????????????????1000??????" />
          {/* <Editor */}
          {/*  editorClassName="demo-editor" */}
          {/*  editorState={editorState} */}
          {/*  onEditorStateChange={onEditorStateChange} */}
          {/*  toolbar={{ */}
          {/*    options: [ */}
          {/*      'inline', */}
          {/*      'blockType', */}
          {/*      'fontSize', */}
          {/*      'fontFamily', */}
          {/*      'list', */}
          {/*      'textAlign', */}
          {/*      'colorPicker', */}
          {/*      'history', */}
          {/*    ], */}
          {/*  }} */}
          {/* /> */}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);
