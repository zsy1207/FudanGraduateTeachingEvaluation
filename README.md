# 复旦研究生评教助手

一个用于自动填充复旦大学研究生课程评教表单的油猴脚本。

## 功能特点

- **一键填充**：自动选择当前表单所有题目的"完全同意"选项
- **自动完成全部**：自动遍历所有未评教课程并完成评教
- **中文界面**：浮动控制面板，操作简单直观
- **智能检测**：多种备选方法检测页面元素，兼容性强

## 安装方法

### 前置条件

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展：
   - [Chrome 网上应用店](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox 附加组件](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge 外接程序](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 安装脚本

1. 点击浏览器中的 Tampermonkey 图标
2. 选择"添加新脚本"
3. 删除编辑器中的所有内容
4. 复制 `FudanEvaluation.user.js` 文件的全部内容并粘贴
5. 按 `Ctrl+S` 或点击"文件 > 保存"

## 使用方法

1. 登录复旦大学研究生评教系统：
   ```
   https://yzsfwapp.fudan.edu.cn/gsapp/sys/wspjappfudan/*default/index.do
   ```

2. 使用学生账号登录

3. 页面右侧会出现紫色的浮动控制面板

4. **按钮功能**：
   - **填充当前 (完全同意)**：将当前评教表单的所有问题选择"完全同意"
   - **自动完成全部**：自动处理所有未评教的课程
   - **提交当前**：提交当前评教表单
   - **关闭面板**：隐藏控制面板

## 使用流程

### 方式一：手动逐个评教
1. 在课程列表页点击一门"未评教"课程
2. 等待评教表单加载
3. 点击"**填充当前 (完全同意)**"
4. 点击"**提交当前**"
5. 在弹出的确认框中点击"确定"
6. 重复以上步骤

### 方式二：自动完成全部（推荐）
1. 在课程列表页面
2. 点击"**自动完成全部**"
3. 脚本会自动完成所有未评教课程
4. 完成后会弹出提示

## 配置选项

如需调整，可以修改脚本开头的配置：

```javascript
const CONFIG = {
    CLICK_DELAY: 300,        // 点击间隔（毫秒）
    SUBMIT_DELAY: 500,       // 提交后等待（毫秒）
    NEXT_COURSE_DELAY: 1000, // 下一门课前等待（毫秒）
    PAGE_LOAD_DELAY: 1500,   // 页面加载等待（毫秒）
    AUTO_MODE: true,         // 是否启用自动模式
    DEBUG: true              // 是否显示控制台日志
};
```

## 常见问题

### 脚本没有加载

- 确保 Tampermonkey 扩展已启用
- 检查脚本在 Tampermonkey 面板中是否启用
- 安装后刷新页面

### 按钮点击无效

- 页面结构可能已更新
- 尝试增加 `PAGE_LOAD_DELAY` 配置值
- 按 F12 查看浏览器控制台是否有错误信息

### 表单未提交

- 确认所有必填项都已填写
- 检查是否有需要手动填写的文本框

## 技术信息

- **目标URL**：`https://yzsfwapp.fudan.edu.cn/gsapp/sys/wspjappfudan/*`
- **开发框架**：原生 JavaScript (ES6+)
- **依赖项**：无（脚本独立运行）

## 更新日志

### v1.1 (2026-01-02)

- 界面文字改为中文
- 改进确认对话框处理逻辑
- 优化自动处理流程
- 增加错误重试机制

### v1.0 (2026-01-02)

- 初始版本
- 自动选择"完全同意"功能
- 自动处理所有课程功能
- 浮动控制面板

## 免责声明

本脚本仅供学习交流使用，请自行承担使用风险。作者不对使用本脚本产生的任何后果负责。

## 许可证

MIT License
