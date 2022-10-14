import { MenuDataItem } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import { StateType } from './login';
import { SystemType } from './system';
import { InfoModelState } from './info';
import { TrainModal } from './train';
export { GlobalModelState, SettingModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  login: StateType;
  system: SystemType;
  info: InfoModelState;
  train: TrainModal;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

export interface paginationType {
  item_total: string | number;
  page: string | number;
  page_count: string | number;
  page_total: string | number;
} 
