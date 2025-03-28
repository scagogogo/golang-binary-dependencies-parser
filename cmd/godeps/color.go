package main

import (
	"strings"

	"github.com/fatih/color"
)

// Color formatters
var (
	headerColor      = color.New(color.FgHiCyan, color.Bold)
	subHeaderColor   = color.New(color.FgCyan)
	successColor     = color.New(color.FgGreen)
	errorColor       = color.New(color.FgRed)
	highlightColor   = color.New(color.FgYellow)
	replacedColor    = color.New(color.FgMagenta)
	moduleColor      = color.New(color.FgBlue)
	versionColor     = color.New(color.FgHiGreen)
	tableHeaderColor = color.New(color.FgWhite, color.Bold)
	warnColor        = color.New(color.FgYellow, color.Bold)
	stdlibColor      = color.New(color.FgHiBlue)
)

// highlightSubstring returns a string with the substring highlighted
func highlightSubstring(s, substr string) string {
	if i := strings.Index(strings.ToLower(s), strings.ToLower(substr)); i >= 0 {
		before := s[:i]
		match := s[i : i+len(substr)]
		after := s[i+len(substr):]

		moduleColor.Print(before)
		highlightColor.Print(match)
		moduleColor.Print(after)
		return ""
	}

	moduleColor.Print(s)
	return ""
}
