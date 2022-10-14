/* eslint-disable no-unused-vars, camelcase */
/**
 * shit code...
 */
 import React, {
  useEffect, useMemo, useState,
} from 'react';
import {
  Form, message, Input, Select, Cascader, List, InputNumber,
} from 'antd';
import ImgMoreUpload from '@/components/imgMoreUpload';
import {
  getSubsidyStandards,
  getLandCirculationInfo
} from '@/services/agricultureSubsidies';
import { muToSqMeters } from '@/pages/agricultureSubsidies/utils';
import { Moment } from 'moment';
import { CascaderOptionType } from 'antd/es/cascader';
import _ from 'lodash';
import { EntityInformation } from '@/components/agricultureSubsidies/EntityInformation';
import useCrops from '@/components/agricultureSubsidies/useCrops';
import { FormInstance } from 'antd/lib/form';
import { BasicSubsidyUser, LandObjectType, SubsidyUser } from '@/pages/agricultureSubsidies/types';
import styles from './LandClaimFilingForm.less';
import { farmTypeOptions } from '@/pages/agricultureSubsidies/consts';

type ContextObject = {
  categoryTree: CascaderOptionType[];
  selectedLands: LandObjectType[];
  loadingData?: boolean;
  year: Moment;
  season: string;
  region: string[];
  regionNamePath: string[];
  selectedCategory: CascaderOptionType[];
  regionTree: CascaderOptionType[];
}
type PropType = {
  context: ContextObject;
  user: BasicSubsidyUser | SubsidyUser;
  accountInfo: any;
  claimFormRef: FormInstance;
  onControlledFieldsChange?: (values: any) => unknown;
}

function LandClaimFilingForm({
  context, user, accountInfo, claimFormRef, onControlledFieldsChange,
}: PropType) {
  const [, cropSelectOptions] = useCrops();
  // images
  const [documents, setDocuments] = useState([]);
  const [controlledFieldsValues, setControlledFieldsValues] = useState({});
  // fields
  const [year, setYear] = useState(context.year.year());
  const [season, setSeason] = useState(context.season);
  const [category, setCategory] = useState<string[] | number[]>([]);
  const [selected, setSelected] = useState<LandObjectType[]>([]);
  const [cumulativeSize, setCumulativeSize] = useState('0');
  const [subsidyStandard, setSubsidyStandard] = useState<number | null>(null);
  const [contractedArea, setContractedArea] = useState(0);
  const [entityInitialValues, setEntityInitialValue] = useState({});
  const [household_type, setHousholdType] = useState<number>();
  const [stuffImgs, setStuffImgs] = useState([]);

  useEffect(() => {
    console.log(context, 'contextcontext')
    setEntityInitialValue({
      ...user,
      phoneNumber: 'phoneNumber' in user ? user.phoneNumber : undefined,
      hasResidenceCard: 'hasResidenceCard' in user ? user.hasResidenceCard : 0,
    });
    if(user.idNumber) {
      getHousehold(user.idNumber);
    }
  }, [user]);

  // init
  const disabledIdentityFields = useMemo(() => {
    let disabledFields = ['ownershipType'];
    if (user.ownershipType === 1) {
      disabledFields = ['ownershipType', 'contractor', 'idNumber'];
      // @ts-ignore
      if (user.hasResidenceCard) {
        disabledFields.push('accountNumber');
        disabledFields.push('bankName');
      }
      // @ts-ignore
      if (user.phoneNumber) {
        disabledFields = ['all']; // 已填信息
      }
    }
    if (user.ownershipType === 2) {
      disabledFields = ['ownershipType', 'legalRep', 'idNumber'];
      // @ts-ignore
      if (user.hasResidenceCard) {
        disabledFields.push('accountNumber');
        disabledFields.push('bankName');
      }
      // @ts-ignore
      if (user.phoneNumber) {
        disabledFields = ['all']; // 已填信息
      }
    }
    console.log(disabledFields, 'disabledFields')
    return disabledFields;
  }, [user.ownershipType]);

  const getHousehold = async (val) => {
    const result = await getLandCirculationInfo({
      identity: val,
      village_id: accountInfo.village_id
    })
    result.data.subsidy_object ? setHousholdType(1) : setHousholdType(2);
    result?.data?.circulation_area ? setContractedArea(parseInt(result.data.circulation_area, 10)) : setContractedArea(0);
    result?.data?.contract_imgs && result?.data?.contract_imgs.length ? setStuffImgs(result.data.contract_imgs) : setStuffImgs([]);
    claimFormRef.setFieldsValue({
      householdType: result?.data?.subsidy_object ? '1' : '2',
      contractedArea: result?.data?.circulation_area ? parseInt(result.data.circulation_area, 10) : 0
    })
  }

  useEffect(() => {
    claimFormRef.resetFields();
  }, []);

  useEffect(() => {
    if (typeof onControlledFieldsChange === 'function') {
      onControlledFieldsChange({
        ...controlledFieldsValues, documents, selected, regionNamePath: context.regionNamePath,
      });
    }
  }, [controlledFieldsValues, documents, selected, context]);

  // reacting to select
  useEffect(() => {
    console.log(context.selectedCategory, 'selectedCategory')
    setSelected(context.selectedLands);
    setYear(context.year.year());
    setSeason(context.season);
    setCategory(context.season === '1' ? [] : context.categoryRoot)
  }, [context]);

  useEffect(() => {
    const sizeInMu = _.round(selected.reduce((prev, item) => (prev + parseFloat(item.land_areamu)), 0), 1);
    const sizeString = sizeInMu.toString();
    setCumulativeSize(sizeString);
    claimFormRef.setFields([
      { name: 'cumulativeSize', value: sizeString },
      { name: 'cumulativeMetricSize', value: _.round(muToSqMeters(sizeInMu), 1).toString() },
    ]);
  }, [selected]);

  // update form display
  useEffect(() => {
    claimFormRef.setFields([
      { name: 'year', value: context.year.format('YYYY') },
    ]);
  }, [year]);

  useEffect(() => {
    claimFormRef.setFields([
      { name: 'season', value: context.season },
    ]);
  }, [season]);

  // updated subsidy
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
    if (context.year && context.season && category?.[1]) {
      console.log(11111, category?.[1])
      loadSubsidyStandard();
    }
  }, [year, season, category]);

  useEffect(() => {
    console.log(cumulativeSize, subsidyStandard, contractedArea, 'contractedAreacontractedAreacontractedArea')
    let amount = '未知';
    if (subsidyStandard && (parseFloat(cumulativeSize) > 0)) {
      const actualSize = user.ownershipType === 1 && household_type === 2 ? parseFloat(cumulativeSize) : Math.min(contractedArea, parseFloat(cumulativeSize));
      amount = _.round(subsidyStandard * (_.round(actualSize, 1)), 2).toString();
    }
    claimFormRef.setFields([{ name: 'calculatedSubsidy', value: amount }]);
  }, [cumulativeSize, subsidyStandard, contractedArea]);
  // ===============================================================================================
  return (
    <Form
      form={claimFormRef}
      labelCol={{ span: 6 }}
      className={styles.filingForm}
      wrapperCol={{ span: 12, offset: -4 }}
      initialValues={{
        year: context.year.format('YYYY'),
        season: context.season,
        region: context.region,
        cumulativeSize,
        cumulativeMetricSize: muToSqMeters(parseFloat(cumulativeSize)).toString(),
        calculatedSubsidy: '未知',
        contractedArea: contractedArea,
        householdType: household_type,
        category: context.season === '1' ? [] : context.categoryRoot,
        ...user,
      }}
    >
      {/* // disabled={context.season === '2' ? true : false} */}
      <Form.Item
        label="补贴项目"
        name="category"
        rules={[{ required: true, message: '补贴项目为必填项' }]}
        required
      >
        <Cascader options={context.selectedCategory} onChange={(v) => setCategory(v)} disabled={context.season === '2' ? true : false}/>
      </Form.Item>
      <Form.Item
        label='农户类型'
        name="householdType"
        rules={[{required: true, message: '农户类型为必填项'}]}
      >
        <Select disabled options={farmTypeOptions} />
      </Form.Item>
      <Form.Item
        label="种植种类"
        name="cropType"
        rules={[{ required: true, message: '种植种类为必填项' }]}
        required
      >
        <Select
          options={cropSelectOptions}
        />
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
        <Cascader options={context.regionTree} value={context.region} disabled />
      </Form.Item>

      <Form.Item
        label="已选地块"
        name="selected"
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
        {/* <Button onClick={() => { setIsMapModalVisible(true); }}>重选地块</Button> */}
        <List
          dataSource={selected}
          style={{ marginTop: '-6px' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`${item.village_name}-${item.land_num}-${item.contract_b}`}
                description={`${_.round(parseFloat(item.land_areamu), 1)}亩`}
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

      {user.ownershipType === 1 && household_type === 1 && <Form.Item
        label="承包流转面积(亩)"
        name="contractedArea"
        rules={[{ required: true, message: '承包流转面积为必填项' },
          // {
          //   validator: (r, v) => {
          //     if (v === undefined || v >= parseFloat(cumulativeSize)) {
          //       return Promise.resolve();
          //     }
          //     return Promise.reject(new Error('您申领的面积超过了承包流转面积，请上传证明材料，并且将承包流转面积改成与材料面积一致再提交，且流转面积需大于或等于申报面积'));
          //   },
          // },
        ]}
        required
      >
        <InputNumber type="number" disabled/>
      </Form.Item>}

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
        initialValues={{...entityInitialValues, stuffImgs: stuffImgs}}
        disabledFields={disabledIdentityFields}
        onControlledFieldsChange={(v) => setControlledFieldsValues(v)}
        requireVerificationCode
      />
    </Form>
  );
}

LandClaimFilingForm.defaultProps = {
  onControlledFieldsChange: () => {},
};
export default LandClaimFilingForm;
