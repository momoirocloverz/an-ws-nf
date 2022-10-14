import React, {
  useEffect, useState
} from "react";
import {
  Form, Modal, Input
} from "antd";
import { viewEntityDetails } from "@/services/agricultureSubsidies";
import { ownershipTypes } from "@/pages/agricultureSubsidies/consts";
import styles from "./detail.less";

type ClaimDetailsModalProps = {
  context: any,
  visible: boolean,
  selectedKey: any,
  cancelCb?: () => unknown,
  successCb?: () => unknown
}

function generateImageGallery(imageList) {
  if (!imageList) return null;
  return (
    <div className={styles.imageContainer}>
      {imageList.map((image) => (
        <a key={image.id} href={image.url} target="_blank" rel="noreferrer">
          <img src={image.url} height={150} className={styles.documentImage} alt="材料图片" />
        </a>
      ))}
    </div>
  );
}

function ClaimDetailsModal({
                             context, visible, cancelCb, successCb, selectedKey
                           }: ClaimDetailsModalProps) {
  const [formRef] = Form.useForm();
  const [formData, setFormData]: any = useState({});

  useEffect(() => {
    if (visible && context.subsidy_id) {
      viewEntityDetails(context.subsidy_id).then((rawResult) => {
        let transformed = {};
        const result = rawResult.data[0];
        // 个人
        if (result.subsidy_type === 1) {
          transformed = {
            ownershipType: result.subsidy_type,
            contractor: result.real_name,
            idNumber: result.identity,
            bankName: result.bank_name,
            accountNumber: result.bank_card_number,
            phoneNumber: result.mobile,
            idPictures: [result.identity_card_front, result.identity_card_back]
          };
        }
        // 公司
        if (result.subsidy_type === 2) {
          transformed = {
            ownershipType: result.subsidy_type,
            contractor: result.real_name,
            legalRep: result.legal_name,
            idNumber: result.identity,
            bankName: result.bank_name,
            accountNumber: result.bank_card_number,
            phoneNumber: result.mobile,
            creditUnionCode: result.credit_num,
            licenses: result.business_license
          };
        }
        setFormData(transformed);
      });
    }
  }, [visible]);

  useEffect(() => {
    formRef?.resetFields();
  }, [formData]);

  const individualOwner = () => (
    <>
      <Form.Item
        label="身份证"
        name="idNumber"
        required
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="开户银行"
        name="bankName"
        required
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="银行账户"
        name="accountNumber"
        required
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="电话"
        name="phoneNumber"
        required
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="身份证"
        required
      >
        {generateImageGallery(formData.idPictures)}
      </Form.Item>
    </>
  );
  const corporateOwner = () => (
    <>
      <Form.Item
        label="法人姓名"
        name="legalRep"
        required
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="身份证"
        name="idNumber"
        required
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="开户银行"
        name="bankName"
        required
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="对公账户"
        name="accountNumber"
        required
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="电话"
        name="phoneNumber"
        required
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="信用社代码"
        name="creditUnionCode"
        required
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        label="营业执照"
        required
      >
        {generateImageGallery(formData.licenses)}
      </Form.Item>

    </>
  );

  const handleSubmit = async () => {
    if (typeof successCb === "function") {
      successCb();
    }
  };
  return (
    <Modal
      visible={visible}
      getContainer={false}
      onCancel={cancelCb}
      title="查看详情"
      width={800}
      footer={false}
      wrapClassName={styles.detailsModalWrapper}
      onOk={handleSubmit}
    >
      <Form
        form={formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12, offset: -4 }}
        initialValues={{
          ...formData,
          ownershipType: ownershipTypes[formData.ownershipType]
        }}
      >
        <Form.Item
          label="补贴对象性质"
          name="ownershipType"
          required
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="承包人"
          name="contractor"
          required
        >
          <Input disabled />
        </Form.Item>
        {formData.ownershipType === 1 ? individualOwner() : null}
        {formData.ownershipType === 2 ? corporateOwner() : null}
      </Form>
    </Modal>
  );
}

ClaimDetailsModal.defaultProps = {
  cancelCb: () => {
  },
  successCb: () => {
  }
};
export default React.memo(ClaimDetailsModal);
