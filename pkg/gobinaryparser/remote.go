package gobinaryparser

import (
	"context"
	"debug/buildinfo"
	"fmt"
	"io"
	"net/http"
	"time"
)

// ParseBinaryFromURL 下载并解析给定URL的Go二进制文件。
// 此函数有30秒的默认超时，可以通过提供自定义上下文来自定义超时时间。
//
// 参数:
//   - url: Go二进制文件的URL
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果下载或解析过程中发生错误，则返回错误信息
//
// 使用示例:
//
//	info, err := binaryparser.ParseBinaryFromURL("https://example.com/binaries/kubectl")
//	if err != nil {
//		log.Fatalf("解析远程二进制文件失败: %v", err)
//	}
//	fmt.Printf("Go版本: %s\n", info.GoVersion)
//	fmt.Printf("依赖数量: %d\n", len(info.Dependencies))
func ParseBinaryFromURL(url string) (*BinaryInfo, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	return ParseBinaryFromURLWithContext(ctx, url)
}

// ParseBinaryFromURLWithContext 使用自定义上下文下载并解析给定URL的Go二进制文件。
// 上下文可用于设置超时、取消或传递请求特定的值。
//
// 参数:
//   - ctx: 上下文，用于控制请求的生命周期
//   - url: Go二进制文件的URL
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果下载或解析过程中发生错误，则返回错误信息
//
// 使用示例:
//
//	// 创建一个5秒超时的上下文
//	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
//	defer cancel()
//
//	info, err := binaryparser.ParseBinaryFromURLWithContext(ctx, "https://example.com/binaries/kubectl")
//	if err != nil {
//		if errors.Is(err, context.DeadlineExceeded) {
//			log.Fatal("下载超时")
//		} else {
//			log.Fatalf("解析失败: %v", err)
//		}
//	}
func ParseBinaryFromURLWithContext(ctx context.Context, url string) (*BinaryInfo, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %w", err)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("从URL下载二进制文件失败: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP错误: %s", resp.Status)
	}

	// 读取整个响应体
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应内容失败: %w", err)
	}

	// 解析下载的二进制字节
	return ParseBinaryFromBytes(data)
}

// ParseBinaryFromRemoteFile 从支持范围请求的远程位置解析Go二进制文件。
// 对于大型二进制文件，这比ParseBinaryFromURL更高效，因为如果构建信息位于文件的开头或结尾，
// 它不需要下载整个文件。
//
// 参数:
//   - url: Go二进制文件的URL
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果请求或解析过程中发生错误，则返回错误信息
//
// 使用示例:
//
//	info, err := binaryparser.ParseBinaryFromRemoteFile("https://example.com/binaries/large-binary")
//	if err != nil {
//		log.Fatalf("解析远程二进制文件失败: %v", err)
//	}
//	fmt.Printf("主模块: %s@%s\n", info.Path, info.Version)
func ParseBinaryFromRemoteFile(url string) (*BinaryInfo, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	return ParseBinaryFromRemoteFileWithContext(ctx, url)
}

// ParseBinaryFromRemoteFileWithContext 使用自定义上下文从远程位置解析Go二进制文件。
//
// 参数:
//   - ctx: 上下文，用于控制请求的生命周期
//   - url: Go二进制文件的URL
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果请求或解析过程中发生错误，则返回错误信息
//
// 使用示例:
//
//	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
//	defer cancel()
//
//	info, err := binaryparser.ParseBinaryFromRemoteFileWithContext(ctx, "https://example.com/binaries/large-binary")
//	if err != nil {
//		log.Fatalf("解析失败: %v", err)
//	}
func ParseBinaryFromRemoteFileWithContext(ctx context.Context, url string) (*BinaryInfo, error) {
	// 实现一个自定义的io.ReaderAt，用于进行范围请求
	reader := NewHTTPReaderAt(url)

	// 使用reader解析二进制文件
	info, err := buildinfo.Read(reader)
	if err != nil {
		return nil, fmt.Errorf("从远程文件读取构建信息失败: %w", err)
	}

	return createBinaryInfo(info, url, "url")
}

// HTTPReaderAt 实现了用于HTTP范围请求的io.ReaderAt接口
type HTTPReaderAt struct {
	url string
	ctx context.Context
}

// NewHTTPReaderAt 为给定URL创建新的HTTPReaderAt
//
// 参数:
//   - url: 要读取的远程文件URL
//
// 返回:
//   - *HTTPReaderAt: 新创建的HTTPReaderAt实例
//
// 使用示例:
//
//	reader := binaryparser.NewHTTPReaderAt("https://example.com/file.bin")
//	// 现在可以对reader执行ReadAt操作
func NewHTTPReaderAt(url string) *HTTPReaderAt {
	return &HTTPReaderAt{
		url: url,
		ctx: context.Background(),
	}
}

// WithContext 返回使用给定上下文的新HTTPReaderAt
//
// 参数:
//   - ctx: 要使用的上下文
//
// 返回:
//   - *HTTPReaderAt: 带有指定上下文的新HTTPReaderAt实例
//
// 使用示例:
//
//	reader := binaryparser.NewHTTPReaderAt("https://example.com/file.bin")
//	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
//	defer cancel()
//
//	readerWithTimeout := reader.WithContext(ctx)
func (h *HTTPReaderAt) WithContext(ctx context.Context) *HTTPReaderAt {
	return &HTTPReaderAt{
		url: h.url,
		ctx: ctx,
	}
}

// ReadAt 实现io.ReaderAt接口
//
// 参数:
//   - p: 用于存储读取数据的字节切片
//   - off: 从文件中读取的起始偏移量
//
// 返回:
//   - n: 读取的字节数
//   - err: 如果读取过程中发生错误，则返回错误信息
//
// 该方法通过HTTP Range头从远程文件读取特定范围的内容，这对于大文件特别有用，
// 因为它允许只下载需要的部分，而不是整个文件。
func (h *HTTPReaderAt) ReadAt(p []byte, off int64) (n int, err error) {
	req, err := http.NewRequestWithContext(h.ctx, http.MethodGet, h.url, nil)
	if err != nil {
		return 0, err
	}

	// 设置Range头
	req.Header.Set("Range", fmt.Sprintf("bytes=%d-%d", off, off+int64(len(p))-1))

	// 发送请求
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	// 检查正确的状态码（206 Partial Content）
	if resp.StatusCode != http.StatusPartialContent && resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("HTTP错误: %s", resp.Status)
	}

	// 读取响应体
	return io.ReadFull(resp.Body, p)
}
