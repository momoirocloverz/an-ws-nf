import React, { useEffect, useState } from "react";
import {
  Form, Modal, message, Input
} from "antd";

type ClaimRejectionFormProps = {
  visible: boolean,
  cancelCb?: () => unknown,
  successCb?:any
}

function rejectionModal({ visible, cancelCb, successCb }: ClaimRejectionFormProps) {
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
      getContainer={false}
      onCancel={cancelCb}
      title="驳回理由"
      confirmLoading={submitting}
      forceRender
      onOk={async () => {
        try {
          await formRef.validateFields();
        } catch (e) {
          return;
        }
        try {
          const response = formRef.getFieldValue("response");
          if (typeof successCb === "function") {
            successCb && successCb(response);
          }
        } catch (e) {
          message.error(`驳回失败:${e.message}!`);
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
          label="理由"
          name="response"
          rules={[{ required: true, message: "请输入驳回理由" }, {
            validator: (r, value) => {
              if (!value || (value.length >= 5 && value.length <= 500)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("长度为5-500字符"));
            }
          }]}
          required
        >
          <Input.TextArea maxLength={500} minLength={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default React.memo(rejectionModal);
