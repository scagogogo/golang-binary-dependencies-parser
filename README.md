# Golang Binary Dependencies Parser

这个工具用于解析Go语言编译的二进制文件，提取其中的依赖关系信息。通过使用Go标准库中的`debug/buildinfo`包，它可以分析任何使用Go 1.12+版本编译并包含构建信息的二进制文件。

## 功能特点

- 解析Go二进制文件的主模块信息
- 提取所有依赖模块及其版本
- 识别被替换(replace)的依赖
- 支持过滤标准库依赖
- 提供JSON输出格式选项
- 支持详细模式显示构建信息和校验和
- 彩色输出，提高可读性
- 查找特定依赖的功能
- 标准库依赖分析

## 安装

```bash
go install github.com/scagogogo/golang-binary-dependencies-parser/cmd/godeps@latest
```

## 使用方法

### 命令行参数

godeps 提供了直观的命令行界面，使用 [cobra](https://github.com/spf13/cobra) 实现。主要命令如下：

```
godeps - 分析二进制文件的所有依赖
godeps find - 查找特定依赖
godeps stdlib - 显示标准库依赖
```

### 基本使用

显示二进制的所有依赖:

```bash
godeps /path/to/your/go-binary
```

可选参数:

```
  -s, --nostdlib   过滤掉标准库依赖
  -j, --json       以JSON格式输出结果
  -v, --verbose    显示详细信息，包括校验和
  -r, --replaced   只显示被替换的依赖
  -h, --help       显示帮助信息
```

### 查找特定依赖

您可以使用 `find` 子命令查找特定依赖:

```bash
godeps find [依赖名称] /path/to/your/go-binary
```

例如，查找所有包含 "cobra" 的依赖:

```bash
godeps find cobra /usr/local/bin/kubectl
```

精确匹配指定依赖:

```bash
godeps find --exact github.com/spf13/cobra /usr/local/bin/kubectl
```

查找子命令的选项:

```
  -e, --exact      精确匹配依赖名称
  -v, --verbose    显示详细信息
  -h, --help       显示帮助信息
```

### 分析标准库依赖

显示二进制文件使用的所有标准库依赖:

```bash
godeps stdlib /path/to/your/go-binary
```

这将按包前缀分组显示所有标准库依赖，方便查看。

### 特殊情况处理

godeps 工具设计为可处理各种特殊情况的二进制文件：

#### 剥离符号和调试信息的二进制文件

工具可以成功分析使用以下编译选项构建的二进制文件：
- `-ldflags="-s -w"` - 移除符号表和调试信息
- `-trimpath` - 移除编译路径信息
- `-ldflags="-buildid="` - 移除构建ID

即使使用这些优化选项，godeps 仍能正确提取依赖信息，因为 Go 将模块信息嵌入到二进制文件的特殊部分，这些信息不会被标准的符号和调试信息剥离选项移除。

例如，分析优化过的二进制文件：
```bash
# 编译时剥离符号的二进制
go build -ldflags="-s -w" -o optimized_binary main.go

# 分析仍然有效
godeps optimized_binary
```

#### 变异编译环境

godeps 可以分析跨平台编译的二进制文件，无论目标操作系统或架构如何。

#### 非模块化二进制

对于Go 1.12之前编译的二进制文件或非模块模式编译的程序，godeps 会显示相应的错误信息。

### 输出示例

基本分析输出:

```
📦 Go Binary Dependency Analysis

Binary: /usr/local/bin/kubectl
Main module: k8s.io/kubectl@v0.24.0
Go version: go1.18.2

Dependencies (157):
  MODULE                                          VERSION                 REPLACED BY
  github.com/Azure/go-ansiterm                    v0.0.0-20210617225240-d185dfc1b5a1
  github.com/MakeNowJust/heredoc                  v0.0.0-20170808103936-bb23615498cd
  github.com/davecgh/go-spew                      v1.1.1
  github.com/docker/distribution                  v2.8.1+incompatible     github.com/distribution/distribution@v2.8.1+incompatible
  ...
```

查找特定依赖:

```
🔍 Found 2 dependencies matching 'cobra'

MODULE                       VERSION                 SUM                                      REPLACED BY
github.com/spf13/cobra       v1.4.0                  h1:y+wJpx64xcgO1V+RcnwW0LEHxTKRi2ZDPSBjWnrg88=
github.com/spf13/pflag       v1.0.5                  h1:iy+VFUOCP1a+8yFto/drg2CJ5u0yRoB7fZw3DKv/JXA=
```

标准库依赖分析:

```
📚 Standard Library Dependencies (35)

context

fmt

net
  ├─ http
  ├─ url
  ├─ http/httputil

os
  ├─ exec
  ├─ signal

strings

...

Total: 35 standard library packages
```

### 作为Go库使用

```go
package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
	// 解析二进制文件
	info, err := gobinaryparser.ParseBinaryFromFile("/path/to/binary")
	if err != nil {
		log.Fatalf("解析错误: %v", err)
	}

	// 访问依赖信息
	fmt.Printf("二进制文件: %s\n", info.FilePath)
	fmt.Printf("主模块: %s@%s\n", info.Path, info.Version)
	fmt.Printf("Go版本: %s\n", info.GoVersion)

	// 查看所有依赖
	for i, dep := range info.Dependencies {
		fmt.Printf("%d. %s@%s\n", i+1, dep.Path, dep.Version)
		if dep.Replace != nil {
			fmt.Printf("   (被替换为 %s@%s)\n", dep.Replace.Path, dep.Replace.Version)
		}
	}

	// 查找特定依赖
	if dep := info.GetDependencyByPath("github.com/spf13/cobra"); dep != nil {
		fmt.Printf("找到依赖 cobra: %s\n", dep.Version)
	}

	// 过滤依赖
	thirdPartyDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
		return !gobinaryparser.IsStdLib(dep.Path)  // 非标准库
	})
	fmt.Printf("第三方依赖数量: %d\n", len(thirdPartyDeps))
}
```

## 技术说明

- 利用Go 1.12+中引入的模块构建信息功能
- 依赖`debug/buildinfo`包进行二进制文件解析
- 使用`cobra`库实现命令行界面
- 使用`fatih/color`库实现彩色输出
- 所有依赖信息都是从二进制文件中直接提取，不需要源代码或额外的配置

## 兼容性

- 支持Go 1.12及更高版本编译的二进制文件
- 对于没有构建信息的二进制文件，将返回相应的错误
- 完全支持使用 `-ldflags="-s -w"` 等优化选项编译的二进制文件

## 限制和已知问题

- 无法分析非 Go 二进制文件或使用非模块模式编译的旧版 Go 二进制文件
- 依赖信息仅包含直接依赖和间接依赖，不包含源代码中未使用但在 go.mod 中声明的依赖
- 极少数情况下，如果二进制文件经过非标准后处理（如某些加壳或混淆工具），可能导致依赖信息无法被提取

## 许可证

[MIT](LICENSE) 