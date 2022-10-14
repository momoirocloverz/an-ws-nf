import React, {useEffect, useState} from 'react';
import {
  Form, Input, message, Modal,
} from 'antd';
import { RawUploadedImageType } from '@/pages/agricultureSubsidies/types';
import ImgUpload from '@/components/imgUpload';
import { transformUploadedImageData } from '@/pages/agricultureSubsidies/utils';
import {createHometown, modifyHometown} from "@/services/myHometown";

type Context = {
  action: 'create' | 'modify';
  id: number;
  poster: RawUploadedImageType;
  desc: string;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: ()=>unknown;
  onSuccess: ()=>unknown;
}

function MyHometownModal({
  context, visible, onCancel, onSuccess,
}:PropType) {
  const [form] = Form.useForm();
  const [poster, setPoster] = useState(transformUploadedImageData([context.poster]));

  useEffect(() => {
    if (visible) {
      setPoster(transformUploadedImageData([context.poster]));
      form.resetFields();
    }
  }, [visible]);

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
    params.poster = poster?.[0]?.uid;
    params.id = context.id;
    try {
      if (context.action === 'create') {
        const result = await createHometown(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyHometown(params);
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
          desc: context.desc,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          label="介绍"
          name="desc"
          rules={[{ required: true, message: '请输入介绍' }]}
        >
          <Input.TextArea style={{ minHeight: '100px' }} />
        </Form.Item>

        <Form.Item
          label="封面"
          name="poster"
          rules={[{
            validator: () => {
              if (poster.length > 0) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('封面为必传项'));
            },
          }]}
          required
        >
          <ImgUpload getImgData={(v) => setPoster(v)} values={poster} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MyHometownModal;
