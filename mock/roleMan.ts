import { Request, Response } from 'express';

const data = [
  {
    id: 1,
    code: 'admin',
    role_name: '平台管理员',
    desc: '平台管理员',
    authority: 0,
    operation: 0,
  },
  {
    id: 2,
    code: 'yunying',
    role_name: '运营管理员',
    desc: '运营管理人员',
    authority: 1,
    operation: 1,
  },
  {
    id: 3,
    code: 'nongyenogcunju',
    role_name: '信息员',
    desc: '信息员',
    authority: 1,
    operation: 0,
  },
  {
    id: 4,
    code: 'xinxiyuan',
    role_name: '村级信息员',
    desc: '村级信息员',
    authority: 0,
    operation: 1,
  },
];

export default {
 'POST /api/role/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: data,
      pagination: {
        item_total: 5,
        page: 1,
        page_count: "10",
        page_total: 1,
      }
    });
  },
};
