import { Request, Response } from 'express';

const data = [
  {
    id: 1,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 2,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 3,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 4,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 5,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 6,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 7,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 8,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 9,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 10,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 11,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  },
  {
    id: 12,
    type: '经作类',
    content: '水稻怎么种植？',
    person: '李玉刚',
    image: 'https://img.hzanchu.com/acimg/a1b39343e3ef71b00719854d8a982805.png?x-oss-process=image/resize,l_300',
    askTime: '2018-08-31 14:26:52',
    browseNum: 120,
    shareNum: 2,
    answerNum: 32
  }
];

export default {
 'POST /api/question/list': (req: Request, res: Response) => {
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
