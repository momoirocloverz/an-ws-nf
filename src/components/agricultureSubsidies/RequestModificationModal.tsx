import React, { useEffect, useState } from 'react';
import {
  Form, Modal, message, Input,
} from 'antd';
import {requestModification} from '@/services/agricultureSubsidies';

type RequestModificationModalProps = {
  visible: boolean,
  context: object,
  cancelCb?: ()=>unknown,
  successCb?: ()=>unknown
}

function RequestModificationModal({
  context, visible, cancelCb, successCb,
}: RequestModificationModalProps) {
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
      title="申请修改"
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
          if (context.id === undefined) {
            throw new Error('缺少记录ID');
          }
          await requestModification(context.id, response);
          setSubmitting(true);
          message.success('申请修改成功!');
          if (typeof successCb === 'function') {
            successCb();
          }
        } catch (e) {
          message.error(`申请修改失败:${e.message}!`);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form
        form={formRef}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="修改理由"
          name="response"
          rules={[{ required: true, message: '请输入申请修改理由' }, {
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

RequestModificationModal.defaultProps = {
  cancelCb: () => {},
  successCb: () => {},
};
export default React.memo(RequestModificationModal);
