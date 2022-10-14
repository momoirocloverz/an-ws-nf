import React, { useRef, useState, useEffect } from 'react';
import ButtonAuth from '@/components/ButtonAuth';
import {
  Button, message, Modal, Cascader, Upload
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { tableDataHandle, getLocalToken, getApiParams } from '@/utils/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { mask } from '@/utils/utils';
import { editProveVillage, proveVillageList } from '@/services/serve';
import ImportBtn from '@/components/buttons/ImportBtn';
import { PUBLIC_KEY } from '@/services/api';
import { result, sortedLastIndex } from 'lodash';
import { getOSS, getPdfId } from '@/services/operationCanter'
import OSS from 'ali-oss';

function Index({user, regionTree}) {
  const tableRef = useRef();
  const [ newRegionList, setNewRegion ] = useState([]);
  const [ defaultValue, setDefaultValue ] = useState<any>([]);
  const [ loading, setLoading ] = useState(false);
  const [ curId, setCurId ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [client, setClient] = useState({});

  const loadData = async (rawParams) => {
    console.log(rawParams, 'rawParams')
    const params = {
      real_name: rawParams.real_name ?? '',
      city_id: rawParams.area_name?.[0],
      town_id: rawParams.area_name?.[1],
      village_id: rawParams.area_name?.[2],
      page: rawParams.current,
      page_size: rawParams.pageSize
    };
    const result = await proveVillageList(params);
    if (result.code !== 0) {
      message.error(`读取列表失败: ${result.msg}`);
      throw new Error(result.msg);
    }
    return tableDataHandle(result);
  };

  useEffect(()  =>  {
    // const arr = regionTree;
    // arr.map(city => {
    //   city.children.map(town => {
    //     delete town.children;
    //   })
    // })
    // setNewRegion(arr);
    setDefaultValue([user.city_id, user.town_id, user.village_id])
    // console.log(arr, 'arr')
  }, [regionTree])

  const tableColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
    },
    {
      title: '授权地区',
      dataIndex: 'area_name',
      initialValue: defaultValue,
      renderFormItem: (item, props) => {
        let areaLists = (user.role_type === 4 && regionTree.length > 0) ? regionTree[0].children : regionTree;
        return (
          <Cascader
            options={areaLists}
            disabled={user.role_type === 4 || user.role_type === 3}
            changeOnSelect
          />
        )
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      hideInSearch: true
    },
    // {
    //   title: '手机号',
    //   dataIndex: 'mobile',
    //   hideInSearch: true,
    //   render: (__, record) => (mask(record.mobile, { fixedLength: 11 }))
    // },
    {
      title: '村民上报附件',
      dataIndex: 'mobile',
      hideInSearch: true,
      render: (__, record) => (
        record.file_id
        ? (
          <Button
            type="link"
            onClick={() => {
              window.location.href = record.file_id.url;
            }}
          >
            下载
          </Button>
        )
        : <span>暂无上传</span>
      )
    },
    {
      title: '村民上报时间',
      dataIndex: 'created_at',
      hideInSearch: true
    },
    {
      title: '管理员上报附件',
      dataIndex: 'mobile',
      hideInSearch: true,
      render: (__, record) => (
        record.admin_file_id
        ? (
          <Button
            type="link"
            onClick={() => {
              window.location.href = record.admin_file_id.url;
            }}
          >
            下载
          </Button>
        )
        : <span>暂无上传</span>
      )
    },
    {
      title: '管理员上传时间',
      dataIndex: 'upload_time',
      hideInSearch: true
    },
    {
      title: '操作',
      key: 'actions',
      hideInSearch: true,
      align: 'center',
      render: (item, record) => (
        <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          {/* </ButtonAuth> */}
          {
            !record.admin_file_id ? (
              <ButtonAuth type="EDIT">
                <Button type="link" loading={loading} onClick={() => inputRef.current?.click()}>
                  {loading ? '正在上传...' : '上传附件'}
                  <input
                    ref={inputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      upload(e.target?.files?.[0], record.id);
                    }}
                  />
                </Button>
              </ButtonAuth>
            ) : null
          }
          {
            record.admin_file_id ? (
              <ButtonAuth type="DELETE">
                <Button
                  type="link"
                  style={{color: '#ff4d4f'}}
                  onClick={() => {
                    Modal.confirm({
                      content: `确认删除附件吗?`,
                      icon: <ExclamationCircleOutlined />,
                      onOk: async () => {
                        try {
                          await editProveVillage({
                            id: record.id,
                            admin_file_id: 0
                          });
                          message.success('删除成功!');
                          tableRef.current.reload();
                        } catch (e) {
                          message.error(new Error(`删除失败: ${e.message}!`));
                        }
                      },
                    });
                  }}
                >
                  删除附件
                </Button>
              </ButtonAuth>
            ) : null
          }
        </div>
      ),
    },
  ];

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

  // 导入文件
  const upload = async (file : File | undefined | null, id) => {
    if (!file) { return; }
    console.log(file, 'file')
    setLoading(true);
    let url = `${client.path}/${file.name.split(".")[0]}-${Date.parse(new Date()) / 1000}.${file.name.split(".")[1]}`
    console.log(url, 'url');

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      console.log(url, file)
      client.multipartUpload(url, file).then(async (data) => {
        console.log(data, 'data');
        let str = data.res.requestUrls[0]
        setLoading(false);
        console.log(data, 'data')
        const nameArr = data.name.split('.')[0];
        const fileName = nameArr.split('/')[1];
        const arr = file.name.split('.');
        arr.pop();
        const fileTitle = arr.join('.');
        const getId = await getPdfId({
          'file_no': fileName,
          'suffix': file.name.split(".")[1],
          'size': data.res.size,
          'width': 0,
          'height': 0,
          title: fileTitle
        });
        if(getId.code === 0) {
          const result = await editProveVillage({
            id: id,
            admin_file_id: getId.data.file_id
          })
          if(result.code === 0) {
            message.success('上传成功!');
            tableRef.current.reload();
          } else {
            message.error(new Error(`删除失败: ${e.message}!`));
          }
          inputRef.current.value = '';
        }
      })
    }
  };

  useEffect(() => {
    getOSSMsg();
  }, [])

  return (
    <PageHeaderWrapper>
      {
        defaultValue ? (
          <ProTable
            actionRef={tableRef}
            request={loadData}
            columns={tableColumns}
            rowKey="id"
            options={false}
            toolBarRender={false}
          />
        ) : null
      }

    </PageHeaderWrapper>
  );
}

export default connect(({ user, info }: ConnectState) => ({
  user: user.accountInfo,
  authorizations: user.userAuthButton,
  regionTree: info.areaList,
}))(Index);
