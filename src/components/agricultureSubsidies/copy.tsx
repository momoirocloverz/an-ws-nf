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
        disabledFields = ['all']; // ????????????
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
        disabledFields = ['all']; // ????????????
      }
    }

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
          message.error('????????????????????????');
        } else if (result.data.data.length === 0) {
          message.error('?????????0???????????????, ????????????????????????????????????(??????/??????/????????????/????????????)');
        } else if (result.data.data.length > 1) {
          message.error(`?????????${result.data.data.length}???????????????, ?????????????????????????????????????????????(??????/??????/????????????/????????????)`);
        } else {
          console.error(`Unknown Error: result = ${JSON.stringify(result, null, '\t')}`);
        }
      }
    });
  };
  useEffect(() => {
    if (context.year && context.season && category?.[1]) {
      loadSubsidyStandard();
    }
  }, [year, season, category]);

  useEffect(() => {
    let amount = '??????';
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
        calculatedSubsidy: '??????',
        contractedArea: contractedArea,
        householdType: household_type,
        // category: context.season === '1' ? [] : context.categoryRoot,
        ...user,
      }}
    >
      {/* // disabled={context.season === '2' ? true : false} */}
      <Form.Item
        label="????????????"
        name="category"
        rules={[{ required: true, message: '????????????????????????' }]}
        required
      >
        <Cascader options={context.selectedCategory} onChange={(v) => setCategory(v)} />
      </Form.Item>
      <Form.Item
        label='????????????'
        name="householdType"
        rules={[{required: true, message: '????????????????????????'}]}
      >
        <Select disabled options={farmTypeOptions} />
      </Form.Item>
      <Form.Item
        label="????????????"
        name="cropType"
        rules={[{ required: true, message: '????????????????????????' }]}
        required
      >
        <Select
          options={cropSelectOptions}
        />
      </Form.Item>

      <Form.Item
        label="??????"
        name="year"
        rules={[{ required: true, message: '??????????????????' }]}
        required
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        label="??????"
        name="season"
        rules={[{ required: true, message: '??????????????????' }]}
        required
      >
        <Select disabled>
          <Select.Option value="1">??????</Select.Option>
          <Select.Option value="2">??????</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="????????????"
        name="region"
        rules={[{ required: true, message: '????????????????????????' }]}
        required
      >
        <Cascader options={context.regionTree} value={context.region} disabled />
      </Form.Item>

      <Form.Item
        label="????????????"
        name="selected"
        rules={[{
          validator: () => {
            if (selected?.length > 0) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('????????????????????????'));
          },
        }]}
        required
      >
        {/* <Button onClick={() => { setIsMapModalVisible(true); }}>????????????</Button> */}
        <List
          dataSource={selected}
          style={{ marginTop: '-6px' }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`${item.town_name}-${item.village_name}-${item.land_num}`}
                description={`${_.round(parseFloat(item.land_areamu), 1)}???`}
              />
            </List.Item>
          )}
        />
      </Form.Item>

      <Form.Item
        label="????????????(???)"
        name="cumulativeSize"
        required
      >
        <Input type="number" disabled />
      </Form.Item>

      <Form.Item
        label="??????(m??)"
        name="cumulativeMetricSize"
        required
      >
        <Input disabled />
      </Form.Item>

      {user.ownershipType === 1 && household_type === 1 && <Form.Item
        label="??????????????????(???)"
        name="contractedArea"
        rules={[{ required: true, message: '??????????????????????????????' },
          // {
          //   validator: (r, v) => {
          //     if (v === undefined || v >= parseFloat(cumulativeSize)) {
          //       return Promise.resolve();
          //     }
          //     return Promise.reject(new Error('???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????'));
          //   },
          // },
        ]}
        required
      >
        <InputNumber type="number" disabled/>
      </Form.Item>}

      <Form.Item
        label="????????????(??????)"
        name="calculatedSubsidy"
        rules={[{
          validator: (r, v) => {
            if (v === '??????') {
              return Promise.reject(new Error('?????????????????????????????????????????????????????????????????????????????????'));
            }
            return Promise.resolve();
          },
        }]}
        required
      >
        <Input disabled />
      </Form.Item>

      {/* <Form.Item
        label="??????????????????"
        name="documents"
        rules={[{
          validator: () => {
            if (documents.length > 0) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('????????????????????????'));
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
