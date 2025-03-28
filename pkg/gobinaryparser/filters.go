package gobinaryparser

import (
	"strings"
)

// FilterDependencies 根据提供的过滤函数返回经过过滤的依赖列表。
//
// 参数:
//   - filter: 一个接收DependencyInfo并返回布尔值的函数，返回true表示保留依赖
//
// 返回:
//   - []DependencyInfo: 经过过滤的依赖列表
//
// 如果filter为nil，则返回所有依赖。
//
// 使用示例:
//
//	// 过滤出所有第三方依赖（包含点号的导入路径）
//	thirdPartyDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
//		for i := 0; i < len(dep.Path); i++ {
//			if dep.Path[i] == '.' {
//				return true
//			}
//		}
//		return false
//	})
//
//	// 过滤出所有被替换的依赖
//	replacedDeps := info.FilterDependencies(func(dep gobinaryparser.DependencyInfo) bool {
//		return dep.Replace != nil
//	})
func (info *BinaryInfo) FilterDependencies(filter func(DependencyInfo) bool) []DependencyInfo {
	if filter == nil {
		return info.Dependencies
	}

	filtered := make([]DependencyInfo, 0)
	for _, dep := range info.Dependencies {
		if filter(dep) {
			filtered = append(filtered, dep)
		}
	}
	return filtered
}

// FilterStdLib 过滤依赖列表中的标准库依赖。
//
// 参数:
//   - include: 为true表示只包含标准库依赖，为false表示排除标准库依赖
//
// 返回:
//   - []DependencyInfo: 过滤后的依赖列表
//
// 使用示例:
//
//	// 只获取标准库依赖
//	stdLibDeps := info.FilterStdLib(true)
//	fmt.Printf("标准库依赖数量: %d\n", len(stdLibDeps))
//
//	// 排除标准库依赖
//	thirdPartyDeps := info.FilterStdLib(false)
//	fmt.Printf("第三方依赖数量: %d\n", len(thirdPartyDeps))
func (info *BinaryInfo) FilterStdLib(include bool) []DependencyInfo {
	return info.FilterDependencies(func(dep DependencyInfo) bool {
		isStd := IsStdLib(dep.Path)
		return isStd == include
	})
}

// FilterStdLib 从依赖列表中过滤出非标准库的依赖。
// 这是一个全局函数，接受依赖列表作为参数。
//
// 参数:
//   - dependencies: 要过滤的依赖列表
//
// 返回:
//   - []DependencyInfo: 过滤后的依赖列表，只包含非标准库依赖
//
// 使用示例:
//
//	// 过滤掉标准库依赖
//	thirdPartyDeps := gobinaryparser.FilterStdLib(info.Dependencies)
//	fmt.Printf("第三方依赖数量: %d\n", len(thirdPartyDeps))
func FilterStdLib(dependencies []DependencyInfo) []DependencyInfo {
	filtered := make([]DependencyInfo, 0)
	for _, dep := range dependencies {
		if !IsStdLib(dep.Path) {
			filtered = append(filtered, dep)
		}
	}
	return filtered
}

// GetDependencyByPath 返回具有指定路径的依赖，如果未找到则返回nil。
//
// 参数:
//   - path: 要查找的依赖路径
//
// 返回:
//   - *DependencyInfo: 找到的依赖，未找到则为nil
//
// 使用示例:
//
//	// 检查二进制文件是否使用了特定依赖
//	dep := info.GetDependencyByPath("github.com/spf13/cobra")
//	if dep != nil {
//		fmt.Printf("发现依赖 %s@%s\n", dep.Path, dep.Version)
//		if dep.Replace != nil {
//			fmt.Printf("被替换为 %s@%s\n", dep.Replace.Path, dep.Replace.Version)
//		}
//	} else {
//		fmt.Println("未找到依赖")
//	}
func (info *BinaryInfo) GetDependencyByPath(path string) *DependencyInfo {
	for _, dep := range info.Dependencies {
		if dep.Path == path {
			return &dep
		}
	}
	return nil
}

// IsStdLib 判断给定的路径是否属于Go标准库。
// 标准库路径不包含域名（没有点号）。
//
// 参数:
//   - path: 要检查的导入路径
//
// 返回:
//   - bool: 如果是标准库路径，返回true，否则返回false
//
// 使用示例:
//
//	if gobinaryparser.IsStdLib("fmt") {
//		fmt.Println("这是标准库")
//	}
//
//	if !gobinaryparser.IsStdLib("github.com/spf13/cobra") {
//		fmt.Println("这不是标准库")
//	}
func IsStdLib(path string) bool {
	// 标准库路径不包含点号
	return !strings.Contains(path, ".")
}
