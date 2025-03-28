package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

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

	// 打印基本信息
	fmt.Printf("📦 Go 二进制文件依赖分析\n\n")
	fmt.Printf("文件: %s\n", info.FilePath)
	fmt.Printf("主模块: %s@%s\n", info.Path, info.Version)
	fmt.Printf("Go版本: %s\n", info.GoVersion)

	// 打印依赖信息
	fmt.Printf("\n依赖数量: %d\n", len(info.Dependencies))

	// 限制打印的依赖数量，避免输出过多
	maxDeps := 10
	if len(info.Dependencies) < maxDeps {
		maxDeps = len(info.Dependencies)
	}

	fmt.Printf("\n前%d个依赖:\n", maxDeps)
	for i := 0; i < maxDeps; i++ {
		dep := info.Dependencies[i]
		fmt.Printf("%d. %s@%s\n", i+1, dep.Path, dep.Version)
		if dep.Replace != nil {
			fmt.Printf("   (被替换为 %s@%s)\n", dep.Replace.Path, dep.Replace.Version)
		}
	}

	// 如果有更多依赖，显示提示信息
	if len(info.Dependencies) > maxDeps {
		fmt.Printf("...和 %d 个其他依赖\n", len(info.Dependencies)-maxDeps)
	}
}
