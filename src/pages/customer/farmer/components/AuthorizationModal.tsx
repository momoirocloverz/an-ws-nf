import React, { useState, useEffect } from 'react';
import { Radio, Tree, Modal, Divider, List, Checkbox, Button, message } from 'antd';
import { ExclamationCircleOutlined,FrownOutlined } from '@ant-design/icons';
import { getAreaList, getVillageAuth, setVillageAuth } from '@/services/customer';
import styles from './AuthorityModal.less'

interface CreateFormProps {
  modalVisible: boolean;
  record: any;
  // onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const AuthorizationModal: React.FC<CreateFormProps> = (props) => {
  const [levelvalue, setLevelValue] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [checkedVillage, setCheckedVillage] = useState<string[]>([]);
  const [defaultVillage] = useState<string>(props.record.area);
  const [areaInfo, setAreaInfo] = useState<[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const {
    modalVisible,
    // onSubmit,
    onCancel,
  } = props;

  // 提交表单
  const okHandle = async () => {
    let params = {
      user_id: props.record.user_id,
      tag: levelvalue[0] || '',
      villages: checkedVillage.length > 0 ? checkedVillage.map(item=>item.split('-').slice(2).join('-')).join(',') : '' ,
      default: (selectedKeys[0]&&selectedKeys[0].split('-').pop()) || props.record.village_id
    }
    setVillageAuth(params).then(res => {
      if(res.code === 0){
        message.success(res.msg||'请求成功');
        setSelectedKeys([])
        setCheckedKeys([])
        setLevelValue([])
        setExpandedKeys([])
        onCancel()
      }else{
        message.error(res.msg||'请求失败')
      }
    })
  };

  const onChangeLevel = (e) => {
    if(e.length<1){
      Modal.confirm({
        title: '警告',
        icon: <ExclamationCircleOutlined />,
        content: '取消管理员将清除所有已分配的归属地',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          setLevelValue(e.filter(item => item !== levelvalue[0]));
          setCheckedKeys([]);
          setSelectedKeys([]);
        }
      });
    }else {
      setLevelValue(e.filter(item => item !== levelvalue[0]))
    }
  }

  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const onCheck = checkedKeys => {
    if(levelvalue.length<1){
      message.warning("请先分配管理员")
      return
    }
    // 如果有默认村且选中
    if(selectedKeys[0] && !checkedKeys.filter(item => item.indexOf("leaf")>=0).map(item=>item.split('-').pop()).includes(selectedKeys[0].split('-').pop())){
      // Modal.confirm({
      //   title: '警告',
      //   icon: <ExclamationCircleOutlined />,
      //   content: '默认归属地包含在内，取消勾选将取消默认归属地',
      //   okText: '确认',
      //   cancelText: '取消',
      //   onOk: () => {
          setCheckedKeys(checkedKeys);
          setCheckedVillage(checkedKeys.filter(item => item.indexOf("leaf")>=0));
          setSelectedKeys([]);
      //   }
      // });
    }else{
      setCheckedKeys(checkedKeys);
      setCheckedVillage(checkedKeys.filter(item => item.indexOf("leaf")>=0));
    }
  };

  const onSelect = (selectedKeys, info) => {
    if(levelvalue.length<1){
      message.warning("请先分配管理员")
      return
    }
    if(!checkedVillage.map(item=>item.split('-').pop()).includes(selectedKeys[0].split('-').pop())){
      message.warning('请先勾选该分配该村')
      return
    }
    setSelectedKeys(selectedKeys);
    // setSelectedValue(info.node.title);
  };

  const levelOptions = [
    { label: '村级信息员', value: '1' },
    { label: '镇级管理员', value: '2' },
    { label: '市级管理员', value: '3' },
  ]

  /**
   * 格式化地区数据为tree组件可用数据
   * @date 2020-10-14
   * @param {Array} 市县村数据
   * @param {String} 父级key
   * @returns {Array}
   */
  const formateArea = (data,parentkey) => {
    return data.map(item => {
      let areaObj = {}
      let key = parentkey ? `${item.label}-${parentkey}-${item.value}` : `${item.label}-${item.value}`;
      Object.assign(areaObj,{title: item.label, key})
      if(item.children){
        // 对key进行处理，去掉父级的lable信息
        const currentKey = key.split("-").slice(1).join('-')
        areaObj.children = formateArea(item.children, currentKey)
        areaObj.selectable = false;
      }else{
        areaObj.icon=({ selected }) => (selected ? <span>已默认</span> : '');
        // leaf 为识别是否是叶子节点的key标识
        areaObj.key= `leaf-${areaObj.key}`;
      }
      return areaObj
    })
  }

  useEffect(() => {
    getAreaList().then(res=>{
      let areaMap = formateArea(res.data);
      setAreaInfo(areaMap);
      setExpandedKeys([areaMap[0].key])
    })
    getVillageAuth({user_id: props.record.user_id}).then(res=>{
      if(res.code === 0){
        setCheckedKeys(res.data.villages);
        setCheckedVillage(res.data.villages);
        setLevelValue(res.data.tag === 0 ? [] : [`${res.data.tag}`]);
        setSelectedKeys([res.data.default])
      }

    })
  }, [props.record.user_id])

  return (
    <Modal
      width={800}
      maskClosable={false}
      destroyOnClose
      title={'授权管理'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <div className={styles.settingAuth}>
        分配管理员：
            <Checkbox.Group options={levelOptions} onChange={onChangeLevel} value={levelvalue} />
      </div>
      <div className={styles.settingArea}>
        <div>
          分配归属地：
          <Tree
            showIcon
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={areaInfo}
          />
        </div>
        <div className={styles.defaultVillage}>
          默认归属地：{(selectedKeys[0] && selectedKeys[0].split('-')[1]) || props.record.city_town.split(" ").pop()}
          <Divider orientation="left">已选归属地：</Divider>
          <List
            size="small"
            bordered
            dataSource={checkedVillage.map(item=>item.split('-')[1])}
            renderItem={item => (
              <List.Item>
                {item}
              </List.Item>
            )}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AuthorizationModal
