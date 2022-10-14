import React, { useEffect, useState } from 'react';
import {
  Form, Input, message, Modal,
} from 'antd';
import { createPostedItem, modifyPostedItem } from '@/services/agricultureSubsidies';
import WYSIWYGEditor from '@/components/Editor/Editor';
import { EditorState } from 'draft-js';

type Context = {
  action: 'create' | 'modify';
  id: number;
  name: string;
  type: string | number;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  user: object;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

function PostedItemModal({
  context, visible, onCancel, onSuccess, user,
}: PropType) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialEditorContent, setInitialEditorContent] = useState('');
  const [currentEditorContent, setCurrentEditorContent] = useState('');
  const [currentEditorState, setCurrentEditorState] = useState<EditorState>();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setInitialEditorContent(context.content ?? '');
    }
  }, [visible]);

  const submit = async () => {
    let params;
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    setIsSubmitting(true);
    params.id = context.id;
    params.region = [user.city_id, user.town_id, user.village_id];
    params.content = currentEditorContent;
    try {
      if (context.action === 'create') {
        const result = await createPostedItem(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyPostedItem(params);
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
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="名称"
          name="title"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
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
      </Form>
    </Modal>
  );
}

export default PostedItemModal;
