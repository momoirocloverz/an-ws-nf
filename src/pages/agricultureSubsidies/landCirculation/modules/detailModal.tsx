import {Modal} from "antd";
import LandCirculationDetail from "@/pages/agricultureSubsidies/landCirculationDetail";

type Context = {
  action: 'create' | 'modify';
  id: number;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

function DetailModal({ context, visible, onCancel, onSuccess }: PropType) {
  return (
    <Modal
      title="土地流转详情"
      visible={visible}
      width={1200}
      onCancel={onCancel}
      onOk={onCancel}
      destroyOnClose
    >
      <LandCirculationDetail
        context={context}
      />
    </Modal>
  )
}
export default DetailModal;
