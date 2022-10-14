"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var pro_table_1 = require("@ant-design/pro-table");
var antd_1 = require("antd");
var pro_layout_1 = require("@ant-design/pro-layout");
var utils_1 = require("@/utils/utils");
var icons_1 = require("@ant-design/icons");
var operationCanter_1 = require("@/services/operationCanter");
var umi_1 = require("umi");
var react_draft_wysiwyg_1 = require("react-draft-wysiwyg");
var draft_js_1 = require("draft-js");
var html_to_draftjs_1 = require("html-to-draftjs");
var ButtonAuth_1 = require("@/components/ButtonAuth");
var style_less_1 = require("../style.less");
require("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
require("../components/edit.css");
var Option = antd_1.Select.Option;
var RangePicker = antd_1.DatePicker.RangePicker;
var confirm = antd_1.Modal.confirm;
var transformHtmlToDraftState = function (html) {
    if (html === void 0) { html = ''; }
    var blocksFromHtml = html_to_draftjs_1["default"](html);
    var contentBlocks = blocksFromHtml.contentBlocks, entityMap = blocksFromHtml.entityMap;
    var contentState = draft_js_1.ContentState.createFromBlockArray(contentBlocks, entityMap);
    return draft_js_1.EditorState.createWithContent(contentState);
};
var Epidemic = function (props) {
    var columns = [
        {
            key: 'ID',
            dataIndex: 'ID',
            title: 'ID',
            width: 60,
            hideInSearch: true
        },
        {
            key: 'title',
            dataIndex: 'title',
            title: '标题',
            align: 'center'
        },
        {
            key: 'classify',
            dataIndex: 'classify',
            title: '分类',
            align: 'center',
            renderFormItem: function (_, record) {
                return (react_1["default"].createElement(antd_1.Select, { placeholder: "\u8BF7\u9009\u62E9\u5206\u7C7B" },
                    react_1["default"].createElement(Option, { value: 1 }, "\u6743\u5A01\u53D1\u5E03"),
                    react_1["default"].createElement(Option, { value: 2 }, "\u9632\u75AB\u5DE5\u4F5C"),
                    react_1["default"].createElement(Option, { value: 3 }, "\u9632\u75AB\u79D1\u666E")));
            }
        },
        {
            key: 'cover',
            dataIndex: 'cover',
            title: '封面',
            hideInSearch: true,
            align: 'center'
        },
        {
            key: 'publicPerson',
            dataIndex: 'publicPerson',
            title: '发布人员',
            hideInSearch: true,
            align: 'center'
        },
        {
            key: 'publicTime',
            dataIndex: 'publicTime',
            title: '发布时间',
            align: 'center',
            renderFormItem: function () {
                return (react_1["default"].createElement(RangePicker, { showTime: true }));
            }
        },
        {
            key: 'publicStatus',
            dataIndex: 'publicStatus',
            title: '发布状态',
            hideInSearch: true,
            align: 'center',
            render: function () { return '已发布'; }
        },
        {
            key: 'options',
            dataIndex: 'options',
            title: '操作',
            width: 100,
            fixed: 'right',
            hideInSearch: true,
            align: 'center',
            render: function () {
                return (react_1["default"].createElement("div", { className: style_less_1["default"].epidemicOptions },
                    react_1["default"].createElement("a", null, "\u9884\u89C8"),
                    react_1["default"].createElement("a", null, "\u7F16\u8F91"),
                    react_1["default"].createElement("a", { className: style_less_1["default"].epidemicDelete, onClick: function () { return handleDelete(); } }, "\u5220\u9664"),
                    react_1["default"].createElement("a", null, "\u7F6E\u9876")));
            }
        }
    ];
    // 删除
    var handleDelete = function () {
        confirm({
            title: '删除',
            icon: react_1["default"].createElement(icons_1.ExclamationCircleOutlined, null),
            content: '您确定要删除该条信息?',
            okText: '确定',
            cancelText: '取消',
            onOk: function () {
                console.log('OK');
            },
            onCancel: function () {
                console.log('Cancel');
            }
        });
    };
    var getEpidemicList = function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var _data, datas, data;
        return __generator(this, function (_a) {
            _data = [{
                    key: 1,
                    ID: 1,
                    title: '赵家村哈哈哈',
                    classify: '权威发布',
                    cover: '呵呵呵和',
                    publicPerson: '谷哈哈',
                    publicTime: '2020-10-20 12:30:30'
                }];
            datas = {
                code: 0,
                data: {
                    data: _data,
                    current_page: 1,
                    total: 20
                }
            };
            data = datas;
            return [2 /*return*/, utils_1.tableDataHandle(data)];
        });
    }); };
    var _a = react_1.useState(''), imageUrl = _a[0], setImageUrl = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(false), loadingVideo = _c[0], setLoadingVideo = _c[1];
    var _d = react_1.useState(transformHtmlToDraftState()), editorState = _d[0], setEditorState = _d[1];
    var FormLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };
    var uploadButton = (react_1["default"].createElement("div", null,
        loading ? react_1["default"].createElement(icons_1.LoadingOutlined, null) : react_1["default"].createElement(icons_1.UploadOutlined, null),
        react_1["default"].createElement("div", { style: { marginTop: 8 } }, "\u70B9\u51FB\u4E0A\u4F20")));
    var uploadButtonVideo = (react_1["default"].createElement("div", null,
        loadingVideo ? react_1["default"].createElement(icons_1.LoadingOutlined, null) : react_1["default"].createElement(icons_1.UploadOutlined, null),
        react_1["default"].createElement("div", { style: { marginTop: 8 } }, "\u70B9\u51FB\u4E0A\u4F20")));
    var uploadImageCallBack = function (file) { return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var _data, _url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, operationCanter_1.uploadEditorImg({ 'file': file })];
                case 1:
                    _data = _a.sent();
                    _url = '';
                    if (_data.code === 0) {
                        _url = _data.data && _data.data.url || '';
                    }
                    resolve({
                        data: {
                            link: _url
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); }); };
    var onEditorStateChange = function (editorState) {
        setEditorState(editorState);
    };
    return (react_1["default"].createElement(pro_layout_1.PageHeaderWrapper, null,
        react_1["default"].createElement(pro_table_1["default"], { headerTitle: "", columns: columns, options: false, tableAlertRender: false, scroll: { x: 1500 }, rowKey: "article_id", toolBarRender: function (action, _a) {
                var selectedRows = _a.selectedRows;
                return [
                    react_1["default"].createElement(ButtonAuth_1["default"], { type: "CREATE" },
                        react_1["default"].createElement(antd_1.Button, { icon: react_1["default"].createElement(icons_1.PlusOutlined, null), type: "primary" }, "\u65B0\u5EFA\u6587\u7AE0"))
                ];
            }, pagination: {
                position: ['bottomCenter'],
                showQuickJumper: true,
                defaultCurrent: 1,
                pageSize: 10,
                size: 'default'
            }, request: function (params) { return getEpidemicList(params); } }),
        react_1["default"].createElement(antd_1.Modal, { visible: true, width: 900, title: "\u65B0\u5EFA" },
            react_1["default"].createElement(antd_1.Form, __assign({}, FormLayout, { className: style_less_1["default"].newForm }),
                react_1["default"].createElement(antd_1.Form.Item, { label: "\u5206\u7C7B", name: "classify", rules: [{ required: true }] },
                    react_1["default"].createElement(antd_1.Select, { placeholder: "\u8BF7\u9009\u62E9" },
                        react_1["default"].createElement(Option, { value: 1 }, "\u6743\u5A01\u53D1\u5E03"),
                        react_1["default"].createElement(Option, { value: 2 }, "\u9632\u75AB\u5DE5\u4F5C"),
                        react_1["default"].createElement(Option, { value: 3 }, "\u9632\u75AB\u79D1\u666E"))),
                react_1["default"].createElement(antd_1.Form.Item, { label: "\u79D1\u666E\u5206\u7C7B", name: "popular", rules: [{ required: true }] },
                    react_1["default"].createElement(antd_1.Select, { placeholder: "\u8BF7\u9009\u62E9" },
                        react_1["default"].createElement(Option, { value: 1 }, "\u79D1\u666E\u89C6\u9891"),
                        react_1["default"].createElement(Option, { value: 2 }, "\u79D1\u666E\u6587\u7AE0"))),
                react_1["default"].createElement(antd_1.Form.Item, { label: "\u6807\u9898", name: "title", rules: [{ required: true }] },
                    react_1["default"].createElement(antd_1.Input, { placeholder: "\u8BF7\u8F93\u5165" })),
                react_1["default"].createElement(antd_1.Form.Item, { label: "\u4E0A\u4F20\u5C01\u9762", name: "cover", rules: [{ required: true }] },
                    react_1["default"].createElement(antd_1.Upload, { accept: "image/jpg,image/jpeg,image/gif,image/png", name: "avatar", listType: "picture-card", className: "avatar-uploader", showUploadList: false, action: "https://www.mocky.io/v2/5cc8019d300000980a055e76" }, imageUrl ? react_1["default"].createElement("img", { src: imageUrl, alt: "avatar", style: { width: '100%' } }) : uploadButton)),
                react_1["default"].createElement(antd_1.Form.Item, { label: "\u4E0A\u4F20\u89C6\u9891", name: "video", rules: [{ required: true }] },
                    react_1["default"].createElement(antd_1.Upload, { accept: "video/*", name: "avatar", listType: "picture-card", className: "avatar-uploader", showUploadList: false, action: "https://www.mocky.io/v2/5cc8019d300000980a055e76" }, uploadButtonVideo)),
                react_1["default"].createElement(antd_1.Form.Item, { label: "\u6587\u7AE0\u5185\u5BB9", name: "content", rules: [{ required: true }] },
                    react_1["default"].createElement(react_draft_wysiwyg_1.Editor, { editorClassName: "demo-editor", editorState: editorState, onEditorStateChange: onEditorStateChange, localization: {
                            locale: 'zh'
                        }, toolbar: {
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                            image: {
                                uploadCallback: uploadImageCallBack,
                                alt: { present: true, previewImage: true },
                                previewImage: true
                            }
                        } }))))));
};
exports["default"] = umi_1.connect(function (_a) {
    var user = _a.user, info = _a.info;
    return ({
        accountInfo: user.accountInfo,
        areaList: info.areaList
    });
})(Epidemic);
