# 02-依赖过滤示例

这个示例展示了如何使用 gobinaryparser 包的过滤功能来筛选特定类型的依赖。

## 功能

- 过滤标准库依赖：展示如何筛选出标准库的依赖
- 过滤第三方依赖：展示如何筛选出非标准库的依赖
- 过滤特定前缀的依赖：展示如何筛选出特定前缀（如 `github.com/`）的依赖
- 过滤被替换的依赖：展示如何筛选出被 `replace` 指令替换的依赖

## 使用方法

```bash
go run main.go <Go二进制文件路径>
```

例如：

```bash
go run main.go /usr/local/bin/go
```

## 输出示例

```
📦 Go 二进制文件依赖分析 - 过滤示例

文件: /usr/local/bin/kubectl
Go版本: go1.18.2
总依赖数量: 157

标准库依赖数量: 0

第三方依赖数量: 157

GitHub依赖数量: 102
GitHub依赖示例:
  - github.com/Azure/go-ansiterm@v0.0.0-20210617225240-d185dfc1b5a1
  - github.com/MakeNowJust/heredoc@v0.0.0-20170808103936-bb23615498cd
  - github.com/davecgh/go-spew@v1.1.1
  - github.com/docker/distribution@v2.8.1+incompatible
  - github.com/evanphx/json-patch@v4.12.0+incompatible

被替换的依赖数量: 3
被替换的依赖:
  - github.com/docker/distribution@v2.8.1+incompatible => github.com/distribution/distribution@v2.8.1+incompatible
  - github.com/googleapis/gnostic@v0.5.5 => github.com/google/gnostic@v0.5.5
  - gopkg.in/yaml.v3@v3.0.0 => gopkg.in/yaml.v3@v3.0.0-20210107192922-496545a6307b
```

## 技术说明

这个示例使用了几种不同的过滤方法：

1. 使用 `BinaryInfo.FilterDependencies()` 方法，传入自定义过滤函数
2. 使用 `gobinaryparser.IsStdLib()` 函数判断是否为标准库
3. 使用 `gobinaryparser.FilterStdLib()` 全局函数过滤非标准库依赖
4. 使用 `strings.HasPrefix()` 判断路径前缀
5. 检查 `DependencyInfo.Replace` 是否为 nil 判断依赖是否被替换 