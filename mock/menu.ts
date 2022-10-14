import { Request, Response } from 'express';

interface MenuStateProps {
  menu_id: number;
  name: string;
  path?: string;
  router?: string;
  icon: string | Function;
  index: string;
  pid: number;
  created_at: string;
  is_deleted: number;
  is_group?: null;
  type: string;
  sort: number;
  children: Array<any>;
  key?: number;
  title: string;
}

const menuList: Array<MenuStateProps> = [
  {
    "menu_id": 1,
    "name": "首页",
    "path": "/index",
    "sort": 1,
    "router": "",
    "icon": "icon-all",
    "type": "一级",
    "title": '系统设置',
    "index": "1",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": []
  },
  {
    "menu_id": 2,
    "name": "系统设置",
    "path": "",
    "sort": 2,
    "router": "",
    "icon": "icon-all",
    "type": "一级",
    "title": '系统设置',
    "index": "2",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 333,
        "type": "二级",
        "sort": 1,
        "title": '账号管理',
        "name": "账号管理",
        "path": "/system/accountMan",
        "icon": "",
        "index": "2-1",
        "pid": 2,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
      {
        "menu_id": 314,
        "name": "角色管理",
        "title": '角色管理',
        "type": "二级",
        "path": "/system/roleMan",
        "icon": "",
        "sort": 2,
        "index": "2-2",
        "pid": 2,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
      {
        "menu_id": 324,
        "name": "导航管理",
        "title": '导航管理',
        "type": "二级",
        "sort": 3,
        "path": "/system/navMan",
        "icon": "",
        "index": "2-3",
        "pid": 2,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
    ]
  },
  {
    "menu_id": 3,
    "name": "运营中心",
    "title": '运营中心',
    "path": "",
    "type": "一级",
    "sort": 3,
    "icon": "icon-Customermanagement",
    "index": "3",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 325,
        "type": "二级",
        "title": 'Banner配置',
        "sort": 1,
        "name": "Banner配置",
        "path": "/operation/bannerConfig",
        "icon": "",
        "index": "3-1",
        "pid": 3,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      }
    ]
  },
  {
    "menu_id": 4,
    "name": "培训管理",
    "title": '培训管理',
    "path": "",
    "type": "一级",
    "sort": 4,
    "icon": "icon-Customermanagement",
    "index": "4",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 329,
        "type": "二级",
        "title": '课程管理',
        "sort": 1,
        "name": "课程管理",
        "path": "/train/class",
        "icon": "",
        "index": "4-1",
        "pid": 4,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null,
        perssion: ['', '']
      }
    ]
  },
  {
    "menu_id": 5,
    "name": "积分管理",
    "path": "",
    "sort": 5,
    "router": "",
    "icon": "icon-all",
    "type": "一级",
    "title": '积分管理',
    "index": "5",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 340,
        "type": "二级",
        "title": '善治分规则',
        "sort": 1,
        "name": "善治分规则",
        "path": "/integral/civilization",
        "icon": "",
        "index": "5-1",
        "pid": 5,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
      {
        "menu_id": 341,
        "type": "二级",
        "title": '家庭积分管理',
        "sort": 2,
        "name": "家庭积分管理",
        "path": "/integral/family",
        "icon": "",
        "index": "5-2",
        "pid": 5,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
      {
        "menu_id": 342,
        "type": "二级",
        "title": '打分项管理',
        "sort": 3,
        "name": "打分项管理",
        "path": "/integral/scoring",
        "icon": "",
        "index": "5-3",
        "pid": 5,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      }
    ]
  },
  {
    "menu_id": 6,
    "name": "问答管理",
    "title": '问答管理',
    "path": "/question",
    "type": "一级",
    "sort": 6,
    "icon": "icon-Customermanagement",
    "index": "6",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": []
  },
  {
    "menu_id": 7,
    "name": "供需管理",
    "title": '供需管理',
    "path": "/supply",
    "type": "一级",
    "sort": 7,
    "icon": "icon-Customermanagement",
    "index": "7",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": []
  },
  {
    "menu_id": 8,
    "name": "文章管理",
    "title": '文章管理',
    "path": "/article",
    "type": "一级",
    "sort": 8,
    "icon": "icon-Customermanagement",
    "index": "8",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": []
  },
  {
    "menu_id": 9,
    "name": "用户管理",
    "title": '文章管理',
    "path": "/customer",
    "type": "一级",
    "sort": 9,
    "icon": "icon-Customermanagement",
    "index": "0",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 402,
        "type": "二级",
        "title": '家庭分组',
        "sort": 1,
        "name": "家庭分组",
        "path": "/customer/family",
        "icon": "",
        "index": "0-10",
        "pid": 9,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
      {
        "menu_id": 403,
        "type": "二级",
        "title": '农户管理',
        "sort": 1,
        "name": "农户管理",
        "path": "/customer/farmer",
        "icon": "",
        "index": "0-10",
        "pid": 9,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
      {
        "menu_id": 404,
        "type": "二级",
        "title": '专家管理',
        "sort": 1,
        "name": "专家管理",
        "path": "/customer/master",
        "icon": "",
        "index": "0-10",
        "pid": 9,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
    ]
  },
];

// 全部导航
const menuListAll: Array<MenuStateProps> = [
  {
    "menu_id": 1,
    "name": "系统设置",
    "title": '系统设置',
    "path": "/system",
    "icon": "icon-shangpinzx",
    "index": "0",
    "pid": 0,
    "type": "一级",
    "key": 1,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "sort": 1,
    "children": [
      {
        "menu_id": 314,
        "name": "角色管理",
        "title": '角色管理',
        "sort": 1,
        "key": 11,
        "type": "二级",
        "path": "/system/roleMan",
        "icon": "",
        "index": "0-10",
        "pid": 1,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      }
    ]
  },
  {
    "menu_id": 2,
    "name": "测试路由",
    "title": '测试路由',
    "path": "/system",
    "sort": 2,
    "key": 2,
    "type": "一级",
    "icon": "icon-shangpinzx",
    "index": "0",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 315,
        "key": 21,
        "name": "账号管理",
        "title": '账号管理',
        "type": "二级",
        "path": "/system/accountMan",
        "icon": "",
        "sort": 1,
        "index": "0-10",
        "pid": 2,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      }
    ]
  },
  {
    "menu_id": 3,
    "name": "文章管理",
    "title": '文章管理',
    "type": "一级",
    "path": "/system",
    "icon": "icon-shangpinzx",
    "index": "0",
    "sort": 3,
    "key": 3,
    "pid": 0,
    "created_at": "2018-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 316,
        "type": "二级",
        "name": "新增文章",
        "title": '新增文章',
        "sort": 1,
        "key": 31,
        "path": "/system/accountMan",
        "icon": "",
        "index": "0-10",
        "pid": 3,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
      {
        "menu_id": 317,
        "name": "编辑文章",
        "title": '编辑文章',
        "sort": 2,
        "key": 32,
        "path": "/system/accountMan",
        "icon": "",
        "index": "0-10",
        "pid": 3,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null 
      }
    ]
  },
  {
    "menu_id": 5,
    "type": "一级",
    "name": "问答管理",
    "title": '问答管理',
    "path": "/system",
    "sort": 5,
    "key": 5,
    "icon": "icon-shangpinzx",
    "index": "0",
    "pid": 0,
    "created_at": "2018-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 346,
        "type": "二级",
        "key": 346,
        "name": "查看详情",
        "title": '查看详情',
        "sort": 1,
        "path": "/system/accountMan",
        "icon": "",
        "index": "0-10",
        "pid": 5,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
    ]
  },
  {
    "menu_id": 6,
    "name": "培训管理",
    "title": '培训管理', 
    "type": "一级",
    "sort": 6,
    "key": 6,
    "path": "/system",
    "icon": "icon-shangpinzx",
    "index": "0",
    "pid": 0,
    "created_at": "2018-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 346,
        "key": 346,
        "sort": 1,
        "type": "二级",
        "name": "课程管理",
        "title": '课程管理', 
        "path": "/system/accountMan",
        "icon": "",
        "index": "0-10",
        "pid": 6,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null
      },
    ]
  }
];

const navList: Array<MenuStateProps> = [
  {
    "menu_id": 1,
    "name": "系统设置",
    "title": '系统设置',
    "path": "/system",
    "icon": "icon-shangpinzx",
    "index": "0",
    "pid": 0,
    "type": "一级",
    "key": 1,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "sort": 1,
    "children": [
      {
        "menu_id": 314,
        "name": "角色管理",
        "title": '角色管理',
        "sort": 1,
        "key": 11,
        "type": "二级",
        "path": "/system/roleMan",
        "icon": "",
        "index": "0-10",
        "pid": 1,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null,
        "children": [
          {
            id: 1,
            name: '搜索 icon',
            sort: 1,
            key: 1,
            type: "按钮",
          }, 
          {
            id: 2,
            name: '新建 icon',
            sort: 2,
            key: 2,
            type: "按钮",
          },
          {
            id: 3,
            name: '删除 icon',
            sort: 3,
            key: 3,
            type: "按钮",
          }
        ]
      }
    ]
  },
  {
    "menu_id": 2,
    "name": "测试路由",
    "title": '测试路由',
    "path": "/system",
    "sort": 2,
    "key": 2,
    "type": "一级",
    "icon": "icon-shangpinzx",
    "index": "0",
    "pid": 0,
    "created_at": "2017-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 315,
        "key": 21,
        "name": "账号管理",
        "title": '账号管理',
        "type": "二级",
        "path": "/system/accountMan",
        "icon": "",
        "sort": 1,
        "index": "0-10",
        "pid": 2,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null,
        "children": [
          {
            id: 1,
            name: '搜索 icon',
            sort: 1,
            key: 1,
            type: "按钮",
          }, 
          {
            id: 2,
            name: '新建 icon',
            sort: 2,
            key: 2,
            type: "按钮",
          },
          {
            id: 3,
            name: '删除 icon',
            sort: 3,
            key: 3,
            type: "按钮",
          }
        ]
      }
    ]
  },
  {
    "menu_id": 3,
    "name": "文章管理",
    "title": '文章管理',
    "type": "一级",
    "path": "/system",
    "icon": "icon-shangpinzx",
    "index": "0",
    "sort": 3,
    "key": 3,
    "pid": 0,
    "created_at": "2018-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 316,
        "type": "二级",
        "name": "新增文章",
        "title": '新增文章',
        "sort": 1,
        "key": 31,
        "path": "/system/accountMan",
        "icon": "",
        "index": "0-10",
        "pid": 3,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null,
        "children": [
          {
            id: 1,
            name: '搜索 icon',
            sort: 1,
            key: 1,
            type: "按钮",
          }, 
          {
            id: 2,
            name: '新建 icon',
            sort: 2,
            key: 2,
            type: "按钮",
          },
          {
            id: 3,
            name: '删除 icon',
            sort: 3,
            key: 3,
            type: "按钮",
          }
        ]
      },
      {
        "menu_id": 317,
        "name": "编辑文章",
        "title": '编辑文章',
        "sort": 2,
        "key": 32,
        "path": "/system/accountMan",
        "icon": "",
        "index": "0-10",
        "pid": 3,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null,
        "children": [
          {
            id: 1,
            name: '搜索 icon',
            sort: 1,
            key: 1,
            type: "按钮",
          }, 
          {
            id: 2,
            name: '新建 icon',
            sort: 2,
            key: 2,
            type: "按钮",
          },
          {
            id: 3,
            name: '删除 icon',
            sort: 3,
            key: 3,
            type: "按钮",
          }
        ]
      }
    ]
  },
  {
    "menu_id": 4,
    "type": "一级",
    "name": "问答管理",
    "title": '问答管理',
    "path": "/system",
    "sort": 4,
    "key": 4,
    "icon": "icon-shangpinzx",
    "index": "0",
    "pid": 0,
    "created_at": "2018-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 346,
        "type": "二级",
        "key": 41,
        "name": "查看详情",
        "title": '查看详情',
        "sort": 1,
        "path": "/system/accountMan",
        "icon": "",
        "index": "0-10",
        "pid": 4,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null,
        "children": [
          {
            id: 1,
            name: '搜索 icon',
            sort: 1,
            key: 1,
            type: "按钮",
          }, 
          {
            id: 2,
            name: '新建 icon',
            sort: 2,
            key: 2,
            type: "按钮",
          },
          {
            id: 3,
            name: '删除 icon',
            sort: 3,
            key: 3,
            type: "按钮",
          }
        ]
      },
    ]
  },
  {
    "menu_id": 5,
    "name": "培训管理",
    "title": '培训管理', 
    "type": "一级",
    "sort": 5,
    "key": 5,
    "path": "/system",
    "icon": "icon-shangpinzx",
    "index": "0",
    "pid": 0,
    "created_at": "2018-12-27 14:32:34",
    "is_deleted": 0,
    "is_group": null,
    "children": [
      {
        "menu_id": 346,
        "key": 51,
        "sort": 1,
        "type": "二级",
        "name": "课程管理",
        "title": '课程管理', 
        "path": "/system/accountMan",
        "icon": "",
        "index": "0-10",
        "pid": 5,
        "created_at": "2019-11-15 15:04:45",
        "is_deleted": 0,
        "is_group": null,
        "children": [
          {
            id: 1,
            name: '搜索 icon',
            sort: 1,
            key: 1,
            type: "按钮",
          }, 
          {
            id: 2,
            name: '新建 icon',
            sort: 2,
            key: 2,
            type: "按钮",
          },
          {
            id: 3,
            name: '删除 icon',
            sort: 3,
            key: 3,
            type: "按钮",
          }
        ]
      },
    ]
  }
];

export default {
 'POST /api/menu/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: { auth_menu_list: menuList },
    });
  },

  'POST /api/allMenu/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: menuListAll,
    });
  },

  'POST /api/nav/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: navList,
    });
  },
};
