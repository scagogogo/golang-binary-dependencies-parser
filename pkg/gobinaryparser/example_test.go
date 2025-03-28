package gobinaryparser_test

import (
	"fmt"
	"log"

	"github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

// Example 展示了如何使用gobinaryparser包分析Go二进制文件。
// 这个例子演示了基本的解析流程和查看依赖信息的方法。
func Example() {
	// 替换为实际的Go二进制文件路径
	binaryPath := "/path/to/your/go/binary"

	// 解析二进制文件
	info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
	if err != nil {
		log.Fatalf("解析二进制文件失败: %v", err)
	}

	// 打印基本信息
	fmt.Printf("二进制文件: %s\n", info.FilePath)
	fmt.Printf("主模块: %s@%s\n", info.Path, info.Version)
	fmt.Printf("Go版本: %s\n", info.GoVersion)

	// 打印所有依赖
	fmt.Println("\n依赖列表:")
	for i, dep := range info.Dependencies {
		fmt.Printf("%d. %s@%s\n", i+1, dep.Path, dep.Version)

		if dep.Replace != nil {
			fmt.Printf("   (被替换为 %s@%s)\n", dep.Replace.Path, dep.Replace.Version)
		}
	}

	// 过滤依赖的示例
	stdlibDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
		// 标准库包通常在导入路径中没有"."
		return gobinaryparser.IsStdLib(dep.Path)
	})

	// 打印标准库依赖
	fmt.Println("\n标准库依赖:")
	for i, dep := range stdlibDeps {
		fmt.Printf("%d. %s\n", i+1, dep.Path)
	}

	// 你还可以使用其他过滤方式，比如查找特定前缀的依赖
	k8sDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
		return len(dep.Path) >= 5 && dep.Path[:5] == "k8s.io"
	})
	fmt.Printf("\nKubernetes相关依赖数量: %d\n", len(k8sDeps))
}

// ExampleBinaryInfo_GetDependencyByPath 演示如何检查二进制文件中是否使用了特定依赖。
// 这个例子展示了如何查找特定依赖并获取其详细信息。
func ExampleBinaryInfo_GetDependencyByPath() {
	binaryPath := "/path/to/your/go/binary"

	info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
	if err != nil {
		log.Fatalf("解析二进制文件失败: %v", err)
	}

	// 检查特定依赖
	depName := "github.com/some/dependency"
	dep := info.GetDependencyByPath(depName)

	if dep != nil {
		fmt.Printf("找到依赖 %s@%s\n", dep.Path, dep.Version)

		// 检查此依赖是否被替换
		if dep.Replace != nil {
			fmt.Printf("该依赖被替换为 %s@%s\n", dep.Replace.Path, dep.Replace.Version)
		}

		// 如果需要，可以查看校验和
		if dep.Sum != "" {
			fmt.Printf("校验和: %s\n", dep.Sum)
		}
	} else {
		fmt.Printf("未找到依赖 %s\n", depName)
	}

	// 还可以检查多个依赖
	commonDeps := []string{
		"github.com/spf13/cobra",
		"github.com/spf13/viper",
		"golang.org/x/net",
	}

	fmt.Println("\n常见依赖检查:")
	for _, name := range commonDeps {
		if dep := info.GetDependencyByPath(name); dep != nil {
			fmt.Printf("✓ %s@%s\n", name, dep.Version)
		} else {
			fmt.Printf("✗ %s 未使用\n", name)
		}
	}
}

// ExampleParseBinaryFromURL 演示如何从URL解析Go二进制文件。
// 这个例子展示了如何使用远程解析功能。
func ExampleParseBinaryFromURL() {
	// 解析远程二进制文件
	info, err := gobinaryparser.ParseBinaryFromURL("https://example.com/binaries/myapp")
	if err != nil {
		log.Fatalf("解析远程二进制文件失败: %v", err)
	}

	// 打印基本信息
	fmt.Printf("主模块: %s@%s\n", info.Path, info.Version)
	fmt.Printf("Go版本: %s\n", info.GoVersion)
	fmt.Printf("依赖数量: %d\n", len(info.Dependencies))

	// 你还可以过滤出被替换的依赖
	replacedDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
		return dep.Replace != nil
	})

	if len(replacedDeps) > 0 {
		fmt.Println("\n被替换的依赖:")
		for i, dep := range replacedDeps {
			fmt.Printf("%d. %s@%s -> %s@%s\n",
				i+1, dep.Path, dep.Version,
				dep.Replace.Path, dep.Replace.Version)
		}
	}
}
