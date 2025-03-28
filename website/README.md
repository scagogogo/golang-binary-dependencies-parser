# GoBinaryParser 官方网站

这是 GoBinaryParser 的官方网站，使用 React + TypeScript 构建。

## 目录结构

```
website/
├── public/            # 静态资源
├── src/               # 源代码
│   ├── components/    # 可复用组件
│   ├── pages/         # 页面组件
│   ├── assets/        # 图片、图标等资源
│   ├── App.tsx        # 主应用组件
│   └── index.tsx      # 入口文件
└── package.json       # 项目配置
```

## 开发

首先确保你已经安装了 Node.js 和 npm。然后运行以下命令启动开发服务器：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

开发服务器会在 http://localhost:3000 启动，并支持热重载。

## 构建

要构建生产版本的网站，运行：

```bash
npm run build
```

构建结果会输出到 `build` 目录中，可以部署到任何静态文件服务器上。

## 技术栈

- React 18
- TypeScript
- React Router
- Styled Components
- React Syntax Highlighter

## 贡献

欢迎提交 Pull Request 或创建 Issue 来改进网站。 