// Command godeps parses and displays dependencies from Go binary files.
package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func main() {
	// 如果第一个参数看起来像文件路径（不是命令或标志）
	// 我们需要特殊处理以避免Cobra将其解析为子命令
	if len(os.Args) > 1 && !isCommand(os.Args[1]) && !isFlag(os.Args[1]) {
		// 确保第一个参数是以 / 或 . 开头的文件路径，且不是已知命令
		args := []string{os.Args[0], "--"}
		args = append(args, os.Args[1:]...)
		os.Args = args
	}

	// Initialize all commands
	initCommands()

	// Setup custom error handling for all commands
	setupCustomErrorHandling()

	// Intercept the case where no arguments are provided
	if len(os.Args) == 1 {
		printCustomHelp()
		os.Exit(1)
	}

	// Execute the root command
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

// isCommand 检查参数是否是已知的子命令
func isCommand(arg string) bool {
	knownCommands := map[string]bool{
		"find":       true,
		"stdlib":     true,
		"completion": true,
		"help":       true,
	}
	return knownCommands[arg]
}

// isFlag 检查参数是否是命令行标志
func isFlag(arg string) bool {
	return len(arg) > 0 && (arg[0] == '-' || arg[0] == '/')
}

// setupCustomErrorHandling configures custom error messages for all commands
func setupCustomErrorHandling() {
	// Configure custom handling for root command
	rootCmd.SilenceErrors = true
	rootCmd.SilenceUsage = true

	// Configure find command
	findCmd.SilenceErrors = true
	findCmd.SilenceUsage = true

	// Old pre-run check will be replaced with a new one
	findCmd.Args = nil
	findCmd.PreRunE = func(cmd *cobra.Command, args []string) error {
		if len(args) < 2 {
			errorColor.Fprintf(os.Stderr, "❌ Error: 查找命令需要两个参数 - 依赖名称和二进制文件路径\n\n")
			warnColor.Fprintf(os.Stderr, "正确用法：\n")
			fmt.Fprintf(os.Stderr, "  godeps find <dependency-name> <go-binary-file>\n\n")
			fmt.Fprintf(os.Stderr, "例如：\n")
			fmt.Fprintf(os.Stderr, "  godeps find cobra /usr/local/bin/kubectl\n\n")
			return fmt.Errorf("missing arguments")
		}
		return nil
	}

	// Configure stdlib command
	stdlibCmd.SilenceErrors = true
	stdlibCmd.SilenceUsage = true

	// Old pre-run check will be replaced with a new one
	stdlibCmd.Args = nil
	stdlibCmd.PreRunE = func(cmd *cobra.Command, args []string) error {
		if len(args) < 1 {
			errorColor.Fprintf(os.Stderr, "❌ Error: stdlib命令需要一个二进制文件路径参数\n\n")
			warnColor.Fprintf(os.Stderr, "正确用法：\n")
			fmt.Fprintf(os.Stderr, "  godeps stdlib <go-binary-file>\n\n")
			fmt.Fprintf(os.Stderr, "例如：\n")
			fmt.Fprintf(os.Stderr, "  godeps stdlib /usr/local/bin/go\n\n")
			return fmt.Errorf("missing arguments")
		}
		return nil
	}
}

// printCustomHelp prints a custom help message with color
func printCustomHelp() {
	errorColor.Fprintf(os.Stderr, "❌ Error: 没有提供二进制文件参数\n\n")
	warnColor.Fprintf(os.Stderr, "请提供一个Go二进制文件作为参数，例如：\n")
	highlightColor.Fprintf(os.Stderr, "  godeps /path/to/your/go-binary\n\n")

	// Show nice header
	headerColor.Println("📋 Golang Binary Dependencies Parser")
	fmt.Println()

	// Print usage directly
	subHeaderColor.Println("Usage:")
	highlightColor.Println("  godeps [flags] <go-binary-file>")
	highlightColor.Println("  godeps [command]")
	fmt.Println()

	subHeaderColor.Println("Available Commands:")
	moduleColor.Print("  completion  ")
	fmt.Println("Generate the autocompletion script for the specified shell")
	moduleColor.Print("  find        ")
	fmt.Println("Find a specific dependency in a Go binary file")
	moduleColor.Print("  help        ")
	fmt.Println("Help about any command")
	moduleColor.Print("  stdlib      ")
	fmt.Println("Show only standard library dependencies")
	fmt.Println()

	subHeaderColor.Println("Flags:")
	highlightColor.Print("  -h, --help       ")
	fmt.Println("help for godeps")
	highlightColor.Print("  -j, --json       ")
	fmt.Println("Output in JSON format")
	highlightColor.Print("  -s, --nostdlib   ")
	fmt.Println("Filter out standard library dependencies")
	highlightColor.Print("  -r, --replaced   ")
	fmt.Println("Only show dependencies that have been replaced")
	highlightColor.Print("  -v, --verbose    ")
	fmt.Println("Show detailed information including checksums")

	// Show examples
	fmt.Println()
	subHeaderColor.Println("Examples:")
	successColor.Print("  godeps /usr/local/bin/go                   ")
	fmt.Println("# Analyze a binary")
	successColor.Print("  godeps -v -j /usr/local/bin/docker         ")
	fmt.Println("# Verbose JSON output")
	successColor.Print("  godeps find cobra /usr/local/bin/kubectl   ")
	fmt.Println("# Find specific dependency")
	successColor.Print("  godeps stdlib /usr/local/bin/go            ")
	fmt.Println("# Show standard library dependencies")
}
