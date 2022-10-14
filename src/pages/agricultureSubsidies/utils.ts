import { CascaderOptionType } from 'antd/es/cascader';
import JSZip from 'jszip';
import _ from 'lodash';
import moment from 'moment';
import { history } from 'umi';
import {
  RawUploadedImageType,
  SimpleUploadedFileType,
  SubsidyUserAuthorizations,
} from '@/pages/agricultureSubsidies/types';
import { accAdd } from '@/utils/utils';

export function transformCategoryTree(source): CascaderOptionType[] {
  if (!source || source.length === 0) return [];
  const newTree: CascaderOptionType[] = [];
  source.forEach((e, i) => {
    newTree[i] = { value: e.id, label: e.scale_name, children: transformCategoryTree(e.children) };
  });
  return newTree;
}

export function resetEnum(source): any {
  if (!source || source.length === 0) return [];
  const obj = {};
  source.forEach(e => {
    obj[e.id] = {
      text: e.scale_name,
      disabled: e.is_open === 2 ? false : true
    }
  })
  return obj
}

export function muToSqMeters(size: number, precision = 2): number {
  return _.round(size * 666.667, precision);
}

export function sqMetersToMu(size: number, precision = 2): number {
  return _.round(size / 666.667, precision);
}

export function downloadAs(stream, name, MIMEType) {
  if (stream && name) {
    const blob = new Blob([stream], {
      type: MIMEType,
    });
    const elink = document.createElement('a');
    elink.href = URL.createObjectURL(blob);
    elink.download = name;
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  }
}

export async function downloadDocumentsAsZipFile(record) {
  const zip = new JSZip();
  const files: Promise<any>[] = [];

  record.documents.forEach((d, i) => {
    files[i] = (fetch(d.url).then((r) => r.blob()));
  });
  const results = await Promise.all(files);
  results.forEach((file, i) => {
    let nameData = record.documents[i],name='9';
    console.log(typeof nameData)
    if(typeof nameData === 'string'){
      name = `${_.last(record.documents[i].split('/')).split('-rc-upload')[0]}.${_.last(record.documents[i].split('.'))}`
    }else{
      name = `${_.last(record.documents[i].url.split('/')).split('-rc-upload')[0]}.${_.last(record.documents[i].url.split('.'))}`
    }

    // @ts-ignore
    zip.file(name, file, { base64: true });
  });
  return zip.generateAsync({ type: 'blob' }).then((content) => {
    downloadAs(
      content,
      `${record.createdAt}${record.contractor}申报的${record.category}的资料.zip`,
      'Application/x-zip-compressed',
    );
  });
}

export function findAuthorizationsByPath(list, targetPath) {
  return list?.[list?.map((o) => o.path).indexOf(targetPath)]?.permission ?? [];
}

export function redirectToFarmlandMap() {
  history.replace('/agriculture-subsidies/farmland-map');
}

// 只有春季和秋季
export function getCurrentSeason() {
  const quarter = moment().quarter();
  return Math.ceil(quarter / 2).toString();
}

export function transformUploadedImageData(received: (RawUploadedImageType | undefined | null)[]): SimpleUploadedFileType[] {
  if (Array.isArray(received)) {
    return received?.filter((image) => (image && (image.id !== undefined))).map((image) => ({ uid: image.id, url: image.url })) ?? [];
  }
  return [];
}

export function findRegionNames(tree, path) {
  if (!path || path.length === 0) {
    return [];
  }
  const [current, ...next] = path;
  const idx = tree.map((node) => (node.value.toString())).indexOf(current?.toString());
  if (idx >= 0) {
    return [tree[idx].label].concat(findRegionNames(tree[idx].children ?? [], next));
  }
  return [];
}

export function validateCascaderValue(user, userAuthorizations: SubsidyUserAuthorizations, value) {
  if (userAuthorizations.isCityOfficial) {
    return value;
  }
  if (userAuthorizations.isTownOfficial) {
    value.splice(0, 2, user.city_id, user.town_id);
    return value;
  }
  return value;
}

export function traverseTree(tree: any[], path: any[], nodeKey: string, targetProp: string): any[] {
  if (!path || path.length === 0) {
    return [];
  }
  const [current, ...next] = path;
  const idx = tree.map((node) => (node[nodeKey]?.toString())).indexOf(current?.toString());
  if (idx >= 0) {
    return [tree[idx][targetProp]].concat(traverseTree(tree[idx].children ?? [], next, nodeKey, targetProp));
  }
  return [];
}

export function geoJSONNullCheck(v) {
  return v === 'null' ? null : v;
}

export function flatten(source) {
  let flattened: any[] = [];
  source.forEach((e) => {
    if (Array.isArray(e) && Array.isArray(e[0])) {
      flattened = flattened.concat(flatten(e));
    } else {
      flattened.push(e);
    }
  });
  return flattened;
}
export function findPolygonType(coordinates: any[]) {
  if (!coordinates || !Array.isArray(coordinates)) throw new Error('invalid');
  if (coordinates.length > 1 && coordinates[0].length === 1) {
    return 'MultiPolygon';
  }
  return 'Polygon';
}

export function clearDefaultDatetimeFormat(datetime: string): string {
  if (typeof datetime === 'string' && datetime.startsWith('0000')) {
    return '--';
  }
  return datetime;
}

export function populatePathDict(dict: Map<string, any[]>, node, targetProp, options = {}, path: any[] = []) {
  if (!node || !dict) {
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((e) => {
      populatePathDict(dict, e, targetProp, options, path);
    });
  } else {
    node[targetProp] && dict.set(node[targetProp].toString(), [...path, node[targetProp]]);
    node[options.childPropName ?? 'children']?.forEach((child) => {
      populatePathDict(dict, child, targetProp, options, [...path, node[targetProp]]);
    });
  }
}

type CellRendererOptions = {
  emptySymbol?: string;
  sourceSeparator?: string; // FIXME: non-leaf nodes
  targetSeparator?: string; // FIXME: non-leaf nodes
  enum?: Record<any, any>;
  dict: Map<any, any>;
}
export function renderCell(record: Record<any, any>, field: string, operation: 'sum' | 'unique' | 'nop' | 'pickFirst' | 'ancestors', options?: CellRendererOptions) {
  let renderedValue: any = record[field];
  if (options?.enum) {
    renderedValue = options.enum[renderedValue];
  }
  if (Array.isArray(record.children) && record.children.length) {
    switch (operation) {
      case 'sum':
        renderedValue = record.children.reduce((c, e) => (accAdd(c, (e[field] || 0))), 0);
        break;
      case 'unique': {
        const valueSet = new Set();
        record.children.forEach((c) => {
          c[field]?.toString().split(options?.sourceSeparator ?? ',').forEach((el) => {
            valueSet.add(el.trim());
          });
        });
        let values = Array.from(valueSet);
        if (options?.enum) {
          values = values.map((e) => (options.enum[e]));
        }
        renderedValue = values.join(options?.targetSeparator ?? ',');
        break;
      }
      case 'nop':
        break;
      case 'pickFirst':
        renderedValue = record.children[0][field];
        if (options?.enum) {
          renderedValue = options.enum[renderedValue];
        }
        break;
      case 'ancestors': {
        const valueSet = new Set();
        record.children.forEach((c) => {
          c[field]?.toString().split(options?.sourceSeparator ?? ',').forEach((el) => {
            const path = options?.dict.get(el.trim())
            path?.[path?.length - 2] && valueSet.add(path[path.length - 2]);
          });
        });
        let values = Array.from(valueSet);
        if (options?.enum) {
          values = values.map((e) => (options.enum[e]));
        }
        renderedValue = values.join(options?.targetSeparator ?? ',');
        break;
      }
      default: renderedValue = '未知操作';
    }
  }
  return options?.emptySymbol ? (renderedValue || options.emptySymbol) : renderedValue;
}
//
// function baseOperation(children, field, operation, options){
//   let renderedValue;
//   switch (operation) {
//     case 'sum':
//       renderedValue = children.reduce((c, e) => (c + e[field]), 0);
//       break;
//     case 'unique': {
//       const valueSet = new Set();
//       children.forEach((c) => {
//         c[field]?.toString().split(options?.sourceSeparator ?? ',').forEach((el) => {
//           valueSet.add(el.trim());
//         });
//       });
//       let values = Array.from(valueSet);
//       if (options?.enum) {
//         values = values.map((e) => (options.enum[e]));
//       }
//       renderedValue = values.join(options?.targetSeparator ?? ',');
//       break;
//     }
//     case 'nop':
//       break;
//     case 'pickFirst':
//       renderedValue = children[0][field];
//       if (options?.enum) {
//         renderedValue = options.enum[renderedValue];
//       }
//       break;
//     default: renderedValue = '未知操作';
//   }
//   return renderedValue;
// }

export function transformTreeData(data, specialAttributes, idFields, baseTransform, childField, level = 0) {
  if (Array.isArray(data[childField]) && data[childField].length) {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const [first, ...restIds] = idFields;
    const children = data[childField].map((child) => transformTreeData(child, specialAttributes, restIds, baseTransform, childField, level + 1));
    if (children.length > 1) {
      const baseData = { ...data };
      delete baseData[childField];
      const transformed = baseTransform(baseData, idFields[0] ?? 'id', level);
      transformed.children = children;
      specialAttributes.forEach((attr) => {
        transformed[attr.name] = renderCell(transformed, attr.name, attr.op, attr.options);
      });
      console.debug(transformed);
      return transformed;
    }
    return children[0];
  }
  return baseTransform(data, idFields[0] ?? 'id', level);
}
