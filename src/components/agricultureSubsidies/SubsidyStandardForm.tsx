import React, { useEffect, useState } from 'react';
import {
  Form, Modal, DatePicker, InputNumber, Select, message, Cascader, Input
} from 'antd';
import moment from 'moment';
import { createSubsidyStandard, modifySubsidyStandard } from '@/services/agricultureSubsidies';
// eslint-disable-next-line no-unused-vars
import { CascaderOptionType } from 'antd/es/cascader';
import login from "@/models/login";

type EnumsObject = {
  categories: CascaderOptionType[],
  seasons: object,
  crops: object,
}

type SubsidyStandardFormProps = {
  context: 'modify' | 'create',
  enums: EnumsObject,
  visible: boolean,
  object?: any,
  cancelCb?: ()=>unknown,
  successCb?: ()=>unknown
}

function disableYears(current) {
  return current && current < moment().add(-1, 'y').startOf('year') ;
}

function getModalTitle(context) {
  let title = '未知';
  switch (context) {
    case 'create': title = '新建补贴标准'; break;
    case 'modify': title = '编辑补贴标准'; break;
    default:
  }
  return title;
}

function generateOptionList(values) {
  // @ts-ignore
  return Object.entries(values).map(([k, v]) => (<Select.Option value={k} key={k}>{v}</Select.Option>));
}
// function findKeyByCropName(source, name) {
//   const data = Object.entries(source);
//   // eslint-disable-next-line no-plusplus
//   for (let i = 0; i < data.length; i++) {
//     if (data[i][1] === name) {
//       return data[i][0];
//     }
//   }
//   return null;
// }

function SubsidyStandardForm({
  context, object, enums, visible, cancelCb, successCb,
}: SubsidyStandardFormProps) {
  const [formRef] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  // 新增逻辑 补贴标准你这边做下判断 如果是肥料的补贴就不传季节编辑也是
  const [showSeason, setShowSeason] = useState(true);
  useEffect(() => {
    if (visible) {
      formRef.resetFields();
      if (context === 'create') {
        setShowSeason(true);
      }
      if (context === 'modify') {
        const arr = [15, 16, 19, 20, 21, 22];
        if (arr.includes(Number(object.scale_parent_id)) && arr.includes(Number(object.scale_id))) {
          setShowSeason(false);
        } else {
          setShowSeason(true);
        }
        // setShowSeason(true)
      }
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onCancel={cancelCb}
      title={getModalTitle(context)}
      confirmLoading={submitting}
      forceRender
      onOk={async () => {
        try {
          await formRef.validateFields();
        } catch (e) {
          return;
        }
        try {
          const values = formRef.getFieldsValue();
          values.year = values.year.year();
          setSubmitting(true);
          if (context === 'create') {
            const result = await createSubsidyStandard(values);
            if (result.code === 0) {
              message.success('补贴标准创建成功!');
            } else {
              throw new Error(result.msg);
            }
          }
          if (context === 'modify') {
            console.log('object')
            console.log(object)
            const result = await modifySubsidyStandard(object.id, values);
            if (result.code === 0) {
              message.success('补贴标准修改成功!');
            } else {
              throw new Error(result.msg);
            }
          }
          if (typeof successCb === 'function') {
            successCb();
          }
        } catch (e) {
          if (context === 'create') {
            message.error(`新建补贴标准失败:${e.message}`);
          }
          if (context === 'modify') {
            message.error(`修改补贴标准失败:${e.message}`);
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form
        form={formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          category:
            object.scale_id && object.scale_parent_id
              ? [object.scale_parent_id, object.scale_id]
              : [],
          crops: object.crops_id?.toString(),
          year: moment(object.year ?? new Date().getFullYear(), 'YYYY'),
          season: [15, 16].includes(object.scale_id) ? null : object.season?.toString(),
          standard: object.standard,
        }}
      >
        <Form.Item
          label="补贴项目"
          name="category"
          rules={[
            {
              validator: (r, value) => {
                if (value[0] === undefined && value[1] === undefined) {
                  return Promise.reject(new Error('请选择补贴项目'));
                }
                return Promise.resolve();
              },
            },
          ]}
          required
        >
          <Cascader
            options={enums.categories}
            onChange={(v) => {
              console.log(v,'---------------')
              if ((v.includes(15) && v.includes(16)) || (v.includes(19 ) || v.includes(20))) {
                setShowSeason(false);
              } else {
                setShowSeason(true);
              }
          }}/>
        </Form.Item>
        {/* <Form.Item */}
        {/*  label="种植作物" */}
        {/*  name="crops" */}
        {/*  rules={[{ required: true, message: '请选择种植作物' }]} */}
        {/*  required */}
        {/* > */}
        {/*  <Select> */}
        {/*    {generateOptionList(enums.crops)} */}
        {/*  </Select> */}
        {/* </Form.Item> */}
        {
          showSeason && (<Form.Item
            label="季节"
            name="season"
            rules={[{ required: true, message: '请选择季节' }]}
            required
          >
            <Select>
              {generateOptionList(enums.seasons)}
            </Select>
          </Form.Item>)
        }

        <Form.Item
          label="年份"
          name="year"
          rules={[{ required: true, message: '请选择年份' }]}
          required
        >
          <DatePicker mode="year" picker="year" disabledDate={disableYears} />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}
        >
          {
            ({ getFieldValue }) => (
              <Form.Item
                label={ !getFieldValue('category') ? '补贴标准' : getFieldValue('category').includes(16) ? '补贴标准(元/吨)' : '补贴标准(元/亩)' }
                name="standard"
                rules={[{
                  validator: (r, value) => {
                    if (value === undefined) {
                      return Promise.reject(new Error('请输入补贴标准'));
                    }
                    if (value <= 0 || value > 99999) {
                      return Promise.reject(new Error('值域为0-99999'));
                    }
                    return Promise.resolve();
                  },
                }]}
                required
              >
                <InputNumber type="number" precision={2} />
              </Form.Item>
            )
          }
        </Form.Item>
        {/*getFieldValue('standard') == '16' ? (*/}
        {/*<Form.Item*/}
        {/*  label="补贴标准(元/亩)"*/}
        {/*  name="standard"*/}
        {/*  rules={[{*/}
        {/*    validator: (r, value) => {*/}
        {/*      if (value === undefined) {*/}
        {/*        return Promise.reject(new Error('请输入补贴标准'));*/}
        {/*      }*/}
        {/*      if (value <= 0 || value > 99999) {*/}
        {/*        return Promise.reject(new Error('值域为0-99999'));*/}
        {/*      }*/}
        {/*      return Promise.resolve();*/}
        {/*    },*/}
        {/*  }]}*/}
        {/*  required*/}
        {/*>*/}
        {/*  <InputNumber type="number" precision={2} />*/}
        {/*</Form.Item>*/}
        {/*) : null*/}
      </Form>
    </Modal>
  );
}

SubsidyStandardForm.defaultProps = {
  object: {},
  cancelCb: () => {},
  successCb: () => {},
};
export default React.memo(SubsidyStandardForm);
