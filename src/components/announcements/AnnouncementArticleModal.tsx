import React, { useEffect, useMemo, useState } from 'react';
import {
  Cascader,
  Form, Input, message, Modal, Select,
} from 'antd';
import { RawUploadedImageType } from '@/pages/agricultureSubsidies/types';
import ImgUpload from '@/components/imgUpload';
import { transformUploadedImageData } from '@/pages/agricultureSubsidies/utils';
import { EditorState } from 'draft-js';
import { AnnouncementCategories } from '@/pages/announcements/consts';
import { CascaderOptionType } from 'antd/es/cascader';
import { createAnnouncement, modifyAnnouncement } from '@/services/announcements';
import WYSIWYGEditor from '../Editor/Editor';
import PdfUpload from '@/components/pdfUpload';
import { formatArea } from "@/utils/utils";

type Context = {
  action: 'create' | 'modify';
  id: number;
  title: string;
  category: number;
  poster: RawUploadedImageType;
  region: number[];
  content: string;
}
type AuthorizationType = {
  isVillageOfficial: boolean;
  isTownOfficial: boolean;
  isCityOfficial: boolean;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: ()=>unknown;
  onSuccess: ()=>unknown;
  regionTree: CascaderOptionType[],
  authorizations: AuthorizationType
}

function AnnouncementArticleModal({
  context, visible, onCancel, onSuccess, regionTree, authorizations,
}:PropType) {
  const [form] = Form.useForm();
  const [poster, setPoster] = useState(transformUploadedImageData([context.poster]));
  const [initialEditorContent, setInitialEditorContent] = useState('');
  const [currentEditorContent, setCurrentEditorContent] = useState('');
  const [ pdfUrl, setPdfUrl ] = useState<Array<any>>([]);
  const [currentEditorState, setCurrentEditorState] = useState<EditorState>();
  const categoryOptions = useMemo(() => Object.entries(AnnouncementCategories).map(([k, v]) => ({ label: v, value: k })), []);
  useEffect(() => {
    if (visible) {
      setPoster(transformUploadedImageData([context.poster]));
      setInitialEditorContent(context.content ?? '');
      form.resetFields();
    }
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
    }
  };

  const getPdfData = (arr = []) => {
    console.log(arr, 'arr')
    setPdfUrl(arr)
  }

  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={800}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form
        form={form}
        initialValues={{
          title: context.title,
          category: context.category?.toString(),
          region: formatArea(context.region),
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="地区"
          name="region"
          required
        >
          <Cascader options={regionTree} changeOnSelect disabled={!authorizations.isCityOfficial} />
        </Form.Item>
        <Form.Item
          label="文章标题"
          name="title"
          rules={[{ required: true, message: '请输入文章标题' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select
            options={categoryOptions}
          />
        </Form.Item>
        <Form.Item
          label="上传封面"
          name="poster"
          rules={[{
            validator: () => {
              if (poster.length > 0) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('上传封面为必传项'));
            },
          }]}
          required
        >
          <ImgUpload getImgData={(v) => setPoster(v)} values={poster} />
        </Form.Item>
        <Form.Item
          label="文章内容"
          name="content"
          rules={[{
            validator: () => {
              if (currentEditorState?.getCurrentContent().hasText()) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('文章内容为必填项'));
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

export default AnnouncementArticleModal;
