package main

import (
	"encoding/json"
	"fmt"
	"os"
	"text/tabwriter"

	gobinaryparser "github.com/scagogogo/golang-binary-dependencies-parser/pkg/gobinaryparser"
)

// printInfo prints the binary information in a colorful human-readable format
func printInfo(info *gobinaryparser.BinaryInfo, deps []gobinaryparser.DependencyInfo) {
	// Print header and basic info
	headerColor.Println("📦 Go Binary Dependency Analysis")
	fmt.Println()

	subHeaderColor.Print("Binary: ")
	fmt.Println(info.FilePath)

	subHeaderColor.Print("Main module: ")
	moduleColor.Printf("%s", info.Path)
	fmt.Print("@")
	versionColor.Println(info.Version)

	subHeaderColor.Print("Go version: ")
	successColor.Println(info.GoVersion)

	// Print build settings if verbose
	if verboseFlag && len(info.BuildSettings) > 0 {
		fmt.Println()
		subHeaderColor.Println("Build Settings:")
		for k, v := range info.BuildSettings {
			fmt.Printf("  %s = ", k)
			highlightColor.Println(v)
		}
	}

	// Print dependencies
	fmt.Println()
	subHeaderColor.Print("Dependencies ")
	highlightColor.Printf("(%d)", len(deps))
	subHeaderColor.Println(":")

	// Use a tabwriter for aligned output
	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)

	if verboseFlag {
		tableHeaderColor.Fprintln(w, "  MODULE\tVERSION\tSUM\tREPLACED BY")
		for _, dep := range deps {
			replacedBy := ""
			if dep.Replace != nil {
				replacedBy = fmt.Sprintf("%s@%s", dep.Replace.Path, dep.Replace.Version)
			}

			// Print with colors
			fmt.Fprint(w, "  ")
			moduleColor.Fprintf(w, "%s\t", dep.Path)
			versionColor.Fprintf(w, "%s\t", dep.Version)
			fmt.Fprintf(w, "%s\t", dep.Sum)

			if replacedBy != "" {
				replacedColor.Fprintf(w, "%s", replacedBy)
			}
			fmt.Fprintln(w)
		}
	} else {
		tableHeaderColor.Fprintln(w, "  MODULE\tVERSION\tREPLACED BY")
		for _, dep := range deps {
			replacedBy := ""
			if dep.Replace != nil {
				replacedBy = fmt.Sprintf("%s@%s", dep.Replace.Path, dep.Replace.Version)
			}

			// Print with colors
			fmt.Fprint(w, "  ")
			moduleColor.Fprintf(w, "%s\t", dep.Path)
			versionColor.Fprintf(w, "%s\t", dep.Version)

			if replacedBy != "" {
				replacedColor.Fprintf(w, "%s", replacedBy)
			}
			fmt.Fprintln(w)
		}
	}

	w.Flush()
}

// printJSON prints the information in JSON format
func printJSON(info *gobinaryparser.BinaryInfo, deps []gobinaryparser.DependencyInfo) {
	// Create a struct to hold the JSON data
	type ReplaceInfo struct {
		Path    string `json:"path"`
		Version string `json:"version"`
		Sum     string `json:"sum,omitempty"`
	}

	type DependencyOutput struct {
		Path    string       `json:"path"`
		Version string       `json:"version"`
		Sum     string       `json:"sum,omitempty"`
		Replace *ReplaceInfo `json:"replace,omitempty"`
	}

	type MainModule struct {
		Path    string `json:"path"`
		Version string `json:"version"`
	}

	type Output struct {
		Binary        string             `json:"binary"`
		Main          MainModule         `json:"main"`
		GoVersion     string             `json:"goVersion"`
		BuildSettings map[string]string  `json:"buildSettings,omitempty"`
		Dependencies  []DependencyOutput `json:"dependencies"`
	}

	// Create the output data
	output := Output{
		Binary: info.FilePath,
		Main: MainModule{
			Path:    info.Path,
			Version: info.Version,
		},
		GoVersion:    info.GoVersion,
		Dependencies: make([]DependencyOutput, 0, len(deps)),
	}

	if verboseFlag {
		output.BuildSettings = info.BuildSettings
	}

	// Add dependencies
	for _, dep := range deps {
		depOutput := DependencyOutput{
			Path:    dep.Path,
			Version: dep.Version,
		}

		if verboseFlag {
			depOutput.Sum = dep.Sum
		}

		if dep.Replace != nil {
			replaceInfo := &ReplaceInfo{
				Path:    dep.Replace.Path,
				Version: dep.Replace.Version,
			}

			if verboseFlag {
				replaceInfo.Sum = dep.Replace.Sum
			}

			depOutput.Replace = replaceInfo
		}

		output.Dependencies = append(output.Dependencies, depOutput)
	}

	// Marshal to JSON
	jsonData, err := json.MarshalIndent(output, "", "  ")
	if err != nil {
		errorColor.Fprintf(os.Stderr, "Error encoding to JSON: %v\n", err)
		os.Exit(1)
	}

	// Print the JSON
	fmt.Println(string(jsonData))
}
