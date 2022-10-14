import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from '../data';
import { tableDataHandle, paginationHandle } from '@/utils/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  articleList,
  articleType,
  addArticle,
  editArticle,
  deletArticle,
  editArticleStatus
} from '@/services/operationCanter';
import ImgView from '@/components/ImgView';
import { Switch, Button, message, Modal,Cascader } from 'antd';
import CreateForm from '../components/CreateForm';
import PreviewModal from "../components/PreviewModal";
import Moment from 'moment';
import ButtonAuth from '@/components/ButtonAuth';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from '../style.less'
/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  try {
    delete fields.cover_image;
    const _data = await addArticle({...fields, sub_category_id: fields.category_id, category_id: '5' });
    if (_data.code === 0) {
      message.success('添加成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('添加失败');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: any) => {
  try {
    delete fields.cover_image;
    const _data = await editArticle({...fields, sub_category_id: fields.category_id, category_id: '5' })
    if (_data.code === 0) {
      message.success('更新成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('更新失败');
    return false;
  }
};

/**
 * 删除节点
 * @param article_id
 */
const handleDelet = async (id: number) => {
  try {
    const _data = await deletArticle({ article_id: id })
    if (_data.code === 0) {
      message.success('删除成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('删除失败');
    return false;
  }
}

// 更新状态
const changeStatus = async (num: string, checked: boolean, id: number) => {
  try {
    const params = {
      article_id: id,
      type: num,
      status: checked ? '1' : '0'
    };
    const _data = await editArticleStatus(params);
    if (_data.code === 0) {
      message.success('状态更新成功');
      return true;
    } else {
      message.error(_data.msg);
      return false;
    }
  } catch (err) {
    message.error('删除失败');
    return false;
  }
}

const ArticleList: React.FC<any> = (props) => {
  const { accountInfo, areaList } = props
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [ previewVisible, handlePreviewVisible ] = useState<boolean>(false);
  const [formValues, setFormValues] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [articleTypeList, setArticleTypeList] = useState([]);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '文章ID',
      dataIndex: 'article_id',
      hideInSearch: true,
    },
    {
      title: '文章标题',
      dataIndex: 'keyword',
      width: 180,
      render: (_, record) => {
        return (<p>{record.title}</p>)
      }
    },
    {
      title: '文章分类',
      dataIndex: 'category_id',
      hideInSearch: true,
      width: 130,
      render: (_, record) => {
        return (<p>{record.category_title}</p>)
      },
    },
    {
      title: '文章封面',
      dataIndex: 'cover_image',
      width: 120,
      render: (_, record) => {
        return (
          <ImgView url={record.cover_image} width={100} height={100} />
        );
      },
      hideInSearch: true
    },
    // {
    //   title: '发布人员',
    //   width: 100,
    //   dataIndex: 'admin_name',
    //   hideInSearch: true
    // },
    {
      title: '所属地区',
      dataIndex: 'area',
      hideInSearch: accountInfo.role_type === 3 ? true : false,
      renderFormItem: () => {
        let areaLists=(areaList.length>0&&accountInfo.role_type===4)?areaList[0].children:areaList;
        return (
          <Cascader options={areaLists} changeOnSelect/>
        )
      }
    },
    {
      title: '发布时间',
      dataIndex: 'timed_release',
      render: (_, record) => {
        const time = record['timed_release'] * 1000
        return (<p>{ record['timed_release'] ? Moment(time).format('YYYY-MM-DD HH:mm:ss') : ''}</p>)
      },
      valueType: 'dateTimeRange'
    },
    // {
    //   title: '发布状态',
    //   dataIndex: 'release_status',
    //   width: 100,
    //   render: (_, record) => (
    //     <p>{record.release_status === 1 ? '已发布' : '未发布'}</p>
    //   ),
    //   hideInSearch: true
    // },
    // {
    //   title: '是否显示',
    //   dataIndex: 'is_display',
    //   hideInSearch: true,
    //   width: 100,
    //   render: (_, record) => {
    //     return (
    //       <Switch
    //         defaultChecked={record.is_display === 1 ? true : false}
    //         onChange={async (checked) => {
    //           const success = await  changeStatus('2', checked, record.article_id);
    //           if (success) {
    //             if (actionRef.current) {
    //               actionRef.current.reload();
    //             }
    //           }
    //         }}
    //       />
    //     );
    //   },
    // },
    // {
    //   title: '是否置顶',
    //   dataIndex: 'is_top',
    //   hideInSearch: true,
    //   width: 100,
    //   render: (_, record) => {
    //     return (
    //       <Switch
    //         defaultChecked={record.is_top === 1 ? true : false}
    //         onChange={async (checked) => {
    //           const success = await  changeStatus('1', checked, record.article_id);
    //           if (success) {
    //             if (actionRef.current) {
    //               actionRef.current.reload();
    //             }
    //           }
    //         }}
    //       />
    //     );
    //   },
    // },
    {
      title: '浏览数',
      dataIndex: 'views',
      hideInSearch: true,
    },
    {
      title: '分享数',
      dataIndex: 'shares',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'updated_at',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 120,
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
          <ButtonAuth type="EDIT">
            <a
              onClick={() => {
                setIsEdit(true);
                handleModalVisible(true);
                setFormValues({...record, from: 'sanwu', parent_category_id: '1', type: 'caiwu'});
              }}
            >
              编辑
            </a>
          </ButtonAuth>
          <br/>
          <ButtonAuth type="DELETE">
            <a
              className={styles.colorTap}
              onClick={async () => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '确定删除本条文章信息吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await handleDelet(record.article_id);
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  },
                });
              }}>
              删除
            </a>
          </ButtonAuth>
          <ButtonAuth type="ARTICLE_SHOW_HIDE">
            <a
              className={record.is_display === 1 ? styles.colorTap : ''}
              onClick={async () => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: `确定${record.is_display === 1 ? '隐藏' : '显示'}此条资讯吗？`,
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await await changeStatus('2', record.is_display === 0 ? true : false, record.article_id);
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  },
                });
              }}>
              {record.is_display === 1 ? '隐藏资讯' : '显示资讯'}
            </a>
            <br/>
          </ButtonAuth>
          <ButtonAuth type="ARTICLE_STICK">
            <a
              className={record.is_top === 1 ? styles.colorTap : ''}
              onClick={async () => {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: `确定${record.is_top === 1 ? '取消置顶' : '置顶'}吗？`,
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    const success = await changeStatus('1', record.is_top === 0 ? true : false, record.article_id);
                    if (success) {
                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
                    }
                  },
                });
              }}>
              {record.is_top === 1 ? '取消置顶' : '置顶'}
            </a>
            <br/>
          </ButtonAuth>
        </>
      )
    },
  ];

  // 获取dataSource
  const getArticleList = async (val:any) => {
    // if(val.area) {
    //   val.city_id = val.area[0]
    //   val.town_id = val.area[1]
    //   val.village_id = val.area[2]
    //   delete val.area
    // }
    let user=JSON.parse(localStorage.getItem('userInfo'));
    if (val.area) {
      val.city_id=user.role_type==4?user.city_id:val.area[0];
      val.town_id=user.role_type==4?val.area[0]:val.area[1];
      val.village_id=user.role_type==4?val.area[1]:val.area[2];
    }
    val.area=undefined;
    const valObj = { ...val }
    const timeArr = valObj['timed_release'] || []
    const cateArr = valObj['category_id'] || []
    if (timeArr && timeArr.length > 0) {
      valObj['start_time'] = Moment(timeArr[0]).valueOf() / 1000
      valObj['end_time'] = Moment(timeArr[1]).valueOf() / 1000
      delete valObj['timed_release']
    }
    console.log(cateArr, 'val')
    valObj['category_id'] = '7,8,9'
    const _params = paginationHandle(valObj);
    const _data = await articleList(_params);
    return tableDataHandle(_data)
  };

  // 获取文章分类
  const getArticleType = async () => {
    try {
      const _data = await articleType();
      const { code, data, msg } = _data || {};
      if (code === 0) {
        const obj = {}
        data.list.forEach((item:any) => {
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

  useEffect(() => {
    getArticleType();
  }, []);

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        columns={columns}
        actionRef={actionRef}
        options={false}
        tableAlertRender={false}
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => {
              handleModalVisible(true);
              setIsEdit(false);
              setFormValues({from: 'sanwu', type: 'caiwu'});
            }}>
              新建文章
            </Button>
          </ButtonAuth>
        ]}
        rowKey="article_id"
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        request={(params) => getArticleList(params)}
      />
      {
        formValues && Object.keys(formValues).length || createModalVisible ? (
          <CreateForm
            isEdit={isEdit}
            onSubmit={async (value) => {
              let success = null;
              if (isEdit) {
                success = await handleUpdate(value);
              } else {
                success = await handleAdd(value);
              }
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
                setFormValues({});
              }
            }}
            onCancel={() => {
              handleModalVisible(false);
              setFormValues({});
            }}
            typeList={articleTypeList}
            modalVisible={createModalVisible}
            values={formValues}
          />
        ) : null
      }
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
            values={formValues}
          />
        ) : null
      }
    </PageHeaderWrapper>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(ArticleList);
