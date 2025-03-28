package main

import (
	"fmt"
	"os"

	"github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
	"github.com/spf13/cobra"
)

var (
	// Command line flags
	filterStdLibFlag bool
	jsonOutputFlag   bool
	verboseFlag      bool
	showReplacedFlag bool
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "godeps [flags] <go-binary-file>",
	Short: "Parse and display dependencies from Go binary files",
	Long: `godeps is a tool that parses Go binary files and displays their dependencies.

It extracts information such as:
  • Main module path and version
  • Go version used for building
  • All module dependencies and their versions
  • Replaced dependencies
  • Build settings`,
	// 阻止Cobra将参数尝试解析为子命令
	DisableFlagParsing: false,
	Args: func(cmd *cobra.Command, args []string) error {
		// 在这里，我们允许用户直接传递一个文件路径作为参数
		if len(args) < 1 {
			return fmt.Errorf("需要一个Go二进制文件路径")
		}
		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		// We expect at least one argument
		if len(args) < 1 {
			cmd.Help()
			os.Exit(1)
		}

		binaryPath := args[0]

		// Parse the binary
		info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
		if err != nil {
			errorColor.Fprintf(os.Stderr, "Error parsing binary: %v\n", err)
			os.Exit(1)
		}

		// Filter dependencies if needed
		dependencies := info.Dependencies
		if filterStdLibFlag {
			dependencies = gobinaryparser.FilterStdLib(info.Dependencies)
		}

		if showReplacedFlag {
			// 筛选出有替换的依赖
			replaced := make([]gobinaryparser.DependencyInfo, 0)
			for _, dep := range dependencies {
				if dep.Replace != nil {
					replaced = append(replaced, dep)
				}
			}
			dependencies = replaced
		}

		// Output in JSON format if requested
		if jsonOutputFlag {
			printJSON(info, dependencies)
			return
		}

		// Print information in human-readable format
		printInfo(info, dependencies)
	},
}

// initCommands initializes all commands and their flags
func initCommands() {
	// Root command flags
	rootCmd.Flags().BoolVarP(&filterStdLibFlag, "nostdlib", "s", false, "Filter out standard library dependencies")
	rootCmd.Flags().BoolVarP(&jsonOutputFlag, "json", "j", false, "Output in JSON format")
	rootCmd.Flags().BoolVarP(&verboseFlag, "verbose", "v", false, "Show detailed information including checksums")
	rootCmd.Flags().BoolVarP(&showReplacedFlag, "replaced", "r", false, "Only show dependencies that have been replaced")

	// Initialize subcommands
	initFindCmd()
	initStdlibCmd()

	// Add subcommands to root command
	rootCmd.AddCommand(findCmd)
	rootCmd.AddCommand(stdlibCmd)
}
