/* eslint-disable no-unused-vars, camelcase */
/**
 * copy of shit code...
 */
 import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Form, Modal, message, Input, Button, Select, Cascader, List, Spin, InputNumber, Tooltip, DatePicker
} from 'antd';
import ImgMoreUpload from '@/components/imgMoreUpload';
import ImgUpload from '@/components/imgUpload';
import LandSelector from '@/components/agricultureSubsidies/LandSelector';
import {
  editImportDeclare
} from '@/services/agricultureSubsidies';
import { findRegionNames, muToSqMeters, transformUploadedImageData } from '@/pages/agricultureSubsidies/utils';
import Moment from 'moment';
import { CascaderOptionType } from 'antd/es/cascader';
import { CLAIM_FORM_ACTION } from '@/pages/agricultureSubsidies/consts';
import { LoadingOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import GetVerificationCodeButton from '@/components/agricultureSubsidies/GetVerificationCodeButton';
import { SelectValue } from 'antd/es/select';
import _ from 'lodash';
import { EntityInformation } from '@/components/agricultureSubsidies/EntityInformation';
import useCrops from '@/components/agricultureSubsidies/useCrops';
import { LandObjectType, SimpleUploadedFileType } from '@/pages/agricultureSubsidies/types';
import styles from './LandClaimFilingForm.less';

const { Option } = Select;

type ContextObject = {
  id: number;
  contractor: string,
  identity: string,
  cumulativeSize: number
}

type ClaimModificationFormModalProps = {
  context: ContextObject;
  regionTree: CascaderOptionType[];
  categoryTree: CascaderOptionType[];
  visible: boolean;
  cancelCb?: () => unknown;
  successCb?: () => unknown;
}

function ClaimModificationFormModal({
  context, visible, cancelCb, successCb, regionTree, categoryTree,
}: ClaimModificationFormModalProps) {
  const [formRef] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [, cropOptions] = useCrops();
  // images
  const [documents, setDocuments] = useState<SimpleUploadedFileType[]>([]);
  // fields
  const [year, setYear] = useState('');
  const [season, setSeason] = useState('1');
  const [selected, setSelected] = useState<LandObjectType[]>([]);
  const [category, setCategory] = useState<string[] | number[]>([]);
  const [user, setUser] = useState({});
  const [initialized, setInitialized] = useState(false);
  // non-controlled
  const [cumulativeSize, setCumulativeSize] = useState('0');
  const [subsidyStandard, setSubsidyStandard] = useState<number | null>(null);
  const [region, setRegion] = useState<number[]>([]);
  const [trivialFields, setTrivialFields] = useState({});
  const [contractedArea, setContractedArea] = useState(0.1);
  const [defaultValues, ] = useState({
    contractor: context.contractor,
    identity: context.identity,
    cumulativeSize: context.cumulativeSize,
    crops: [Number(context.cropsId)],
    ownershipType: context.ownershipType === 1 ? '个人' : '合作社/公司',
    year:  Moment(context.year, 'YYYY'),
    season: context.season.toString(),
    category: context.categoryPath
  })

  const handleSubmit = async () => {
    try {
      await formRef.validateFields();
    } catch (e) {
      return;
    }
    try {
      const values = formRef.getFieldsValue();
      setSubmitting(true);
      const result = await editImportDeclare({
        ...values,
        year: values.year.year(),
        id: context.id,
        subsidy_id: context.entityId,
        area: context.regionPath
      });
      if (result.code === 0) {
        message.success('编辑成功');
        if (typeof successCb === 'function') {
          successCb();
        }
      } else {
        throw new Error(result.msg);
      }
    } catch (e) {
      message.error(`编辑失败:${e.message}!`);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Modal
      visible={visible}
      onCancel={cancelCb}
      title="编辑申报信息"
      destroyOnClose
      confirmLoading={submitting}
      width={800}
      // forceRender
      onOk={handleSubmit}
    >
          <Form
            form={formRef}
            labelCol={{ span: 6 }}
            className={styles.filingForm}
            wrapperCol={{ span: 12, offset: -4 }}
            initialValues={defaultValues}
          >
            <Form.Item
              label="补贴对象"
              name="contractor"
              required
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="身份证号"
              name="identity"
              required
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="申报面积"
              name="cumulativeSize"
              rules={[{ required: true, message: '申报面积为必填' }]}
              required
            >
              <InputNumber type="number" min={0.1} precision={1} value={contractedArea} onChange={(v) => setContractedArea(v)} />
            </Form.Item>

            <Form.Item
              label="种植作物"
              name="crops"
              rules={[{ required: true, message: '请选择种植作物' }]}
              required
            >
              <Cascader options={cropOptions} />
            </Form.Item>
            <Form.Item
              label="性质"
              name="ownershipType"
              required
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="年份"
              name="year"
              rules={[{ required: true, message: '请选择年份' }]}
              required
            >
              <DatePicker picker="year" allowClear={false} format={'YYYY'} disabled/>
            </Form.Item>
            <Form.Item
              label="季节"
              name="season"
              required
            >
              <Select style={{ width: 120 }} allowClear disabled>
                <Option value="1">春季</Option>
                <Option value="2">秋季</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="补贴项目"
              name="category"
              required
            >
              <Cascader options={categoryTree} disabled />
            </Form.Item>
          </Form>
    </Modal>
  );
}

ClaimModificationFormModal.defaultProps = {
  cancelCb: () => {},
  successCb: () => {},
};
export default memo(ClaimModificationFormModal);
