/* eslint-disable no-unused-vars, camelcase */
/**
 * copy of shit code...
 */
import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import {
  Form, Modal, message, Input, Button, Select, Cascader, List, Spin, InputNumber, Tooltip,
} from 'antd';
import ImgMoreUpload from '@/components/imgMoreUpload';
import ImgUpload from '@/components/imgUpload';
import LandSelector from '@/components/agricultureSubsidies/LandSelector';
import {
  getClaimFormDetails,
  getCropList, getSubsidyStandards, verifyBusiness, verifyIndividual, modifyClaim,
} from '@/services/agricultureSubsidies';
import { findRegionNames, muToSqMeters, transformUploadedImageData } from '@/pages/agricultureSubsidies/utils';
import moment, { Moment } from 'moment';
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

type ContextObject = {
  id: number;
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
  const [stuffImgs, setStuffImgs] = useState([]);

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      getClaimFormDetails(context.id).then((result) => {
        if (visible) {
          const initialDisplayData = result.data;
          setStuffImgs(transformUploadedImageData(initialDisplayData?.declare_info?.stuff_images ?? []));
          setUser({
            ownershipType: initialDisplayData?.declare_info?.subsidy_type,
            idNumber: initialDisplayData?.declare_info?.identity,
            contractor: initialDisplayData?.declare_info?.real_name,
            legalRep: initialDisplayData?.declare_info?.legal_name,
            bankName: initialDisplayData?.declare_info?.bank_name,
            accountNumber: initialDisplayData?.declare_info?.bank_card_number,
            creditUnionCode: initialDisplayData?.declare_info?.credit_num,
            hasResidenceCard: initialDisplayData?.declare_info?.is_citizen_card ?? 0,
            phoneNumber: initialDisplayData?.declare_info?.mobile || undefined,
            idFront: transformUploadedImageData(initialDisplayData?.declare_info?.identity_card_front ? [initialDisplayData.declare_info.identity_card_front] : []),
            idBack: transformUploadedImageData(initialDisplayData?.declare_info?.identity_card_back ? [initialDisplayData.declare_info.identity_card_back] : []),
            licenses: transformUploadedImageData(initialDisplayData?.declare_info?.business_license ?? []),
          });
          setYear(initialDisplayData?.declare_info?.year);
          setSeason(initialDisplayData?.declare_info?.season.toString());
          setCategory([initialDisplayData?.declare_info?.scale_parent_id, initialDisplayData?.declare_info?.scale_id]);
          setSelected(initialDisplayData?.area_info ?? []);
          setContractedArea(initialDisplayData?.declare_info.circulation_area ?? 0.1);
          setRegion([initialDisplayData?.declare_info?.city_id, initialDisplayData?.declare_info?.town_id, initialDisplayData?.declare_info?.village_id]);
          setTrivialFields({
            cropType: Number(initialDisplayData?.declare_info?.crops_id),
            cumulativeSize: initialDisplayData?.declare_info?.plot_area,
            cumulativeMetricSize: initialDisplayData?.declare_info?.plot_area_m,
            contractedArea: initialDisplayData?.declare_info?.circulation_area,
            calculatedSubsidy: initialDisplayData?.declare_info?.subsidy_amount,
          });
          setInitialized(true);
          setIsLoading(false);
        }
      });
    } else {
      setInitialized(false);
    }
  }, [visible]);

  useEffect(() => {
    if (initialized) {
      formRef.resetFields();
    }
  }, [initialized]);

  const handleSubmit = async () => {
    try {
      await formRef.validateFields();
    } catch (e) {
      return;
    }
    try {
      const values = formRef.getFieldsValue();
      console.log(values, 'stuffImgs')
      setSubmitting(true);
      const result = await modifyClaim({
        ...values,
        idFront: user.idFront,
        idBack: user.idBack,
        licenses: user.licenses,
        year,
        action: CLAIM_FORM_ACTION.MODIFY,
        id: context.id,
        regionNamePath: findRegionNames(regionTree, region),
        selected,
        stuffImgs: values.stuffImgs?.map((d) => d.uid).join(', ') ?? '',
      });
      if (result.code === 0) {
        message.success('提交修改成功');
        if (typeof successCb === 'function') {
          successCb();
        }
      } else {
        throw new Error(result.msg);
      }
    } catch (e) {
      message.error(`提交失败:${e.message}!`);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const sizeInMu = _.round(selected.reduce((prev, item) => (prev + parseFloat(item.land_areamu)), 0), 1);
    const sizeString = sizeInMu.toString();
    setCumulativeSize(sizeString);
    formRef.setFields([
      { name: 'cumulativeSize', value: sizeString },
      { name: 'cumulativeMetricSize', value: _.round(muToSqMeters(sizeInMu), 1).toString() },
    ]);
  }, [selected]);
  // update form value
  useEffect(() => {
    formRef.setFields([
      { name: 'year', value: year },
    ]);
  }, [year]);
  useEffect(() => {
    formRef.setFields([
      { name: 'season', value: season },
    ]);
  }, [season]);
  // ================ update subsidy ===============================
  const loadSubsidyStandard = () => {
    getSubsidyStandards(year, season, category?.[1], 1, 100).then((result) => {
      // should be only one
      if (result.data.data?.length === 1) {
        setSubsidyStandard(parseFloat(result.data.data[0].standard_price));
      } else {
        setSubsidyStandard(null);
        if (!result.data.data || result.data.data.length === undefined) {
          message.error('获取补贴标准失败');
        } else if (result.data.data.length === 0) {
          message.error('获取到0条补贴标准, 请确认存在对应的补贴标准(年份/季节/补贴项目/种植类目)');
        } else if (result.data.data.length > 1) {
          message.error(`获取到${result.data.data.length}条补贴标准, 请确认只存在唯一对应的补贴标准(年份/季节/补贴项目/种植类目)`);
        } else {
          console.error(`Unknown Error: result = ${JSON.stringify(result, null, '\t')}`);
        }
      }
    });
  };
  useEffect(() => {
    if (year && season && category?.[1] && visible) {
      loadSubsidyStandard();
    }
  }, [year, season, category]);
  // updated subsidy
  useEffect(() => {
    let amount = '未知';
    if (subsidyStandard && (parseFloat(cumulativeSize) > 0)) {
      amount = _.round(subsidyStandard * (_.round(Math.min(contractedArea, parseFloat(cumulativeSize)), 1)), 2).toString();
    }
    formRef.setFields([{ name: 'calculatedSubsidy', value: amount }]);
  }, [cumulativeSize, subsidyStandard, contractedArea]);

  // ================ map modal ===============================
  const onSelectedChange = (v) => {
    setSelected(v);
  };

  const landSelectorContext = useMemo(() => ({
    region,
    season,
    year,
    selected,
    category,
    categoryTree,
    claimId: context.id,
  }), [region, season, year, selected, context]);
  // ===============================================================================================
  return (
    <Modal
      visible={visible}
      onCancel={cancelCb}
      getContainer={false}
      title="申报"
      destroyOnClose
      confirmLoading={submitting}
      width={800}
      // forceRender
      onOk={handleSubmit}
    >
      <Spin spinning={isLoading ?? false} tip="读取中..." indicator={<LoadingOutlined />}>
        { initialized ? (
          <Form
            form={formRef}
            labelCol={{ span: 6 }}
            className={styles.filingForm}
            wrapperCol={{ span: 12, offset: -4 }}
            initialValues={{
              category,
              year,
              season,
              region,
              ...trivialFields,
              ...user,
            }}
          >
            <Form.Item
              label="补贴项目"
              name="category"
              rules={[{ required: true, message: '补贴项目为必填项' }]}
              required
            >
              <Cascader options={categoryTree} onChange={(v) => setCategory(v)} disabled />
            </Form.Item>
            <Form.Item
              label="种植种类"
              name="cropType"
              rules={[{ required: true, message: '种植种类为必填项' }]}
              required
            >
              <Select options={cropOptions} />
            </Form.Item>

            <Form.Item
              label="年份"
              name="year"
              rules={[{ required: true, message: '年份为必填项' }]}
              required
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="季节"
              name="season"
              rules={[{ required: true, message: '季节为必填项' }]}
              required
            >
              <Select disabled>
                <Select.Option value="1">春季</Select.Option>
                <Select.Option value="2">秋季</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="所属地区"
              name="region"
              rules={[{ required: true, message: '所属地区为必填项' }]}
              required
            >
              <Cascader options={regionTree} value={region} disabled />
            </Form.Item>
            {/* TODO: ??????? */}
            <Form.Item
              label="已选地块"
              key="selected"
              rules={[{
                validator: () => {
                  if (selected?.length > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('已选地块为必填项'));
                },
              }]}
              required
            >
              <Button onClick={() => {
                setIsMapModalVisible(true);
              }}>重选地块</Button>
              <List
                dataSource={selected}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${item.village_name}-${item.land_num}-${item.contract_b}`}
                      description={`${_.round(item.land_areamu, 1)}亩`}
                    />
                  </List.Item>
                )}
              />
            </Form.Item>

            <Form.Item
              label="申报面积(亩)"
              name="cumulativeSize"
              required
            >
              <Input type="number" disabled />
            </Form.Item>

            <Form.Item
              label="面积(m²)"
              name="cumulativeMetricSize"
              required
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="承包流转面积(亩)"
              name="contractedArea"
              tooltip="申领的面积如超过了承包流转面积，补贴金额将根据你上传的材料上的面积（即您填写的承包流转面积）进行发放补贴，请认真核对材料"
              rules={[{ required: true, message: '承包流转面积为必填项' },
                // {
                //   validator: (r, v) => {
                //     if (v === undefined || v >= parseFloat(cumulativeSize)) {
                //       return Promise.resolve();
                //     }
                //     return Promise.reject(new Error('您申领的面积超过了承包流转面积，请上传证明材料，并且将承包流转面积改成与材料面积一致再提交，且流转面积需大于或等于申报面积'));
                //   },
                // }
              ]}
              required
            >
              <InputNumber type="number" min={0.1} precision={1} value={contractedArea} onChange={(v) => setContractedArea(v)} />
            </Form.Item>

            <Form.Item
              label="补贴金额(估算)"
              name="calculatedSubsidy"
              rules={[{
                validator: (r, v) => {
                  if (v === '未知') {
                    return Promise.reject(new Error('请确认对应的补贴标准存在，并且选择地块至少包括一个地块'));
                  }
                  return Promise.resolve();
                },
              }]}
              required
            >
              <Input disabled />
            </Form.Item>

            {/* <Form.Item
              label="证明材料上传"
              name="documents"
              rules={[{
                validator: () => {
                  if (documents.length > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('证明材料为必填项'));
                },
              }]}
              required
            >
              <ImgMoreUpload max={10} values={documents} getImgData={(v) => setDocuments(v)} />
            </Form.Item> */}

            <EntityInformation
              initialValues={{...user, stuffImgs: stuffImgs}}
              disabledFields={['all']}
              requireVerificationCode={false}
            />
          </Form>
        ) : <div style={{ height: '400px' }} />}
      </Spin>
      <Modal
        title="地块选择"
        getContainer={false}
        visible={isMapModalVisible}
        // forceRender
        width={800}
        footer={null}
        onCancel={() => setIsMapModalVisible(false)}
      >
        <LandSelector
          visible={isMapModalVisible}
          context={landSelectorContext}
          onSelectedChange={onSelectedChange}
        />
      </Modal>
    </Modal>
  );
}

ClaimModificationFormModal.defaultProps = {
  cancelCb: () => {},
  successCb: () => {},
};
export default memo(ClaimModificationFormModal);
