# 复旦研究生评教助手

一个用于自动填充复旦大学研究生课程评教表单的油猴脚本。

## 功能特点

- **一键完成全部**：自动遍历所有未评教课程，选择"完全同意"并提交
- **填充当前表单**：单独填充当前评教表单的所有选项
- **中文界面**：简洁的浮动控制面板
- **智能检测**：自动识别课程卡片和表单元素

## 安装方法

### 前置条件

安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展：
- [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 安装脚本

1. 点击 Tampermonkey 图标 → "添加新脚本"
2. 删除编辑器中的所有内容
3. 复制 `FudanEvaluation.user.js` 的全部内容并粘贴
4. 按 `Ctrl+S` 保存

## 使用方法

1. 登录复旦大学研究生评教系统：
   ```
   https://yzsfwapp.fudan.edu.cn/gsapp/sys/wspjappfudan/*default/index.do
   ```

2. 页面右侧会出现控制面板

3. **按钮功能**：
   | 按钮 | 功能 |
   |------|------|
   | 自动完成全部 | 自动处理所有未评教课程（推荐） |
   | 填充当前 | 填充当前表单的所有选项 |
   | 关闭面板 | 隐藏控制面板 |

## 使用流程

### 推荐：自动完成全部
1. 在课程列表页面点击"**自动完成全部**"
2. 脚本会自动：
   - 点击每门未评教课程
   - 选择所有"完全同意"选项
   - 点击提交并确认
   - 进入下一门课程
3. 完成后弹出提示

### 手动：逐个评教
1. 点击一门"未评教"课程进入表单
2. 点击"**填充当前**"选择所有选项
3. 手动点击"提交"按钮
4. 在确认对话框中点击"确定"

## 配置选项

如需调整延迟时间，修改脚本开头的配置：

```javascript
const CONFIG = {
    CLICK_DELAY: 100,          // 每个选项点击间隔 (ms)
    FILL_COMPLETE_DELAY: 2000, // 填充完成后等待 (ms)
    SUBMIT_DELAY: 800,         // 提交后等待 (ms)
    CONFIRM_DELAY: 1000,       // 确认对话框等待 (ms)
    NEXT_COURSE_DELAY: 1500,   // 下一门课前等待 (ms)
    PAGE_LOAD_DELAY: 2000,     // 页面加载等待 (ms)
    DEBUG: true                // 显示调试日志
};
```

## 常见问题

### 脚本没有加载
- 确保 Tampermonkey 已启用
- 刷新页面

### 自动完成中途停止
- 可能是网络延迟，尝试增加 `PAGE_LOAD_DELAY` 值
- 查看控制台日志（F12 → Console）

### 选项没有全部选中
- 增加 `FILL_COMPLETE_DELAY` 值
- 增加 `CLICK_DELAY` 值

## 技术信息

- **目标URL**：`https://yzsfwapp.fudan.edu.cn/gsapp/sys/wspjappfudan/*`
- **开发语言**：JavaScript (ES6+)
- **依赖**：无

## 更新日志

### v1.5 (2026-01-02)
- 简化UI：调整按钮顺序，移除"提交当前"按钮

### v1.4
- 增加填充和提交之间的等待时间

### v1.3
- 修复确认对话框和提交按钮选择器

### v1.2
- 修复课程卡片检测

### v1.1
- 界面改为中文

### v1.0
- 初始版本

## 免责声明

本脚本仅供学习交流使用，请自行承担使用风险。

## 许可证

MIT License
