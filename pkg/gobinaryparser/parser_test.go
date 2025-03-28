package gobinaryparser

import (
	"os"
	"path/filepath"
	"testing"
)

func TestFilterDependencies(t *testing.T) {
	// Create a mock BinaryInfo for testing
	info := &BinaryInfo{
		Dependencies: []DependencyInfo{
			{Path: "github.com/example/pkg1", Version: "v1.0.0"},
			{Path: "github.com/example/pkg2", Version: "v2.0.0"},
			{Path: "context", Version: ""},  // stdlib
			{Path: "fmt", Version: ""},      // stdlib
			{Path: "net/http", Version: ""}, // stdlib
			{Path: "golang.org/x/net", Version: "v0.1.0"},
		},
	}

	// Test filtering for third-party dependencies (containing ".")
	thirdPartyDeps := info.FilterDependencies(func(dep DependencyInfo) bool {
		for i := 0; i < len(dep.Path); i++ {
			if dep.Path[i] == '.' {
				return true
			}
		}
		return false
	})

	if len(thirdPartyDeps) != 3 {
		t.Errorf("Expected 3 third-party dependencies, got %d", len(thirdPartyDeps))
	}

	// Test filtering for standard library dependencies (not containing ".")
	stdlibDeps := info.FilterDependencies(func(dep DependencyInfo) bool {
		for i := 0; i < len(dep.Path); i++ {
			if dep.Path[i] == '.' {
				return false
			}
		}
		return true
	})

	if len(stdlibDeps) != 3 {
		t.Errorf("Expected 3 standard library dependencies, got %d", len(stdlibDeps))
	}

	// Test with nil filter
	allDeps := info.FilterDependencies(nil)
	if len(allDeps) != len(info.Dependencies) {
		t.Errorf("Expected %d dependencies with nil filter, got %d",
			len(info.Dependencies), len(allDeps))
	}
}

func TestGetDependencyByPath(t *testing.T) {
	// Create a mock BinaryInfo for testing
	info := &BinaryInfo{
		Dependencies: []DependencyInfo{
			{Path: "github.com/example/pkg1", Version: "v1.0.0"},
			{Path: "github.com/example/pkg2", Version: "v2.0.0"},
			{Path: "golang.org/x/net", Version: "v0.1.0"},
		},
	}

	// Test finding an existing dependency
	dep := info.GetDependencyByPath("github.com/example/pkg1")
	if dep == nil {
		t.Error("Expected to find dependency 'github.com/example/pkg1', got nil")
	} else if dep.Version != "v1.0.0" {
		t.Errorf("Expected version 'v1.0.0', got '%s'", dep.Version)
	}

	// Test finding a non-existent dependency
	dep = info.GetDependencyByPath("github.com/nonexistent/pkg")
	if dep != nil {
		t.Errorf("Expected nil for non-existent dependency, got %v", dep)
	}
}

func TestParseBinaryFromPath(t *testing.T) {
	// Skip this test if running in an environment where we don't have Go binaries
	// or can't create test files
	if testing.Short() {
		t.Skip("Skipping test in short mode")
	}

	// Test with a non-existent file
	tempDir, err := os.MkdirTemp("", "binaryparser-test")
	if err != nil {
		t.Fatalf("Failed to create temp directory: %v", err)
	}
	defer os.RemoveAll(tempDir)

	nonExistentPath := filepath.Join(tempDir, "nonexistent")
	_, err = ParseBinaryFromPath(nonExistentPath)
	if err == nil {
		t.Error("Expected error when parsing non-existent file, got nil")
	}

	// Note: Testing with a real Go binary would require having access to one during tests
	// A more comprehensive test would compile a small Go program and then parse it
}

// This is a helper function for creating a mock binary file for testing,
// However, this doesn't create an actual Go binary with buildinfo, so it's expected to fail
func createMockBinaryFile(t *testing.T) string {
	t.Helper()

	tempFile, err := os.CreateTemp("", "mock-go-binary-*.bin")
	if err != nil {
		t.Fatalf("Failed to create temp file: %v", err)
	}

	// Write some dummy content
	if _, err := tempFile.Write([]byte("mock binary content")); err != nil {
		t.Fatalf("Failed to write to temp file: %v", err)
	}

	if err := tempFile.Close(); err != nil {
		t.Fatalf("Failed to close temp file: %v", err)
	}

	return tempFile.Name()
}

// TestBinaryInfo tests the BinaryInfo structure and its methods
func TestBinaryInfo(t *testing.T) {
	// Create a test BinaryInfo
	info := &BinaryInfo{
		Path:       "github.com/example/testapp",
		Version:    "v1.0.0",
		GoVersion:  "go1.17.5",
		FilePath:   "/path/to/binary",
		SourceType: "file",
		BuildSettings: map[string]string{
			"GOOS":   "linux",
			"GOARCH": "amd64",
		},
		Dependencies: []DependencyInfo{
			{
				Path:    "github.com/example/dep1",
				Version: "v1.0.0",
				Sum:     "h1:123456abcdef",
			},
			{
				Path:    "github.com/example/dep2",
				Version: "v2.0.0",
				Sum:     "h1:fedcba654321",
				Replace: &DependencyInfo{
					Path:    "github.com/fork/dep2",
					Version: "v2.0.1",
					Sum:     "h1:654321abcdef",
				},
			},
			{
				Path:    "context",
				Version: "",
			},
		},
	}

	// Test GetDependencyByPath with existing dependency
	dep := info.GetDependencyByPath("github.com/example/dep1")
	if dep == nil {
		t.Error("Expected to find dependency 'github.com/example/dep1', got nil")
	} else if dep.Version != "v1.0.0" {
		t.Errorf("Expected version 'v1.0.0', got '%s'", dep.Version)
	}

	// Test GetDependencyByPath with replaced dependency
	dep = info.GetDependencyByPath("github.com/example/dep2")
	if dep == nil {
		t.Error("Expected to find dependency 'github.com/example/dep2', got nil")
	} else if dep.Replace == nil {
		t.Error("Expected dependency to have a replacement, got nil Replace")
	} else if dep.Replace.Path != "github.com/fork/dep2" {
		t.Errorf("Expected replacement path 'github.com/fork/dep2', got '%s'", dep.Replace.Path)
	}

	// Test FilterDependencies for third-party packages
	thirdPartyFilter := func(dep DependencyInfo) bool {
		return dep.Path != "context" // Все, кроме "context" (стандартной библиотеки)
	}
	thirdPartyDeps := info.FilterDependencies(thirdPartyFilter)
	if len(thirdPartyDeps) != 2 {
		t.Errorf("Expected 2 third-party dependencies, got %d", len(thirdPartyDeps))
	}

	// Test FilterDependencies with nil filter
	allDeps := info.FilterDependencies(nil)
	if len(allDeps) != len(info.Dependencies) {
		t.Errorf("Expected %d dependencies with nil filter, got %d",
			len(info.Dependencies), len(allDeps))
	}

	// Test FilterDependencies for replaced dependencies
	replacedFilter := func(dep DependencyInfo) bool {
		return dep.Replace != nil
	}
	replacedDeps := info.FilterDependencies(replacedFilter)
	if len(replacedDeps) != 1 {
		t.Errorf("Expected 1 replaced dependency, got %d", len(replacedDeps))
	}
	if len(replacedDeps) > 0 && replacedDeps[0].Path != "github.com/example/dep2" {
		t.Errorf("Expected replaced dependency path 'github.com/example/dep2', got '%s'",
			replacedDeps[0].Path)
	}
}
