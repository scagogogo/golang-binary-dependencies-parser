package main

import (
	"fmt"
	"os"
	"strings"

	gobinaryparser "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
	"github.com/spf13/cobra"
)

// stdlibCmd represents the stdlib command to show only standard library dependencies
var stdlibCmd = &cobra.Command{
	Use:   "stdlib [flags] <go-binary-file>",
	Short: "Show only standard library dependencies",
	Long:  "Parse a Go binary file and show only the standard library dependencies used by the binary.",
	Run: func(cmd *cobra.Command, args []string) {
		binaryPath := args[0]

		// Parse the binary
		info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
		if err != nil {
			errorColor.Fprintf(os.Stderr, "Error parsing binary: %v\n", err)
			os.Exit(1)
		}

		// 筛选标准库依赖（使用IsStdLib函数）
		var stdlibDeps []gobinaryparser.DependencyInfo
		for _, dep := range info.Dependencies {
			if gobinaryparser.IsStdLib(dep.Path) {
				stdlibDeps = append(stdlibDeps, dep)
			}
		}

		// Print results
		headerColor.Printf("📚 Standard Library Dependencies (%d)\n\n", len(stdlibDeps))

		// Group by package prefix (like net/, context, fmt, etc)
		groups := make(map[string][]string)

		for _, dep := range stdlibDeps {
			parts := strings.SplitN(dep.Path, "/", 2)
			prefix := parts[0]

			if len(parts) > 1 {
				groups[prefix] = append(groups[prefix], parts[1])
			} else {
				groups[prefix] = append(groups[prefix], "")
			}
		}

		// Print grouped packages
		for prefix, subPackages := range groups {
			stdlibColor.Printf("%s\n", prefix)

			if len(subPackages[0]) > 0 { // Not a single package
				for _, subPkg := range subPackages {
					fmt.Printf("  ├─ %s\n", subPkg)
				}
			}
			fmt.Println()
		}

		// Print summary
		fmt.Println()
		subHeaderColor.Print("Total: ")
		highlightColor.Printf("%d standard library packages\n", len(stdlibDeps))
	},
}

// initStdlibCmd initializes the stdlib command
func initStdlibCmd() {
	// No specific flags for stdlib command currently
}
