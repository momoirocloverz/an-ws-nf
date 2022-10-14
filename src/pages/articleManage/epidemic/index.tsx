import React, { useEffect, useState, useRef } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, Select, DatePicker, Modal, Form, Input, Upload, message } from 'antd';
import { TableListItem } from '../data';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { tableDataHandle } from '@/utils/utils';
import { PlusOutlined, ExclamationCircleOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadEditorImg } from '@/services/operationCanter';
import { connect } from 'umi';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { ConnectState } from '@/models/connect';
import ButtonAuth from '@/components/ButtonAuth';
import ImgUpload from '@/components/imgUpload';
import OSS from 'ali-oss';
import { getOSS } from '@/services/operationCanter';
import { addPrevention, editPrevention, preventionList, preventionInfo, deletePrevention, topPrevention, addVideo } from '@/services/Epidemic';
import draftToHtml from 'draftjs-to-html';
import styles from '../style.less';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../components/edit.css';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const transformHtmlToDraftState = (html = '') => {
  const blocksFromHtml = htmlToDraft(html);
  const { contentBlocks, entityMap } = blocksFromHtml;
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
  return EditorState.createWithContent(contentState);
}

export interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
  clearSelected: () => void;
}

const Epidemic: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const [prevContent, setPrevContent] = useState<any>({
    title: ''
  });
  const [thumb, setThumb] = useState('');
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
  const [classifyType, setClassifyType] = useState<any>(undefined);
  const [preventType, setPreventType] = useState<any>(undefined);
  const [client, setClient] = useState<any>();
  const [process, setProcess] = useState<any>('0%');
  const [videoCover, setVideoCover] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const actionRef = useRef<ActionType>();
  const [id, setId] = useState(-1);
  const [loadingVideo, setLoadingVideo] = useState(0);
  const [editorState, setEditorState] = useState<any>(transformHtmlToDraftState());
  const [videoId, setVideoId] = useState(-1);
  const [modalCreate, setModalCreate] = useState({
    visible: false,
    title: '新建'
  });
  const [modalPrev, setModalPrev] = useState({
    visible: false,
    title: '预览'
  });
  const FormLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const [formValue, setFormValue] = useState({
    classify: undefined,
    popular: undefined,
    title: '',
    cover_image: '',
    video: '',
    content: ''
  });
  const columns: ProColumns<TableListItem>[] = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'id',
      width: 60,
      hideInSearch: true
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: '标题',
      align: 'center'
    },
    {
      key: 'category_name',
      dataIndex: 'category_name',
      title: '分类',
      align: 'center',
      renderFormItem: (_, record) => {
        return (
          <Select placeholder="请选择分类">
            <Option value={1}>权威发布</Option>
            <Option value={2}>防疫工作</Option>
            <Option value={3}>防疫科普</Option>
          </Select>
        )
      }
    },
    {
      key: 'thumb',
      dataIndex: 'thumb',
      title: '封面',
      hideInSearch: true,
      align: 'center',
      render: (src) => {
        return src ? <img src={src} style={{ width: 80 }} /> : '暂无'
      }
    },
    {
      key: 'author',
      dataIndex: 'author',
      title: '发布人员',
      hideInSearch: true,
      align: 'center'
    },
    {
      key: 'created_at',
      dataIndex: 'created_at',
      title: '发布时间',
      align: 'center',
      renderFormItem: () => {
        return (
          <RangePicker showTime />
        )
      }
    },
    {
      key: 'publicStatus',
      dataIndex: 'publicStatus',
      title: '发布状态',
      hideInSearch: true,
      align: 'center',
      render: () => '已发布'
    },
    {
      key: 'options',
      dataIndex: 'options',
      title: '操作',
      width: 100,
      fixed: 'right',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => {
        return (
          <div className={styles.epidemicOptions}>
            <ButtonAuth type="EPIDEMIC_PREV">
              <a onClick={() => prevInfomation(record)}>预览</a>
            </ButtonAuth>
            <ButtonAuth type="EPIDEMIC_EDIT">
              <a onClick={() => editInfomation(record)}>编辑</a>
            </ButtonAuth>
            <ButtonAuth type="EPIDEMIC_DEL">
              <a className={styles.epidemicDelete} onClick={() => handleDelete(record)}>删除</a>
            </ButtonAuth>
            <ButtonAuth type="EPIDEMIC_TOP">
              <a onClick={() => topPreventionInfo(record)}>置顶</a>
            </ButtonAuth>
          </div>
        )
      }
    }
  ];
  // 置顶
  const topPreventionInfo = async (record) => {
    let param = {
      id: record.id
    }
    let datas = await topPrevention(param);
    if (datas.code == 0) {
      message.success('置顶成功');
      // if(actionRef.current){
      //   actionRef.current.reload();
      // }
    }
  }
  // 编辑
  const editInfomation = (record) => {
    form.setFieldsValue({ 'classify': record.category });
    form.setFieldsValue({ 'popular': record.type });
    form.setFieldsValue({ 'title': record.title });
    form.setFieldsValue({ 'cover_image': record.thumb ? record.thumb : undefined });
    form.setFieldsValue({ 'video': record.video });
    form.setFieldsValue({ 'content': record.content });
    setVideoId(record.video?record.video:-1);
    setId(record.id);
    setThumb(record.thumb || '');
    setVideoCover((record.category == 3 && record.type == 2) ? record.thumb : '');
    setLoadingVideo((record.category == 3 && record.type == 2) ? 2 : 0);
    if (record.content) {
      setEditorState(transformHtmlToDraftState(record.content));
    } else {
      setEditorState(transformHtmlToDraftState());
    }
    setClassifyType(record.category);
    setPreventType(record.type);
    setModalCreate({ visible: true, title: '编辑' });
    setIsEdit(!isEdit);
  }
  // 预览
  const prevInfomation = async (record) => {
    let data = {
      id: record.id
    };
    let datas = await preventionInfo(data);
    if (datas.code == 0) {
      setPrevContent(datas.data);
      setModalPrev({ ...modalPrev, visible: true });
    }
  }
  // 删除
  const handleDelete = (record) => {
    confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '您确定要删除该条信息?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        let data = { id: record.id };
        deletePrevention(data).then(res => {
          if (res.code == 0) {
            message.success('删除成功');
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }
  const getEpidemicList = async (params: any) => {
    let paramss: any = {
      title: params.title ? params.title : undefined,
      category: params.category_name ? params.category_name : undefined,
      begin_time: params.created_at ? moment(params.created_at[0]).format('YYYY-MM-DD HH:mm:ss') : undefined,
      end_time: params.created_at ? moment(params.created_at[1]).format('YYYY-MM-DD HH:mm:ss') : undefined,
      page: params.current,
      page_size: params.pageSize
    };
    let data = await preventionList(paramss);
    return tableDataHandle(data)
  }

  const uploadButtonVideo = (
    <div>
      {
        loadingVideo != 2 ?
          <>
            {
              loadingVideo ? <LoadingOutlined /> : <UploadOutlined />
            }
            <div style={{ marginTop: 8 }}>{loadingVideo ? '上传进度' + process : '点击上传'}</div>
          </> :
          <div className={styles.coverVideo}>
            <img src={videoCover} />
          </div>
      }

    </div>
  );
  const transformDraftStateToHtml = (editorState: any) => {
    if (!editorState.getCurrentContent) {
      return '';
    }
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };
  const uploadImageCallBack = (file: any) => new Promise(
    async (resolve, reject) => {
      const _data = await uploadEditorImg({ 'file': file })
      let _url = ''
      if (_data.code === 0) {
        _url = _data.data && _data.data.url || ''
      }
      resolve({
        data: {
          link: _url
        }
      })
    }
  )
  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
  }
  const createOrEditOk = async () => {
    const fieldsValue: any = await form.validateFields();
    fieldsValue.content = transformDraftStateToHtml(editorState);
    let data = {
      id: id > 0 ? id : undefined,
      title: fieldsValue.title,
      category: fieldsValue.classify,
      content: (fieldsValue.classify == 3 && fieldsValue.popular == 2) ? '' : fieldsValue.content,
      type: fieldsValue.popular ? fieldsValue.popular : 1,
      thumb: !fieldsValue.popular || fieldsValue.popular == 1 ? (Object.prototype.toString.call(fieldsValue.cover_image) == '[object Array]' ? fieldsValue.cover_image[0].url : fieldsValue.cover_image) : videoCover,
      video: (fieldsValue.classify == 3 && fieldsValue.popular == 2) ? videoId : 0,
    };
    if (id > 0) {
      let datas = await editPrevention(data);
      if (datas.code == 0) {
        message.success(modalCreate.title + '成功');
      }
    } else {
      let datas = await addPrevention(data);
      if (datas.code == 0) {
        message.success(modalCreate.title + '成功');
      }
    }
    cancelModal();
    if (actionRef.current) {
      actionRef.current.reload();
    }
  }
  const getImgData = (arr = []) => {
    form.setFieldsValue({ 'cover_image': arr });
    setImgUrl(arr)
  }
  // OSS直传
  const changeUploadVideo = (e) => {
    multipartUpload(e);
  }
  const multipartUpload = async (e) => {
    try {
      let result = await client.multipartUpload('acvideo/' + e.file.name, e.file, {
        progress: function (p) {
          setLoadingVideo(1);
          let precent_process = parseInt(p * 100 + '') + '%'
          setProcess(precent_process);
        },
        meta: { year: 2021, people: 'wsnf' },
        mime: 'video/*'
      });
      let url = result.res.requestUrls[0];
      let pathUrl = url.split('?')[0];
      let uploadId = url.split('?')[1].split('=')[1];
      setLoadingVideo(2);
      setVideoCover(pathUrl + '?x-oss-process=video/snapshot,t_1000,m_fast');
      let paramss = {
        upload_id: uploadId,
        play_url: pathUrl
      };
      // 上传视频到服务器
      let datas = await addVideo(paramss);
      if (datas.code == 0) {
        setVideoId(datas.data.id)
        form.setFieldsValue({ 'video': datas.data.id });
      }
    } catch (e) {
      console.log(e);
    }
  }

  // 获取OSS信息
  const getOSSMsg = async () => {
    const data = await getOSS();
    if (data.code === 0) {
      const newOSS: any = new OSS({
        region: data.data.region,
        accessKeyId: data.data.accessKeyId,
        accessKeySecret: data.data.accessKeySecret,
        bucket: data.data.bucket,
        stsToken: data.data.security_token,

      });
      newOSS.path = data.data.path;
      setClient(newOSS);
    }
  };
  useEffect(() => {
    getOSSMsg();
  }, []);
  useEffect(() => {
    if (id > 0) {
      setImgUrl(thumb ? [{
        uid: 1029,
        name: '图片',
        status: 'done',
        url: thumb
      }] : []);
    }
  }, [isEdit])
  const createFile = () => {
    setModalCreate({ visible: true, title: '新建' });
    setId(-1);
  }
  // 取消按钮
  const cancelModal = () => {
    setModalCreate({ ...modalCreate, visible: false });
    form.resetFields();
    setClassifyType(undefined);
    setPreventType(undefined);
    setVideoCover('');
    setEditorState(transformHtmlToDraftState());
    setImgUrl([]);
  }
  // 改变分类
  const changeClassify = (e) => {
    setClassifyType(e);
    if (e == 3) {
      setPreventType(2)
      form.setFieldsValue({ 'popular': 2 });
    } else {
      setPreventType(1)
      form.setFieldsValue({ 'popular': 1 });
    }
    setLoadingVideo(0);
  }
  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle=""
        actionRef={actionRef}
        columns={columns}
        options={false}
        tableAlertRender={false}
        scroll={{ x: 1500 }}
        rowKey="article_id"
        toolBarRender={(action, { selectedRows }) => [
          <ButtonAuth type="CREATE">
            <Button icon={<PlusOutlined />} type="primary" onClick={() => createFile()}>
              新建
            </Button>
          </ButtonAuth>
        ]}
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: true,
          defaultCurrent: 1,
          pageSize: 10,
          size: 'default'
        }}
        request={(params) => getEpidemicList(params)}
      />
      {/* 新建编辑 */}
      <Modal
        visible={modalCreate.visible}
        width={900}
        title={modalCreate.title}
        onCancel={() => cancelModal()}
        onOk={createOrEditOk}
        maskClosable={false}
      >
        <Form {...FormLayout} className={styles.newForm} form={form} initialValues={formValue}>
          {/* 分类 */}
          <Form.Item label="分类" name="classify" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="请选择" onChange={(e) => changeClassify(e)}>
              <Option value={1}>权威发布</Option>
              <Option value={2}>防疫工作</Option>
              <Option value={3}>防疫科普</Option>
            </Select>
          </Form.Item>
          {/* 科普分类 */}
          {
            classifyType == 3 ?
              <Form.Item label="科普分类" name="popular" rules={[{ required: true, message: '请选择科普分类' }]}>
                <Select placeholder="请选择" onChange={(e) => setPreventType(e)}>
                  <Option value={1}>科普文章</Option>
                  <Option value={2}>科普视频</Option>
                </Select>
              </Form.Item> : null
          }
          {/* 标题 */}
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          {/* 上传封面 */}
          {
            preventType == undefined || preventType == 1 ?
              <Form.Item label="上传封面" name="cover_image" rules={[{ required: true }]}>
                <ImgUpload values={imgUrl} getImgData={getImgData} />
              </Form.Item> : null
          }
          {/* 上传视频 */}
          {
            classifyType == 3 && preventType == 2 ?
              <Form.Item label="上传视频" name="video" rules={[{ required: true }]}>
                <Upload
                  accept="video/*"
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={changeUploadVideo}
                >
                  {uploadButtonVideo}
                </Upload>
              </Form.Item> : null
          }
          {/* 文章内容 */}
          {
            preventType == undefined || preventType == 1 ?
              <Form.Item label="文章内容" name="content" rules={[{ required: true }]}>
                <Editor
                  editorClassName="demo-editor"
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  localization={{
                    locale: 'zh',
                  }}
                  toolbar={
                    {
                      options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                      image: {
                        uploadCallback: uploadImageCallBack,
                        alt: { present: true, previewImage: true },
                        previewImage: true,
                      }
                    }
                  }
                />
              </Form.Item> : null
          }
        </Form>
      </Modal>

      {/* 预览 */}
      <Modal
        visible={modalPrev.visible}
        width={700}
        title={modalPrev.title}
        onCancel={() => setModalPrev({ ...modalPrev, visible: false })}
        maskClosable={false}
        footer={null}>
        <div className={styles.prevContent}>
          <div className={styles.prevItem}>
            <span className={styles.prevLabel}>标题：</span>
            <span className={styles.prevContent}>{prevContent.title}</span>
          </div>

          <div className={styles.prevItem}>
            <span className={styles.prevLabel}>分类：</span>
            <span className={styles.prevContent}>{prevContent.category_name}</span>
          </div>

          <div className={styles.prevItem}>
            <span className={styles.prevLabel}>封面：</span>
            <img src={prevContent.thumb} className={styles.prevCover} />
          </div>

          <div className={styles.prevItem}>
            <span className={styles.prevLabel}>发布人员：</span>
            <span className={styles.prevContent}>{prevContent.author}</span>
          </div>

          <div className={styles.prevItem}>
            <span className={styles.prevLabel}>发布时间：</span>
            <span className={styles.prevContent}>{prevContent.created_at}</span>
          </div>
          {
            prevContent.content ? <div className={styles.prevItem}>
              <span className={styles.prevLabel}>文本信息：</span>
              <div className={styles.prevPage} dangerouslySetInnerHTML={{ __html: prevContent.content }} />
            </div> : null
          }
          {
            prevContent.play_url ? <div className={styles.prevItem}>
              <span className={styles.prevLabel}>文本信息：</span>
              <video controls src={prevContent.play_url} className={styles.prevVideo}></video>
            </div> : null
          }
        </div>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default connect(({ user, info }: ConnectState) => ({
  accountInfo: user.accountInfo,
  areaList: info.areaList,
}))(Epidemic);
