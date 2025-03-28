// Package gobinaryparser 提供用于解析Go二进制文件依赖关系的功能。
// 该包可以分析任何使用Go 1.12+编译并包含构建信息的二进制文件。
package gobinaryparser

// DependencyInfo 表示Go二进制文件中的一个依赖信息
// 示例：
//
//	{
//	  "path": "github.com/spf13/cobra",
//	  "version": "v1.6.1",
//	  "sum": "h1:xJqmnvzCeeF2MXGd8Byi93jN5wLSQOkImGTD2MMpcL0=",
//	  "replace": {
//	    "path": "github.com/spf13/cobra",
//	    "version": "v1.6.2-0.20221107171228-a7f686d8f418",
//	    "sum": "h1:7ehsRX9Usi7fGZZ71xJ9m3mqKmWnuE/UvNoza7PkHF4="
//	  }
//	}
type DependencyInfo struct {
	Path    string          `json:"path"`              // 依赖的导入路径，例如 "github.com/spf13/cobra"
	Version string          `json:"version"`           // 依赖的版本，例如 "v1.6.1"
	Sum     string          `json:"sum,omitempty"`     // 依赖的校验和，例如 "h1:xJqmnvzCeeF2MXGd8Byi93jN5wLSQOkImGTD2MMpcL0="
	Replace *DependencyInfo `json:"replace,omitempty"` // 替换信息，如果此依赖被替换则不为nil
}

// BinaryInfo 表示从Go二进制文件中解析出的信息
// 示例：
//
//	{
//	  "path": "github.com/example/myapp",
//	  "version": "v1.0.0",
//	  "dependencies": [...],
//	  "go_version": "go1.18.2",
//	  "build_settings": {"GOOS": "linux", "GOARCH": "amd64"},
//	  "file_path": "/usr/local/bin/myapp",
//	  "source_type": "file"
//	}
type BinaryInfo struct {
	Path          string            `json:"path"`           // 主模块路径，例如 "github.com/example/myapp"
	Version       string            `json:"version"`        // 主模块版本，例如 "v1.0.0"
	Dependencies  []DependencyInfo  `json:"dependencies"`   // 依赖列表
	GoVersion     string            `json:"go_version"`     // 编译使用的Go版本，例如 "go1.18.2"
	BuildSettings map[string]string `json:"build_settings"` // 编译设置，包含GOOS、GOARCH等
	FilePath      string            `json:"file_path"`      // 解析的二进制文件路径，对于非文件源可能为空
	SourceType    string            `json:"source_type"`    // 源类型（"file"、"url"、"bytes"、"reader"）
}
