import React, { useState, useEffect } from 'react';
import { Modal, Tree, } from 'antd';
import AuthModal from './authModal';

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  value: Array<any>;
  selected: Array<any>;
}

const RouteModal: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onSubmit: handleAdd, onCancel, value, selected,} = props;
  const [treeData, setTreeData] = useState<any[]>(value);
  const [selectedAuth, setSelectedAuth] = useState<any[]>([]);
  const [menuDetail, setMenuDetail] = useState<any[]>({});
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>(selected);
  const [resultCheckedKeys, setResultCheckedKeys] = useState<string[]>(selected);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [roleVisible, setRoleVisible] = useState(false);
  const [authSelect, setAuthSelect] = useState<any[]>([]);

  // 删除第三级权限，单独抽出来配置权限
  const getTreeData = () => {
    const arr = [...value];
    if (arr.length > 0) {
      arr.forEach((el: any) => {
        if (el.children && el.children.length > 0) {
          el.children.forEach((el2: any) => {
            el2.title = (
              <p>
                <span style={{marginRight: '10px', display: 'inline-block', width: '178px'}}>{el2.name}</span>
                {/* <span style={{color: '#1890ff'}} onClick={() => {
                  setRoleVisible(true);
                  setSelectedAuth(el2.children);
                  const treeChild: any = [];
                  el2.auth.forEach((item: any) => {
                    treeChild.push({
                      title: item.title,
                      key: item.path,
                    })
                  })
                  setAuthSelect(treeChild)
                }}>添加权限</span> */}
              </p>
            );
            el2.children = [];
          })
        } else {
          el.title = (
            <p>
              <span style={{marginRight: '10px', display: 'inline-block', width: '200px'}}>{el.name}</span>
              {/* <span style={{color: '#1890ff'}} onClick={() => {
                setRoleVisible(true);
                setSelectedAuth(el.children);
                const treeChild: any = [];
                  el.auth.forEach((item: any) => {
                    treeChild.push({
                      title: item.title,
                      key: item.path,
                    })
                  })
                  setAuthSelect(treeChild)
              }}>添加权限</span> */}
            </p>
          )
        }
      })
    }
    setTreeData(arr)
  }

  const okHandle = async () => {
    console.log(resultCheckedKeys, '选择');
    handleAdd(resultCheckedKeys);
  };

  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeys: any) => {
    let arr: any = [...checkedKeys.checked];
    setCheckedKeys(arr);
    setResultCheckedKeys(arr);
  };

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeys);
  };

  // 设置权限
  const setRoleAuthData = (val: any) => {
    console.log(val)
  }

  useEffect(() => {
    // getTreeData();
  },[])

  return (
    <Modal
      width={800}
      destroyOnClose
      title="设置路由权限"
      visible={modalVisible}
      maskClosable= {false}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <Tree
        checkable
        checkStrictly={true}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={{checked: checkedKeys, halfChecked: []}}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
      {
        roleVisible ? (
          <AuthModal
            selected={selectedAuth}
            selectList={authSelect}
            modalVisible={roleVisible}
            onSubmit={async (val) => {
              setRoleAuthData(val);
              setRoleVisible(false);
            }}
            onCancel={ () => {
              setRoleVisible(false); 
            }}
          />
        ) : null
      }
    </Modal>
  );
};

export default RouteModal;
