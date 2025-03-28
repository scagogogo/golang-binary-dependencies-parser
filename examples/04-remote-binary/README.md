# 04-远程二进制解析示例

这个示例展示了如何使用 gobinaryparser 包解析远程 Go 二进制文件，而无需先下载整个文件到本地。

## 功能

- 通过 HTTP 请求直接解析远程二进制文件
- 使用上下文(Context)实现超时控制
- 几种不同的远程解析方法
- 以 JSON 格式输出依赖信息

## 使用方法

```bash
go run main.go <Go二进制文件URL>
```

例如：

```bash
go run main.go https://example.com/path/to/go-binary
```

## 解析方法

这个示例展示了三种不同的远程解析方法：

1. **ParseBinaryFromURLWithContext**：使用带有超时上下文的解析方法，这对确保解析操作不会无限期挂起很有用。
2. **ParseBinaryFromURL**：基本的 URL 解析方法，适用于大多数中小型二进制文件。
3. **ParseBinaryFromRemoteFile**：专为大型二进制文件设计的解析方法，使用 HTTP Range 请求只获取必要的部分。

程序会按顺序尝试这些方法，并在成功解析时停止。

## 输出示例

```
🌐 解析远程Go二进制文件

URL: https://example.com/path/to/binary

方法1: 直接从URL解析（带超时上下文）
❌ 无法解析远程二进制文件: HTTP错误: 404 Not Found

尝试替代方法...

方法2: 直接从URL解析（无上下文）
❌ 无法解析远程二进制文件: HTTP错误: 404 Not Found

尝试替代方法...

方法3: 使用RemoteFile方法（适用于大型二进制文件）

✅ 成功解析远程二进制文件
主模块: github.com/example/myapp@v1.2.3
Go版本: go1.18.2
依赖数量: 42

JSON输出:
{
  "path": "github.com/example/myapp",
  "version": "v1.2.3",
  "go_version": "go1.18.2",
  "dependencies": [
    {
      "path": "github.com/spf13/cobra",
      "version": "v1.4.0",
      "sum": "h1:y+wJpx64xcgO1V+RcnwW0LEHxTKRi2ZDPSBjWnrg88="
    },
    {
      "path": "github.com/spf13/pflag",
      "version": "v1.0.5",
      "sum": "h1:iy+VFUOCP1a+8yFto/drg2CJ5u0yRoB7fZw3DKv/JXA="
    },
    // ... 其他依赖
  ]
}

...显示了前5个依赖，共有42个
```

## 技术说明

远程解析功能使用自定义的 `HTTPReaderAt` 类型实现，该类型实现了 `io.ReaderAt` 接口，允许 `debug/buildinfo` 包从 HTTP 资源而非本地文件读取数据。这使得我们可以直接分析远程二进制文件，而无需先完整下载。

对于大型二进制文件，`ParseBinaryFromRemoteFile` 方法使用 HTTP Range 请求，只获取文件的必要部分，大大降低了网络传输量和解析时间。 