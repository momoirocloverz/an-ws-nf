import React, { useState } from 'react';
import './index.less';
import {
  Modal,
  Carousel
} from 'antd';

interface ImgProps {
  urlList: Array<any>,
}

const CarouselImg: React.FC<ImgProps> = (props) => {
  const { urlList } = props;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div>
      <img
        src={urlList[0]}
        alt="首张图片"
        style={{height: '100px', width: '100px', cursor: 'pointer', marginRight: '10px'}}
        onClick={() => {
          setModalVisible(true);
        }}
      />
      <span style={{fontSize: '12px', whiteSpace: 'nowrap'}}>{`共${urlList.length || 0}张`}</span>
      <Modal
        width={'50vw'}
        destroyOnClose
        getContainer={false}
        maskClosable= {false}
        title='图片浏览（点击可查看原图）'
        visible={modalVisible}
        footer={null}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <Carousel autoplay>
          {
            urlList.map((item: any, index: number) => {
              return (<div key={index}>
                <div className="img-box" onClick={()=> {
                  window.open(item);
                }}>
                  <img key={index} src={item} alt="商品图片" />
                </div>
              </div>)
            })
          }
        </Carousel>
      </Modal>
    </div>
  );
};


export default CarouselImg;
