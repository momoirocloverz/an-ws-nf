import React, { useEffect, useState } from 'react';
import {
  Form, Modal, message, Input,
} from 'antd';
import { submitFeedbackResponse } from '@/services/agricultureSubsidies';

type SubsidyStandardFormProps = {
  visible: boolean,
  feedbackId: string | number,
  feedbackContent: string,
  cancelCb?: ()=>unknown,
  successCb?: ()=>unknown
}

function FeedbackResponseForm({
  feedbackId, feedbackContent, visible, cancelCb, successCb,
}: SubsidyStandardFormProps) {
  const [formRef] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      formRef.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onCancel={cancelCb}
      getContainer={false}
      title="回复"
      confirmLoading={submitting}
      forceRender
      onOk={async () => {
        try {
          await formRef.validateFields();
        } catch (e) {
          return;
        }
        try {
          const response = formRef.getFieldValue('response');
          setSubmitting(true);
          await submitFeedbackResponse(feedbackId, response);
          message.success('回复成功!');
          if (typeof successCb === 'function') {
            successCb();
          }
        } catch (e) {
          message.error(`回复失败:${e.message}!`);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form
        form={formRef}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          feedback: feedbackContent,
        }}
      >
        <Form.Item
          label="反馈内容"
          name="feedback"
        >
          <Input.TextArea disabled />
        </Form.Item>
        <Form.Item
          label="回复"
          name="response"
          rules={[{ required: true, message: '请输入回复内容' }, {
            validator: (r, value) => {
              if (!value || (value.length >= 5 && value.length <= 500)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('长度为5-500字符'));
            },
          }]}
          required
        >
          <Input.TextArea maxLength={500} minLength={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

FeedbackResponseForm.defaultProps = {
  cancelCb: () => {},
  successCb: () => {},
};
export default React.memo(FeedbackResponseForm);
