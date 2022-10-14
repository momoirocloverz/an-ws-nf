import React from 'react';
import { Image, Modal } from 'antd';
import styles from './DocumentPreviewModal.less';

type ImageObject = {
  url: string,
  id: number,
}

type PreviewContext = {
  documents: ImageObject[],
}

type PreviewModalProps = {
  visible: boolean,
  context: PreviewContext | null | {},
  mountedAt?: HTMLElement,
  cancelCb?: ()=>unknown,
  successCb?: ()=>unknown,
}

function PreviewModal({
  visible, context, cancelCb, successCb, mountedAt, // eslint-disable-line no-unused-vars
}: PreviewModalProps) {
  return (
    <Modal
      getContainer={mountedAt}
      visible={visible}
      getContainer={false}
      wrapClassName={styles.previewModalWrapper}
      onCancel={cancelCb}
      footer={false}
    >
      {context?.documents?.length > 0 ? (
        <div className={styles.previewContainer}>

          {context?.stuff_url?.map((d) => (
            <Image
              className={styles.documentImage}
              key={d.id}
              height={200}
              src={`${d.url}?x-oss-process=image/resize,s_200`}
              preview={{
                src: d.url,
              }}
              alt="材料图片"
            />
          ))}
        </div>
 ) : '无资料图片'}
    </Modal>
  );
}

PreviewModal.defaultProps = {
  cancelCb: () => {},
  successCb: () => {},
  mountedAt: window.document.body,
};

export default React.memo(PreviewModal);
