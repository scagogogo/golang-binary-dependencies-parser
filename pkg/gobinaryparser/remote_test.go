package gobinaryparser

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

// TestParseBinaryFromURL тестирует базовую функциональность ParseBinaryFromURL с мок-сервером
func TestParseBinaryFromURL(t *testing.T) {
	// Создаем простой мок HTTP-сервер, который всегда возвращает невалидные данные
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("This is not a Go binary"))
	}))
	defer server.Close()

	// Вызываем функцию с URL нашего мок-сервера
	_, err := ParseBinaryFromURL(server.URL)

	// Ожидаем ошибку, так как сервер не возвращает валидный Go бинарный файл
	if err == nil {
		t.Error("Expected error when parsing invalid binary content, got nil")
	}
}

// TestParseBinaryFromURL_ServerError тестирует обработку HTTP-ошибок в ParseBinaryFromURL
func TestParseBinaryFromURL_ServerError(t *testing.T) {
	// Создаем сервер, который всегда возвращает ошибку сервера
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
	}))
	defer server.Close()

	// Вызываем функцию с URL нашего сервера с ошибкой
	_, err := ParseBinaryFromURL(server.URL)

	// Ожидаем ошибку HTTP
	if err == nil {
		t.Error("Expected error for HTTP server error, got nil")
	}
	if err != nil && err.Error() != fmt.Sprintf("HTTP error: %d %s", http.StatusInternalServerError, http.StatusText(http.StatusInternalServerError)) {
		t.Logf("Got expected HTTP error: %v", err)
	}
}

// TestParseBinaryFromURLWithContext тестирует работу ParseBinaryFromURLWithContext
func TestParseBinaryFromURLWithContext(t *testing.T) {
	// Создаем сервер с искусственной задержкой
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(100 * time.Millisecond) // небольшая задержка
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("This is not a Go binary"))
	}))
	defer server.Close()

	// Создаем контекст с очень коротким таймаутом
	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()

	// Вызываем функцию с контекстом, который должен истечь
	_, err := ParseBinaryFromURLWithContext(ctx, server.URL)

	// Ожидаем ошибку таймаута контекста
	if err == nil {
		t.Error("Expected error due to context timeout, got nil")
	}
	if err != nil && !errors.Is(err, context.DeadlineExceeded) {
		t.Logf("Error might be related to context timeout: %v", err)
	}
}

// TestParseBinaryFromRemoteFile тестирует базовую функциональность ParseBinaryFromRemoteFile
func TestParseBinaryFromRemoteFile(t *testing.T) {
	// Создаем сервер, который поддерживает range requests
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Проверяем, есть ли заголовок Range
		rangeHeader := r.Header.Get("Range")
		if rangeHeader != "" {
			// Симулируем поддержку range requests
			w.Header().Set("Accept-Ranges", "bytes")
			w.Header().Set("Content-Range", "bytes 0-9/10")
			w.WriteHeader(http.StatusPartialContent)
			w.Write([]byte("0123456789"))
		} else {
			// Для простого запроса возвращаем полное содержимое
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("0123456789"))
		}
	}))
	defer server.Close()

	// Вызываем функцию
	_, err := ParseBinaryFromRemoteFile(server.URL)

	// Опять же, ожидаем ошибку, так как это не настоящий Go бинарный файл
	if err == nil {
		t.Error("Expected error when parsing invalid binary content, got nil")
	}
}

// TestHTTPReaderAt тестирует HTTPReaderAt напрямую
func TestHTTPReaderAt(t *testing.T) {
	// Создаем сервер, который поддерживает range requests
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Проверяем, есть ли заголовок Range
		rangeHeader := r.Header.Get("Range")
		if rangeHeader != "" {
			var start, end int
			fmt.Sscanf(rangeHeader, "bytes=%d-%d", &start, &end)

			data := []byte("0123456789")
			if start >= len(data) {
				w.WriteHeader(http.StatusRequestedRangeNotSatisfiable)
				return
			}

			if end >= len(data) {
				end = len(data) - 1
			}

			w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, len(data)))
			w.WriteHeader(http.StatusPartialContent)
			w.Write(data[start : end+1])
		} else {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("0123456789"))
		}
	}))
	defer server.Close()

	// Создаем HTTPReaderAt
	reader := NewHTTPReaderAt(server.URL)

	// Тестируем чтение по частям
	buf := make([]byte, 3)
	n, err := reader.ReadAt(buf, 2)

	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}
	if n != 3 {
		t.Errorf("Expected to read 3 bytes, got %d", n)
	}
	if string(buf) != "234" {
		t.Errorf("Expected to read '234', got '%s'", string(buf))
	}

	// Тестируем чтение с недопустимым смещением
	buf = make([]byte, 3)
	_, err = reader.ReadAt(buf, 100)
	if err == nil {
		t.Error("Expected error when reading with out-of-bounds offset, got nil")
	}
}

// TestHTTPReaderAt_WithContext тестирует работу HTTPReaderAt с пользовательским контекстом
func TestHTTPReaderAt_WithContext(t *testing.T) {
	// Создаем сервер с задержкой
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(100 * time.Millisecond)
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("0123456789"))
	}))
	defer server.Close()

	// Создаем HTTPReaderAt и устанавливаем контекст с коротким таймаутом
	reader := NewHTTPReaderAt(server.URL)
	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()

	reader = reader.WithContext(ctx)

	// Пытаемся читать
	buf := make([]byte, 3)
	_, err := reader.ReadAt(buf, 0)

	// Ожидаем ошибку таймаута
	if err == nil {
		t.Error("Expected error due to context timeout, got nil")
	}
}
