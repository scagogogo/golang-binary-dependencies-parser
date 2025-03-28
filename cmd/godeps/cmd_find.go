package main

import (
	"fmt"
	"os"
	"strings"
	"text/tabwriter"

	gobinaryparser "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
	"github.com/spf13/cobra"
)

// Find command flags
var findExactFlag bool

// findCmd represents the find command to search for a specific dependency
var findCmd = &cobra.Command{
	Use:   "find [flags] <dependency-name> <go-binary-file>",
	Short: "Find a specific dependency in a Go binary file",
	Long: `Find and display detailed information about a specific dependency in a Go binary file.
	
The search can be exact match or partial match. For partial match, it will find all dependencies
that contain the specified name in their import path.`,
	Run: func(cmd *cobra.Command, args []string) {
		dependencyName := args[0]
		binaryPath := args[1]

		// Parse the binary
		info, err := gobinaryparser.ParseBinaryFromFile(binaryPath)
		if err != nil {
			errorColor.Fprintf(os.Stderr, "Error parsing binary: %v\n", err)
			os.Exit(1)
		}

		// Find matching dependencies
		var matchingDeps []gobinaryparser.DependencyInfo

		if findExactFlag {
			// Exact match
			if dep := info.GetDependencyByPath(dependencyName); dep != nil {
				matchingDeps = append(matchingDeps, *dep)
			}
		} else {
			// Partial match - 查找路径中包含指定名称的所有依赖
			for _, dep := range info.Dependencies {
				if strings.Contains(dep.Path, dependencyName) {
					matchingDeps = append(matchingDeps, dep)
				}
			}
		}

		// Print results
		if len(matchingDeps) == 0 {
			warnColor.Printf("No dependencies matching '%s' found in %s\n", dependencyName, binaryPath)
			return
		}

		// Display results
		headerColor.Printf("🔍 Found %d dependencies matching '%s'\n\n", len(matchingDeps), dependencyName)

		// Use a tabwriter for aligned output
		w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)

		if verboseFlag {
			tableHeaderColor.Fprintln(w, "MODULE\tVERSION\tSUM\tREPLACED BY")
			for _, dep := range matchingDeps {
				replacedBy := ""
				if dep.Replace != nil {
					replacedBy = fmt.Sprintf("%s@%s", dep.Replace.Path, dep.Replace.Version)
				}

				// Highlight the matching part in the module path
				path := dep.Path
				if !findExactFlag {
					path = highlightSubstring(path, dependencyName)
				} else {
					moduleColor.Fprintf(w, "%s\t", path)
				}

				versionColor.Fprintf(w, "%s\t", dep.Version)
				fmt.Fprintf(w, "%s\t", dep.Sum)

				if replacedBy != "" {
					replacedColor.Fprintf(w, "%s", replacedBy)
				}
				fmt.Fprintln(w)
			}
		} else {
			tableHeaderColor.Fprintln(w, "MODULE\tVERSION\tREPLACED BY")
			for _, dep := range matchingDeps {
				replacedBy := ""
				if dep.Replace != nil {
					replacedBy = fmt.Sprintf("%s@%s", dep.Replace.Path, dep.Replace.Version)
				}

				// Print with colors
				moduleColor.Fprintf(w, "%s\t", dep.Path)
				versionColor.Fprintf(w, "%s\t", dep.Version)

				if replacedBy != "" {
					replacedColor.Fprintf(w, "%s", replacedBy)
				}
				fmt.Fprintln(w)
			}
		}

		w.Flush()
	},
}

// initFindCmd initializes the find command
func initFindCmd() {
	// Find command flags
	findCmd.Flags().BoolVarP(&findExactFlag, "exact", "e", false, "Match the dependency name exactly")
	findCmd.Flags().BoolVarP(&verboseFlag, "verbose", "v", false, "Show detailed information including checksums")
}
