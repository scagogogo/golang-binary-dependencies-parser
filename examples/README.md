# gobinaryparser 使用示例

这个目录包含了多个使用 `gobinaryparser` 包的示例，展示了如何解析 Go 二进制文件并提取其依赖信息。每个示例都是一个独立的 Go 程序，可以单独编译和运行。

## 示例目录

- [01-basic-parsing](01-basic-parsing) - 基本的二进制文件解析示例
- [02-filter-dependencies](02-filter-dependencies) - 依赖过滤示例
- [03-find-specific](03-find-specific) - 查找特定依赖示例
- [04-remote-binary](04-remote-binary) - 远程二进制文件解析示例

## 运行示例

每个示例都包含一个 `main.go` 文件和一个 `README.md` 文件，解释了示例的功能和使用方法。

要运行示例，进入相应的目录，然后执行：

```bash
go run main.go [参数]
```

例如，要运行第一个示例：

```bash
cd 01-basic-parsing
go run main.go /usr/local/bin/go
```

## 构建和安装

如果你想构建这些示例，可以使用 `go build` 命令：

```bash
cd 01-basic-parsing
go build -o parser
./parser /usr/local/bin/go
```

## 使用 Go 二进制文件进行测试

要测试这些示例，你需要一个或多个 Go 编译的二进制文件。你可以使用系统中已有的 Go 二进制文件，例如：

- Go 编译器 (`go`)
- 使用 Go 语言编写的工具 (例如 `kubectl`, `docker`, `hugo` 等)
- 你自己编译的 Go 程序

注意，这些示例仅适用于 Go 1.12 及更高版本编译的二进制文件，因为它们依赖于 Go 模块构建信息，这是在 Go 1.12 中引入的。 