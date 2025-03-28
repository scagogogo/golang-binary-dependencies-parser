// Package gobinaryparser 提供用于解析Go二进制文件依赖关系的功能。
package gobinaryparser

import (
	"debug/buildinfo"
	"fmt"
	"path/filepath"
)

// ParseBinary 解析指定的Go二进制文件并返回其依赖关系信息。
//
// 参数:
//   - filePath: Go二进制文件的路径
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果解析过程中发生错误，则返回错误信息
//
// 使用示例:
//
//	info, err := gobinaryparser.ParseBinary("/usr/local/bin/kubectl")
//	if err != nil {
//		log.Fatalf("解析二进制文件失败: %v", err)
//	}
//	fmt.Printf("二进制文件: %s\n", info.FilePath)
//	fmt.Printf("主模块: %s@%s\n", info.Path, info.Version)
//	fmt.Printf("Go版本: %s\n", info.GoVersion)
//	fmt.Printf("依赖数量: %d\n", len(info.Dependencies))
func ParseBinary(filePath string) (*BinaryInfo, error) {
	absPath, err := filepath.Abs(filePath)
	if err != nil {
		return nil, fmt.Errorf("获取绝对路径失败: %w", err)
	}

	info, err := buildinfo.ReadFile(absPath)
	if err != nil {
		return nil, fmt.Errorf("读取构建信息失败: %w", err)
	}

	return createBinaryInfo(info, absPath, "file")
}

// createBinaryInfo 从buildinfo.BuildInfo创建BinaryInfo结构体
//
// 参数:
//   - info: Go标准库中buildinfo.BuildInfo结构体，包含了二进制文件的构建信息
//   - path: 二进制文件的路径或标识符
//   - sourceType: 源类型标识，可以是"file"、"url"、"bytes"或"reader"
//
// 返回:
//   - *BinaryInfo: 包含二进制文件依赖信息的结构体
//   - error: 如果处理过程中发生错误，则返回错误信息
//
// 该函数是内部函数，用于将标准库的buildinfo.BuildInfo转换为本包定义的BinaryInfo结构体，
// 并处理所有依赖关系，包括被替换的依赖。
func createBinaryInfo(info *buildinfo.BuildInfo, path string, sourceType string) (*BinaryInfo, error) {
	// 将构建设置转换为map
	buildSettings := make(map[string]string)
	for _, setting := range info.Settings {
		buildSettings[setting.Key] = setting.Value
	}

	result := &BinaryInfo{
		Path:          info.Path,
		Version:       info.Main.Version,
		GoVersion:     info.GoVersion,
		BuildSettings: buildSettings,
		FilePath:      path,
		SourceType:    sourceType,
		Dependencies:  make([]DependencyInfo, 0, len(info.Deps)),
	}

	// 提取依赖信息
	for _, dep := range info.Deps {
		depInfo := DependencyInfo{
			Path:    dep.Path,
			Version: dep.Version,
			Sum:     dep.Sum,
		}

		if dep.Replace != nil {
			depInfo.Replace = &DependencyInfo{
				Path:    dep.Replace.Path,
				Version: dep.Replace.Version,
				Sum:     dep.Replace.Sum,
			}
		}

		result.Dependencies = append(result.Dependencies, depInfo)
	}

	return result, nil
}
