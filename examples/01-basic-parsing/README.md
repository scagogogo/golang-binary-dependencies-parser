# 01-基本解析示例

这个示例展示了如何使用 gobinaryparser 包解析 Go 二进制文件并显示其基本信息和依赖列表。

## 功能

- 解析 Go 二进制文件
- 显示主模块信息（路径和版本）
- 显示 Go 版本
- 列出前 10 个依赖及其版本
- 识别被替换(replace)的依赖

## 使用方法

```bash
go run main.go <Go二进制文件路径>
```

例如：

```bash
go run main.go /usr/local/bin/go
```

或者使用 Go 编译器：

```bash
go build -o parser
./parser /usr/local/bin/kubectl
```

## 输出示例

```
📦 Go 二进制文件依赖分析

文件: /usr/local/bin/kubectl
主模块: k8s.io/kubectl@v0.24.0
Go版本: go1.18.2

依赖数量: 157

前10个依赖:
1. github.com/Azure/go-ansiterm@v0.0.0-20210617225240-d185dfc1b5a1
2. github.com/MakeNowJust/heredoc@v0.0.0-20170808103936-bb23615498cd
3. github.com/davecgh/go-spew@v1.1.1
4. github.com/docker/distribution@v2.8.1+incompatible
   (被替换为 github.com/distribution/distribution@v2.8.1+incompatible)
5. github.com/spf13/cobra@v1.4.0
...和 147 个其他依赖
``` 