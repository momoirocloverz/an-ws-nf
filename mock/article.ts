import { Request, Response } from 'express';

const data = [
  {
    id: 1,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 2,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 3,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 4,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 5,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 6,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 7,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 8,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 9,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 10,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 11,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  },
  {
    id: 12,
    title: '平湖市农业农村局公告',
    type: '1',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    time: '2020-5-11 10:12:54',
    status: '已发布',
    isShow: 1,
    isTop: 0,
    browseCount: 180,
    shareCount: 30,
    createTime: '2020-5-11 10:12:54'
  }
];

export default {
 'POST /api/article/list': (req: Request, res: Response) => {
    res.send({
      error: 0,
      data: data,
      pagination: {
        item_total: 20,
        page: 1,
        page_count: 20,
        page_total: 1,
      }
    });
  },
};
