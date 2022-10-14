import React, { useEffect, useState } from 'react';
import {
  Form, Input, message, Modal, Select
} from "antd";
import { RawUploadedImageType } from '@/pages/agricultureSubsidies/types';
import ImgUpload from '@/components/imgUpload';
import { transformUploadedImageData } from '@/pages/agricultureSubsidies/utils';
import { EditorState } from 'draft-js';
import { createAnnouncement, modifyAnnouncement } from '@/services/agricultureSubsidies';
import WYSIWYGEditor from '../../Editor/Editor';
import PdfUpload from '@/components/pdfUpload';
import { farmCategory, farmTypeOptions } from "@/pages/agricultureSubsidies/consts";

type Context = {
  action: 'create' | 'modify';
  id: number;
  title: string;
  category: number;
  poster: RawUploadedImageType;
  content: string;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

function AnnouncementModal({
  context, visible, onCancel, onSuccess,
}: PropType) {
  const [form] = Form.useForm();
  const [poster, setPoster] = useState(transformUploadedImageData([context.poster]));
  const [initialEditorContent, setInitialEditorContent] = useState('');
  const [currentEditorContent, setCurrentEditorContent] = useState('');
  const [currentEditorState, setCurrentEditorState] = useState<EditorState>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ pdfUrl, setPdfUrl ] = useState<Array<any>>([]);

  useEffect(() => {
    if (visible) {
      setPoster(transformUploadedImageData([context.poster]));
      setInitialEditorContent(context.content ?? '');
      if(context.file_url) {
        let arr = context.file_url.split('/')
        setPdfUrl([
          {
            uid: context.pdf_id,
            url: context.file_url,
            name: arr[arr.length - 1]
          }
        ])
      }
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    form.validateFields(['content']);
  }, [currentEditorState]);
  useEffect(() => {
    form.validateFields(['poster']);
  }, [poster]);

  const submit = async () => {
    let params;
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    params.content = currentEditorContent;
    params.poster = poster?.[0]?.uid;
    params.id = context.id;
    params.pdf_id = pdfUrl?.[0]?.uid;
    try {
      setIsSubmitting(true);
      if (context.action === 'create') {
        const result = await createAnnouncement(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyAnnouncement(params);
        if (result.code === 0) {
          message.success('修改成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
    } catch (e) {
      message.error(`提交失败: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPdfData = (arr = []) => {
    setPdfUrl(arr)
  }

  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={800}
      onCancel={onCancel}
      onOk={submit}
      confirmLoading={isSubmitting}
    >
      <Form
        form={form}
        initialValues={{
          title: context.title,
          category: context.category?.toString(),
          category_id:context.category_id?.toString()
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="政策标题"
          name="title"
          rules={[{ required: true, message: '请输入政策标题' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="政策分类"
          name="category_id"
          rules={[{ required: true, message: '请选择政策分类' }]}
        >
          <Select options={farmCategory}></Select>
        </Form.Item>
        <Form.Item
          label="政策封面"
          name="poster"
          rules={[{
            validator: () => {
              if (poster.length > 0) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('政策封面为必传项'));
            },
          }]}
          required
        >
          <ImgUpload getImgData={(v) => setPoster(v)} values={poster} />
        </Form.Item>
        <Form.Item
          label="政策内容"
          name="content"
          rules={[{
            validator: () => {
              if (currentEditorState?.getCurrentContent().hasText()) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('政策内容为必填项'));
            },
          }]}
          required
        >
          <WYSIWYGEditor
            initialContent={initialEditorContent}
            onChange={(html, state) => {
              setCurrentEditorContent(html);
              setCurrentEditorState(state);
            }}
            // onStateChange={(state)=>setCurrentEditorState(state)}
          />
        </Form.Item>
        <Form.Item
          label="PDF文件"
          name="pdf_url"
        >
          <PdfUpload values={pdfUrl} getPdfData={getPdfData} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AnnouncementModal;
