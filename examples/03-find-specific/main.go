package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
	// 检查是否提供了二进制文件路径
	if len(os.Args) < 3 {
		fmt.Println("用法: go run main.go <依赖名称> <Go二进制文件路径>")
		fmt.Println("例如: go run main.go cobra /usr/local/bin/go")
		os.Exit(1)
	}

	searchTerm := os.Args[1]
	binaryPath, err := filepath.Abs(os.Args[2])
	if err != nil {
		log.Fatalf("无法解析路径: %v", err)
	}

	// 解析二进制文件
	info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
	if err != nil {
		log.Fatalf("解析二进制文件失败: %v", err)
	}

	// 基本信息
	fmt.Printf("🔍 在二进制文件中查找依赖\n\n")
	fmt.Printf("文件: %s\n", info.FilePath)
	fmt.Printf("Go版本: %s\n", info.GoVersion)
	fmt.Printf("总依赖数量: %d\n", len(info.Dependencies))

	// 方法1: 使用精确匹配 - GetDependencyByPath
	fmt.Printf("\n方法1: 精确匹配 \"%s\"\n", searchTerm)
	dep := info.GetDependencyByPath(searchTerm)
	if dep != nil {
		fmt.Printf("✅ 找到完全匹配的依赖: %s@%s\n", dep.Path, dep.Version)
		if dep.Replace != nil {
			fmt.Printf("   被替换为: %s@%s\n", dep.Replace.Path, dep.Replace.Version)
		}
		if dep.Sum != "" {
			fmt.Printf("   校验和: %s\n", dep.Sum)
		}
	} else {
		fmt.Printf("❌ 没有找到完全匹配 \"%s\" 的依赖\n", searchTerm)
	}

	// 方法2: 使用模糊匹配
	fmt.Printf("\n方法2: 模糊匹配包含 \"%s\" 的依赖\n", searchTerm)
	matches := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
		return strings.Contains(dep.Path, searchTerm)
	})

	if len(matches) > 0 {
		fmt.Printf("✅ 找到 %d 个匹配的依赖:\n", len(matches))
		for i, dep := range matches {
			fmt.Printf("%d. %s@%s\n", i+1, dep.Path, dep.Version)
			if dep.Replace != nil {
				fmt.Printf("   被替换为: %s@%s\n", dep.Replace.Path, dep.Replace.Version)
			}
		}
	} else {
		fmt.Printf("❌ 没有找到包含 \"%s\" 的依赖\n", searchTerm)
	}

	// 方法3: 检查依赖树是否使用了特定版本
	fmt.Printf("\n方法3: 查找使用特定版本的依赖\n")
	versionSearch := "v1."
	versionMatches := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
		return strings.HasPrefix(dep.Version, versionSearch)
	})

	if len(versionMatches) > 0 {
		count := 5
		if len(versionMatches) < count {
			count = len(versionMatches)
		}
		fmt.Printf("✅ 找到 %d 个使用v1.x版本的依赖，前%d个:\n", len(versionMatches), count)
		for i := 0; i < count; i++ {
			dep := versionMatches[i]
			fmt.Printf("%d. %s@%s\n", i+1, dep.Path, dep.Version)
		}
		if len(versionMatches) > count {
			fmt.Printf("...以及其他 %d 个依赖\n", len(versionMatches)-count)
		}
	} else {
		fmt.Printf("❌ 没有找到使用v1.x版本的依赖\n")
	}
}
