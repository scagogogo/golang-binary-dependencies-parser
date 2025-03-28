package gobinaryparser

import (
	"bytes"
	"debug/buildinfo"
	"fmt"
	"io"
	"os"
)

// ParseBinaryFromPath 解析指定路径的Go二进制文件并返回其依赖关系信息。
// 该函数会先验证文件是否存在并可访问，然后再尝试解析。
//
// 参数:
//   - path: Go二进制文件的路径
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果文件不存在或解析过程中发生错误，则返回错误信息
//
// 使用示例:
//
//	info, err := gobinaryparser.ParseBinaryFromPath("/usr/local/bin/docker")
//	if err != nil {
//		log.Fatalf("解析二进制文件失败: %v", err)
//	}
//	// 遍历所有依赖
//	for i, dep := range info.Dependencies {
//		fmt.Printf("%d. %s@%s\n", i+1, dep.Path, dep.Version)
//	}
func ParseBinaryFromPath(path string) (*BinaryInfo, error) {
	// 检查文件是否存在
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return nil, fmt.Errorf("二进制文件不存在: %s", path)
	}

	return ParseBinary(path)
}

// ParseBinaryFromFile 是 ParseBinaryFromPath 的别名函数，用于兼容旧代码。
// 解析指定路径的Go二进制文件并返回其依赖关系信息。
//
// 参数:
//   - path: Go二进制文件的路径
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果文件不存在或解析过程中发生错误，则返回错误信息
//
// 使用示例:
//
//	info, err := gobinaryparser.ParseBinaryFromFile("/usr/local/bin/docker")
//	if err != nil {
//		log.Fatalf("解析二进制文件失败: %v", err)
//	}
func ParseBinaryFromFile(path string) (*BinaryInfo, error) {
	return ParseBinaryFromPath(path)
}

// ParseBinaryFromBytes 从字节切片解析Go二进制文件。
// 当二进制数据已经在内存中时，这个函数很有用。
//
// 参数:
//   - data: 包含Go二进制文件内容的字节切片
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果解析过程中发生错误，则返回错误信息
//
// 使用示例:
//
//	// 假设已经从某处获取了二进制数据
//	binaryData, _ := ioutil.ReadFile("/usr/local/bin/go")
//	info, err := gobinaryparser.ParseBinaryFromBytes(binaryData)
//	if err != nil {
//		log.Fatalf("解析二进制数据失败: %v", err)
//	}
//	fmt.Printf("Go版本: %s\n", info.GoVersion)
func ParseBinaryFromBytes(data []byte) (*BinaryInfo, error) {
	reader := bytes.NewReader(data)
	info, err := buildinfo.Read(reader)
	if err != nil {
		return nil, fmt.Errorf("从字节读取构建信息失败: %w", err)
	}

	return createBinaryInfo(info, "", "bytes")
}

// ParseBinaryFromReader 从io.ReaderAt接口解析Go二进制文件。
// 这对于从非文件源（如网络流或嵌入式资源）解析很有用。
//
// 参数:
//   - r: 实现了io.ReaderAt接口的对象，用于读取二进制数据
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果解析过程中发生错误，则返回错误信息
//
// 使用示例:
//
//	// 假设有一个自定义的Reader
//	customReader := NewCustomReader(...)
//	info, err := gobinaryparser.ParseBinaryFromReader(customReader)
//	if err != nil {
//		log.Fatalf("解析失败: %v", err)
//	}
//
//	// 或者与网络资源结合使用
//	resp, _ := http.Get("http://example.com/go-binary")
//	defer resp.Body.Close()
//	data, _ := ioutil.ReadAll(resp.Body)
//	reader := bytes.NewReader(data)
//	info, err := gobinaryparser.ParseBinaryFromReader(reader)
func ParseBinaryFromReader(r io.ReaderAt) (*BinaryInfo, error) {
	info, err := buildinfo.Read(r)
	if err != nil {
		return nil, fmt.Errorf("从读取器读取构建信息失败: %w", err)
	}

	return createBinaryInfo(info, "", "reader")
}
