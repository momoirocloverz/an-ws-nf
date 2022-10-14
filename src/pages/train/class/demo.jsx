import React, { Component } from 'react';
import { getAliYunJudge } from '@/services/train';

let aLiUpload = {};
class Demo extends Component {
  constructor (props) {
    super(props);
    this.change = this.change.bind(this);
    this.aliyun = this.aliyun.bind(this);
    this.getVideoAuth = this.getVideoAuth.bind(this);
  }

  componentWillMount() {
    // if (!document.getElementById('isAliyun')) {
    //   var aliyun3 = document.createElement('script')
    //   var aliyun1 = document.createElement('script')
    //   var aliyun2 = document.createElement('script')
    //   aliyun3.src = '/src/assets/js/es6-promise.min.js'
    //   aliyun1.id = 'isAliyun'
    //   aliyun1.src = '/src/assets/js/aliyun-oss-sdk-5.3.1.min.js'
    //   aliyun2.src = '/src/assets/js/aliyun-upload-sdk-1.5.0.min.js'
    //   document.body.appendChild(aliyun3)
    //   document.body.appendChild(aliyun1)
    //   document.body.appendChild(aliyun2)
    // }
  }

  change(event) {
    if (document.getElementById('files').value) {
      this.getVideoAuth(event.target.files[0])
    }
  }

  async aliyun(obj) {
    aLiUpload = new AliyunUpload.Vod({
      // userId: "257923421530289796",
      // 开始上传
      'onUploadstarted': function(uploadInfo) {
        console.log(uploadInfo)
        aLiUpload.setUploadAuthAndAddress(uploadInfo, obj.UploadAuth, obj.UploadAddress)
      },
      // 文件上传成功
      'onUploadSucceed': function(uploadInfo) {
        console.log(uploadInfo)
      },
      // 文件上传失败
      'onUploadFailed': function(uploadInfo, code, message) {
        console.log(message)
      },
      // 文件上传进度，单位：字节
      'onUploadProgress': function(uploadInfo, totalSize, loadedPercent) {
        console.log(loadedPercent)
      },
      // 上传凭证超时
      'onUploadTokenExpired': function() {
        // 上传方式1  实现时，从新获取UploadAuth
        aLiUpload.resumeUploadWithAuth(obj.UploadAuth)
      }
    });
  }

  async getVideoAuth(value) {
    const _this = this;
    const result = {
      title: value.name.split('.')[0],
      file_name: value.name
    };
    const _data = await getAliYunJudge(result);
    if (_data.code === 0) {
      const userData = '{"Vod":{"Title":"this is video.","CateId":"234"}}';
      await _this.aliyun(_data.data);
      aLiUpload.addFile(value, null, null, null, userData);
      aLiUpload.startUpload();
    };
  }

  render() {

    return (
      <div>
        <input type="file" name="file" id="files" onChange={this.change} />
      </div>
    )
  }
};

export default Demo;
