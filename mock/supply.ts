import { Request, Response } from 'express';

const data = [
  {
    id: 1,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 2,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 3,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 4,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 5,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 6,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 7,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 8,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 9,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 10,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  },
  {
    id: 11,
    person: '张海峰',
    type: '1',
    classification: '种植培训',
    title: '小胖',
    content: '发布发布发布发布',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    price: 10.0,
    address: 'anchu',
    phone: '13252278328',
    shareCount: 10,
    time: '2020-5-11 10:12:54'
  }
];

export default {
 'POST /api/supply/list': (req: Request, res: Response) => {
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
