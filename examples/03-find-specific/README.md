# 03-查找特定依赖示例

这个示例展示了如何使用 gobinaryparser 包查找 Go 二进制文件中的特定依赖。

## 功能

- 精确匹配：使用 `GetDependencyByPath` 方法查找完全匹配的依赖
- 模糊匹配：使用 `FilterDependencies` 方法和 `strings.Contains` 查找包含特定字符串的依赖
- 版本匹配：查找使用特定版本（如所有 v1.x 版本）的依赖

## 使用方法

```bash
go run main.go <依赖名称> <Go二进制文件路径>
```

例如：

```bash
go run main.go cobra /usr/local/bin/kubectl
```

这将搜索 kubectl 二进制文件中包含 "cobra" 的所有依赖。

## 输出示例

```
🔍 在二进制文件中查找依赖

文件: /usr/local/bin/kubectl
Go版本: go1.18.2
总依赖数量: 157

方法1: 精确匹配 "github.com/spf13/cobra"
✅ 找到完全匹配的依赖: github.com/spf13/cobra@v1.4.0
   校验和: h1:y+wJpx64xcgO1V+RcnwW0LEHxTKRi2ZDPSBjWnrg88=

方法2: 模糊匹配包含 "cobra" 的依赖
✅ 找到 2 个匹配的依赖:
1. github.com/russross/blackfriday/v2@v2.1.0
2. github.com/spf13/cobra@v1.4.0

方法3: 查找使用特定版本的依赖
✅ 找到 47 个使用v1.x版本的依赖，前5个:
1. github.com/Azure/go-autorest/autorest/adal@v1.2.0
2. github.com/Azure/go-autorest/autorest/date@v1.3.0
3. github.com/Azure/go-autorest/logger@v1.0.3
4. github.com/Azure/go-autorest/tracing@v1.0.3
5. github.com/PuerkitoBio/purell@v1.1.1
...以及其他 42 个依赖
```

## 技术说明

这个示例演示了查找依赖的三种不同方法：

1. **精确匹配**：使用 `BinaryInfo.GetDependencyByPath(path)` 方法查找完全匹配路径的依赖。
   这对于检查是否使用了特定依赖非常有用。

2. **模糊匹配**：使用 `BinaryInfo.FilterDependencies()` 方法结合 `strings.Contains()` 查找
   路径中包含特定字符串的所有依赖。这对于查找某个组织或项目的所有相关依赖很有用。

3. **版本匹配**：使用 `BinaryInfo.FilterDependencies()` 方法结合 `strings.HasPrefix()` 查找
   使用特定版本前缀的所有依赖。这对于审计使用特定主版本的依赖数量很有用。 