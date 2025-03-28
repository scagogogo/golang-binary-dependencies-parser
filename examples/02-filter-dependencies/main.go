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
	if len(os.Args) < 2 {
		fmt.Println("用法: go run main.go <Go二进制文件路径>")
		fmt.Println("例如: go run main.go /usr/local/bin/go")
		os.Exit(1)
	}

	// 获取二进制文件的绝对路径
	binaryPath, err := filepath.Abs(os.Args[1])
	if err != nil {
		log.Fatalf("无法解析路径: %v", err)
	}

	// 解析二进制文件
	info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
	if err != nil {
		log.Fatalf("解析二进制文件失败: %v", err)
	}

	// 基本信息
	fmt.Printf("📦 Go 二进制文件依赖分析 - 过滤示例\n\n")
	fmt.Printf("文件: %s\n", info.FilePath)
	fmt.Printf("Go版本: %s\n", info.GoVersion)
	fmt.Printf("总依赖数量: %d\n", len(info.Dependencies))

	// 示例1: 过滤标准库依赖
	stdlibDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
		return gobinaryparser.IsStdLib(dep.Path)
	})
	fmt.Printf("\n标准库依赖数量: %d\n", len(stdlibDeps))

	if len(stdlibDeps) > 0 {
		fmt.Println("标准库依赖示例:")
		limit := 5
		if len(stdlibDeps) < limit {
			limit = len(stdlibDeps)
		}
		for i := 0; i < limit; i++ {
			fmt.Printf("  - %s\n", stdlibDeps[i].Path)
		}
	}

	// 示例2: 过滤第三方依赖
	thirdPartyDeps := gobinaryparser.FilterStdLib(info.Dependencies)
	fmt.Printf("\n第三方依赖数量: %d\n", len(thirdPartyDeps))

	// 示例3: 过滤包含特定前缀的依赖
	githubDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
		return strings.HasPrefix(dep.Path, "github.com/")
	})
	fmt.Printf("\nGitHub依赖数量: %d\n", len(githubDeps))

	if len(githubDeps) > 0 {
		fmt.Println("GitHub依赖示例:")
		limit := 5
		if len(githubDeps) < limit {
			limit = len(githubDeps)
		}
		for i := 0; i < limit; i++ {
			fmt.Printf("  - %s@%s\n", githubDeps[i].Path, githubDeps[i].Version)
		}
	}

	// 示例4: 过滤被替换的依赖
	replacedDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
		return dep.Replace != nil
	})
	fmt.Printf("\n被替换的依赖数量: %d\n", len(replacedDeps))

	if len(replacedDeps) > 0 {
		fmt.Println("被替换的依赖:")
		for i, dep := range replacedDeps {
			if i >= 5 {
				fmt.Printf("...以及其他 %d 个被替换的依赖\n", len(replacedDeps)-5)
				break
			}
			fmt.Printf("  - %s@%s => %s@%s\n",
				dep.Path, dep.Version,
				dep.Replace.Path, dep.Replace.Version)
		}
	}
}
