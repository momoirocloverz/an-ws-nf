import { PlusOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';
import { Button, Modal, message, Switch, Cascader, DatePicker } from 'antd';
import Moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import {
  articleType
} from '@/services/operationCanter';
import {
  articleClick
} from '@/services/home';
import ButtonAuth from '@/components/ButtonAuth';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './style.less';
import PreviewModal from "../../articleManage/components/PreviewModal";
import { ConnectProps } from '../../../.umi/plugin-dva/connect';

const IntegralStatistics: React.FC<any> = (props) => {
  const actionRef = useRef<ActionType>();
  const [ moduleVisible, handleModuleVisible ] = useState(false)
  const [ formValue, setFormValues ] = useState({})
  const [ previewVisible, handlePreviewVisible ] = useState<boolean>(false);
  const [articleTypeList, setArticleTypeList] = useState([]);
  const { accountInfo, areaList } = props

  interface TableListItem {
    product_id: number,
    product_name: string,
    integral: string,
    quantity: string,
    description: string,
    process: string,
    prompt: string,
    area: string,
    exchange: string,
    is_show: number,
    created_at: string,
  }
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '文章ID',
      dataIndex: 'article_id',
      hideInSearch: true,
      width: 100
    },
    {
      title: '文章标题',
      dataIndex: 'title',
      width: '200'
    },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: (item, props) => {
        let areaLists=(accountInfo.role_type==4&&areaList.length!=0)?areaList[0].children:areaList;
        return (
          <Cascader options={areaLists} placeholder="请选择所属地区" changeOnSelect/>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'updated_at',
      valueType: 'dateTimeRange'
    },
    {
      title: '文章分类',
      dataIndex: 'category_id',
      width: 130,
      render: (_, record: any) => {
        return (
          <span>{record.category_name}</span>
        )
      },
      valueEnum: {
        4: { text: '村务'},
        5: { text: '财务'},
        6: { text: '党务' }
      },
      filterDropdownVisible: false,
      filterIcon: <div/>,
    },
    {
      title: '今日点击',
      dataIndex: 'today',
      hideInSearch: true
    },
    {
      title: '累计点击量',
      dataIndex: 'views',
      hideInSearch: true
    },
    {
      title: '点击率',
      dataIndex: 'persent',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <>
          <ButtonAuth type="PREVIEW_ARTICLE">
            <a
              onClick={() => {
                handlePreviewVisible(true);
                setFormValues(record);
              }}
            >
              预览
            </a>
            <br/>
          </ButtonAuth>
        </>
      ),
    },
  ]

  const getArticleType = async () => {
    try {
      const _data = await articleType();
      const { code, data, msg } = _data || {};
      if (code === 0) {
        const obj = {}
        data.list.forEach((item:any) =>{
          obj[item.category_id] = {text: item.name}
        })
        setArticleTypeList(data.list);
      } else {
        message.error(msg);
      }
    } catch (err) {
      message.error('文章分类获取失败');
    }
  };

  const getIntegralGoodsList = async (val: any) => {
    let user=JSON.parse(localStorage.getItem('userInfo'));
    if(val.area) {
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
      // let len = val.area.length
      // if(len === 1) {
      //   val.city_id = val.area[0]
      // } else if(len === 2) {
      //   val.city_id = val.area[0]
      //   val.town_id = val.area[1]
      // } else {
      //   val.city_id = val.area[0]
      //   val.town_id = val.area[1]
      //   val.village_id = val.area[2]
      // }
    } else {
      val.city_id = accountInfo.city_id
      val.town_id = accountInfo.town_id
      val.village_id = accountInfo.village_id
    }
    if(val.updated_at && val.updated_at.length) {
      val.start_time = new Date(val.updated_at[0]).getTime() / 1000
      val.end_time = new Date(val.updated_at[1]).getTime() / 1000
      delete val.updated_at
    }
    val.area=undefined;
    const params = paginationHandle(val)
    const _data = await articleClick(params)
    return tableDataHandle(_data)
  }

  useEffect(() => {
    getArticleType()
  }, [])

  return (
    <div>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        rowKey="article_id"
        options={false}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        toolBarRender={false}
        tableAlertRender={false}
        request={(params) => getIntegralGoodsList(params)}
        columns={columns}
      />
      {
        previewVisible ? (
          <PreviewModal
            onSubmit={async () => {
              handlePreviewVisible(false)
              setFormValues({});
            }}
            onCancel={() => {
              handlePreviewVisible(false);
              setFormValues({});
            }}
            modalVisible={previewVisible}
            values={formValue}
          />
        ) : null
      }
    </div>
  )
}

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(IntegralStatistics)
