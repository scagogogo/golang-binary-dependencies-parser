package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

func main() {
	// 检查是否提供了URL
	if len(os.Args) < 2 {
		fmt.Println("用法: go run main.go <Go二进制文件URL>")
		fmt.Println("例如: go run main.go https://example.com/path/to/binary")
		os.Exit(1)
	}

	url := os.Args[1]
	fmt.Printf("🌐 解析远程Go二进制文件\n\n")
	fmt.Printf("URL: %s\n", url)

	// 创建带有超时的上下文
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// 方法1: 使用URL直接解析（带上下文）
	fmt.Println("\n方法1: 直接从URL解析（带超时上下文）")
	info, err := gobinaryparser.ParseBinaryFromURLWithContext(ctx, url)
	if err != nil {
		fmt.Printf("❌ 无法解析远程二进制文件: %v\n", err)
		fmt.Println("\n尝试替代方法...")
	} else {
		printBinaryInfo(info)
		return
	}

	// 方法2: 使用URL直接解析（无上下文）
	fmt.Println("\n方法2: 直接从URL解析（无上下文）")
	info, err = gobinaryparser.ParseBinaryFromURL(url)
	if err != nil {
		fmt.Printf("❌ 无法解析远程二进制文件: %v\n", err)
		fmt.Println("\n尝试替代方法...")
	} else {
		printBinaryInfo(info)
		return
	}

	// 方法3: 使用RemoteFile方法（适用于大型二进制文件）
	fmt.Println("\n方法3: 使用RemoteFile方法（适用于大型二进制文件）")
	info, err = gobinaryparser.ParseBinaryFromRemoteFile(url)
	if err != nil {
		fmt.Printf("❌ 无法解析远程二进制文件: %v\n", err)
		os.Exit(1)
	}

	printBinaryInfo(info)
}

// 打印二进制文件信息
func printBinaryInfo(info *gobinaryparser.BinaryInfo) {
	// 打印基本信息
	fmt.Printf("\n✅ 成功解析远程二进制文件\n")
	fmt.Printf("主模块: %s@%s\n", info.Path, info.Version)
	fmt.Printf("Go版本: %s\n", info.GoVersion)
	fmt.Printf("依赖数量: %d\n", len(info.Dependencies))

	// 以JSON格式输出详细信息
	fmt.Println("\nJSON输出:")

	type OutputInfo struct {
		Path         string                          `json:"path"`
		Version      string                          `json:"version"`
		GoVersion    string                          `json:"go_version"`
		Dependencies []gobinaryparser.DependencyInfo `json:"dependencies"`
	}

	output := OutputInfo{
		Path:         info.Path,
		Version:      info.Version,
		GoVersion:    info.GoVersion,
		Dependencies: info.Dependencies,
	}

	// 限制依赖数量，避免输出过多
	if len(output.Dependencies) > 5 {
		output.Dependencies = output.Dependencies[:5]
	}

	jsonData, err := json.MarshalIndent(output, "", "  ")
	if err != nil {
		fmt.Printf("无法生成JSON: %v\n", err)
		return
	}

	fmt.Println(string(jsonData))

	if len(info.Dependencies) > 5 {
		fmt.Printf("\n...显示了前5个依赖，共有%d个\n", len(info.Dependencies))
	}
}
