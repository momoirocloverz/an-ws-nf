/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Form, Input, Select, Tooltip,
} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import GetVerificationCodeButton from '@/components/agricultureSubsidies/GetVerificationCodeButton';
import ImgUpload from '@/components/imgUpload';
import ImgMoreUpload from '@/components/imgMoreUpload';
import { ColProps } from 'antd/lib/grid';
import { SimpleUploadedFileType, SubsidyUser } from '@/pages/agricultureSubsidies/types';
import useBanks from '@/components/agricultureSubsidies/useBanks';

type PropType = {
  initialValues: SubsidyUser;
  disabledFields?: string[];
  onControlledFieldsChange?: (values: {idFront: SimpleUploadedFileType[]; idBack: SimpleUploadedFileType[]; licenses: SimpleUploadedFileType[]}) => unknown; // these values can't be read by antd Form directly
  onChange?: (values: SubsidyUser) => unknown;
  labelCol?: ColProps | undefined;
  wrapperCol?: ColProps | undefined;
  requireVerificationCode?: boolean;
}

function EntityInformation({
  initialValues, disabledFields, onControlledFieldsChange, wrapperCol, labelCol, onChange, requireVerificationCode,
}: PropType) {
  const [__, bankOptions] = useBanks();
  const [ownershipType, setOwnershipType] = useState(initialValues.ownershipType);
  const [contractor, setContractor] = useState(initialValues.contractor);
  const [legalRep, setLegalRep] = useState(initialValues.legalRep);
  const [idNumber, setIdNumber] = useState(initialValues.idNumber);
  const [bankName, setBankName] = useState(initialValues.bankName);
  const [accountNumber, setAccountNumber] = useState(initialValues.accountNumber);
  const [creditUnionCode, setCreditUnionCode] = useState(initialValues.creditUnionCode);
  const [hasResidenceCard, setHasResidenceCard] = useState(initialValues.hasResidenceCard);
  const [phoneNumber, setPhoneNumber] = useState(initialValues.phoneNumber ?? '');
  const [idFront, setIdFront] = useState(initialValues.idFront ?? []);
  const [idBack, setIdBack] = useState(initialValues.idBack ?? []);
  const [stuffImgs, setStuffImgs] = useState(initialValues.stuffImgs ?? []);
  const [licenses, setLicenses] = useState<SimpleUploadedFileType[]>(initialValues.licenses ?? []);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange({
        ownershipType,
        contractor,
        legalRep,
        idNumber,
        bankName,
        accountNumber,
        creditUnionCode,
        hasResidenceCard,
        phoneNumber,
        idFront,
        idBack,
        licenses,
        stuffImgs
      });
    }
  }, [
    ownershipType,
    contractor,
    legalRep,
    idNumber,
    bankName,
    accountNumber,
    creditUnionCode,
    hasResidenceCard,
    phoneNumber,
    idFront,
    idBack,
    licenses,
    stuffImgs
  ]);

  useEffect(() => {
    if (typeof onControlledFieldsChange === 'function') {
      onControlledFieldsChange({ licenses, idFront, idBack, stuffImgs });
    }
  }, [licenses, idBack, idFront, stuffImgs]);

  useEffect(() => {
    setOwnershipType(initialValues.ownershipType);
    setContractor(initialValues.contractor);
    setLegalRep(initialValues.legalRep);
    setIdNumber(initialValues.idNumber);
    setBankName(initialValues.bankName);
    setAccountNumber(initialValues.accountNumber);
    setCreditUnionCode(initialValues.creditUnionCode);
    setHasResidenceCard(initialValues.hasResidenceCard);
    setPhoneNumber(initialValues.phoneNumber ?? '');
    setIdFront(initialValues.idFront ?? []);
    setIdBack(initialValues.idBack ?? []);
    setLicenses(initialValues.licenses ?? []);
    setStuffImgs(initialValues.stuffImgs ?? []);
  }, [initialValues]);

  const   isDisabled = (fieldName) => (disabledFields?.includes(fieldName) ?? false) || (disabledFields?.includes('all') ?? false);

  const individualOwner = () => (
    <>
      <Form.Item
        label="?????????"
        name="contractor"
        rules={[{ required: true, message: '?????????????????????' }]}
        required
      >
        <Input value={contractor} onChange={(e) => setContractor(e.target.value)} disabled={isDisabled('contractor')} />
      </Form.Item>

      <Form.Item
        label="?????????"
        name="idNumber"
        rules={[{ required: true, message: '?????????????????????' }]}
        required
      >
        <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} disabled={isDisabled('idNumber')} />
      </Form.Item>


      <Form.Item
        label="????????????"
        name="bankName"
        rules={[{ required: true, message: '????????????????????????' }]}
        required
      >
        <Select
          value={bankName}
          showSearch
          filterOption={(input, option) => option?.value.includes(input)}
          options={bankOptions}
          onChange={(value) => setBankName(value)}
        />
      </Form.Item>

      <Form.Item
        label="????????????"
        name="accountNumber"
        rules={[{ required: true, message: '????????????????????????' }]}
        required
      >
        <Input
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          addonAfter={(
            <Tooltip title="?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????">
              <ExclamationCircleFilled />
            </Tooltip>
        )}
        />
      </Form.Item>

      <Form.Item
        label="??????"
        name="phoneNumber"
        rules={[{ required: true, message: '??????????????????' }]}
        required
      >
        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={isDisabled('phoneNumber')} />
      </Form.Item>

      {requireVerificationCode ? (
        <Form.Item
          label="?????????"
          name="verificationCode"
          rules={[{ required: true, message: '?????????????????????' }]}
          required
        >
          <Input addonAfter={<GetVerificationCodeButton phoneNumber={phoneNumber} />} />
        </Form.Item>
      ) : null}

      <Form.Item
        label="???????????????"
        name="idFront"
        rules={[{
          validator: () => {
            if (idFront?.length > 0) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('???????????????????????????'));
          },
        }]}
        required
      >
        <ImgUpload values={idFront} getImgData={setIdFront} disabled={isDisabled('idFront')} />
      </Form.Item>
      <Form.Item
        label="???????????????"
        name="idBack"
        rules={[{
          validator: () => {
            if (idBack?.length > 0) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('???????????????????????????'));
          },
        }]}
        required
      >
        <ImgUpload values={idBack} getImgData={setIdBack} disabled={isDisabled('idBack')} />
      </Form.Item>
      <Form.Item
        label="??????????????????"
        name="stuffImgs"
        required={false}
      >
        <ImgUpload values={stuffImgs} getImgData={setStuffImgs} />
      </Form.Item>
    </>
  );
  const corporateOwner = () => (
    <>
      <Form.Item
        label="?????????"
        name="contractor"
        rules={[{ required: true, message: '?????????????????????' }]}
        required
      >
        <Input value={contractor} onChange={(e) => setContractor(e.target.value)} disabled={isDisabled('contractor')} />
      </Form.Item>

      <Form.Item
        label="????????????"
        name="legalRep"
        rules={[{ required: true, message: '????????????????????????' }]}
        required
      >
        <Input value={legalRep} onChange={(e) => setLegalRep(e.target.value)} disabled={isDisabled('legalRep')} />
      </Form.Item>

      <Form.Item
        label="???????????????"
        name="idNumber"
        rules={[{ required: true, message: '?????????????????????' }]}
        required
      >
        <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} disabled={isDisabled('idNumber')} />
      </Form.Item>

      <Form.Item
        label="????????????"
        name="bankName"
        rules={[{ required: true, message: '????????????????????????' }]}
        required
      >
        <Select
          value={bankName}
          showSearch
          filterOption={(input, option) => option?.value.includes(input)}
          options={bankOptions}
          onChange={(value) => setBankName(value)}
        />
      </Form.Item>

      <Form.Item
        label="????????????"
        name="accountNumber"
        rules={[{ required: true, message: '????????????????????????' }]}
        required
      >
        <Input
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          addonAfter={(
            <Tooltip title="?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????">
              <ExclamationCircleFilled />
            </Tooltip>
        )}
        />
      </Form.Item>

      <Form.Item
        label="??????"
        name="phoneNumber"
        rules={[{ required: true, message: '??????????????????' }]}
        required
      >
        <Input
          value={phoneNumber}
          onChange={(v) => setPhoneNumber(v.target.value)}
          disabled={isDisabled('phoneNumber')}
        />
      </Form.Item>

      {requireVerificationCode ? (
        <Form.Item
          label="?????????"
          name="verificationCode"
          rules={[{ required: true, message: '?????????????????????' }]}
          required
        >
          <Input addonAfter={<GetVerificationCodeButton phoneNumber={phoneNumber} />} />
        </Form.Item>
      ) : null}

      <Form.Item
        label="???????????????"
        name="creditUnionCode"
        rules={[{ required: true, message: '???????????????????????????' }]}
        required
      >
        <Input value={creditUnionCode} onChange={(e) => setCreditUnionCode(e.target.value)} disabled={isDisabled('creditUnionCode')} />
      </Form.Item>
      <Form.Item
        label="????????????"
        name="licenses"
        rules={[{
          validator: () => {
            if (licenses?.length > 0) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('????????????????????????'));
          },
        }]}
        required
      >
        <ImgMoreUpload max={5} values={licenses} getImgData={(v) => setLicenses(v)} disabled={isDisabled('licenses')} />
      </Form.Item>
      <Form.Item
        label="??????????????????"
        name="stuffImgs"
        // required
      >
        <ImgUpload values={stuffImgs} getImgData={setStuffImgs} />
      </Form.Item>
    </>
  );

  return (
  // <Form
  //   form={formRef}
  //   initialValues={
  //     initialValues
  //   }
  //   labelCol={labelCol}
  //   wrapperCol={wrapperCol}
  //   className={styles.filingForm}
  //   onValuesChange={(diff, values) => onValueChanged(values)}
  // >
    <>
      <Form.Item
        label="??????????????????"
        name="ownershipType"
        rules={[{ required: true, message: '???????????????????????????' }]}
        required
      >
        <Select value={ownershipType} onChange={(v) => setOwnershipType(v)} disabled={isDisabled('ownershipType')}>
          <Select.Option value={1}>??????</Select.Option>
          <Select.Option value={2}>?????????</Select.Option>
        </Select>
      </Form.Item>
      {ownershipType === 1 ? individualOwner() : null}
      {ownershipType === 2 ? corporateOwner() : null}
    </>
  // </Form>
  );
}

EntityInformation.defaultProps = {
  disabledFields: [],
  wrapperCol: undefined,
  labelCol: undefined,
  onControlledFieldsChange: () => {},
  onChange: () => {},
  requireVerificationCode: true,
};

export { EntityInformation };
