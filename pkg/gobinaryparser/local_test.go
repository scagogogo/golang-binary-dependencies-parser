package gobinaryparser

import (
	"bytes"
	"io"
	"os"
	"path/filepath"
	"testing"
)

func TestParseBinaryFromBytes(t *testing.T) {
	// Этот тест будет немного искусственным, потому что мы не можем просто взять случайный набор байтов
	// и распарсить его как Go binary - нам нужен настоящий бинарный файл

	// Создаем фиктивный файл, который, конечно, не будет настоящим Go бинарным файлом
	// В реальных тестах лучше скомпилировать небольшую Go программу
	mockData := []byte("This is not a Go binary")
	_, err := ParseBinaryFromBytes(mockData)

	// Ожидаем ошибку, так как данные не являются валидным Go бинарным файлом
	if err == nil {
		t.Error("Expected error when parsing invalid binary data, got nil")
	}

	// В идеале, для более полного тестирования мы бы:
	// 1. Скомпилировали небольшую Go программу во временный файл
	// 2. Прочитали этот файл в []byte
	// 3. Запустили ParseBinaryFromBytes на этих байтах
	// 4. Проверили правильность результата
	// Но такой тест будет более сложным и требует компилятора Go
}

func TestParseBinaryFromReader(t *testing.T) {
	// Создаем мок io.ReaderAt
	mockData := []byte("This is not a Go binary")
	reader := bytes.NewReader(mockData)

	// Пытаемся парсить из этого reader
	_, err := ParseBinaryFromReader(reader)

	// Ожидаем ошибку, так как данные не являются валидным Go бинарным файлом
	if err == nil {
		t.Error("Expected error when parsing invalid binary data, got nil")
	}

	// Аналогично предыдущему тесту, для более полного покрытия потребуется
	// настоящий Go бинарный файл
}

// TestParseBinaryFromPath_InvalidFile проверяет, что функция обрабатывает случай с недопустимым файлом
func TestParseBinaryFromPath_InvalidFile(t *testing.T) {
	// Создаем временный файл, который не является Go бинарным файлом
	tempFile, err := os.CreateTemp("", "notgobinary-*.txt")
	if err != nil {
		t.Fatalf("Failed to create temp file: %v", err)
	}
	defer os.Remove(tempFile.Name())

	// Записываем что-то, что точно не будет валидным Go бинарным файлом
	_, err = tempFile.Write([]byte("This is not a Go binary"))
	if err != nil {
		t.Fatalf("Failed to write to temp file: %v", err)
	}

	err = tempFile.Close()
	if err != nil {
		t.Fatalf("Failed to close temp file: %v", err)
	}

	// Теперь пытаемся парсить этот файл
	_, err = ParseBinaryFromPath(tempFile.Name())

	// Ожидаем ошибку
	if err == nil {
		t.Error("Expected error when parsing invalid Go binary file, got nil")
	}
}

// TestParseBinaryFromPath_NonExistentFile проверяет, что функция корректно обрабатывает несуществующий файл
func TestParseBinaryFromPath_NonExistentFile(t *testing.T) {
	// Создаем путь к файлу, который точно не существует
	nonexistentPath := filepath.Join(t.TempDir(), "nonexistent-binary")

	// Теперь пытаемся парсить этот файл
	_, err := ParseBinaryFromPath(nonexistentPath)

	// Ожидаем ошибку о несуществующем файле
	if err == nil {
		t.Error("Expected error when parsing non-existent file, got nil")
	}

	if err != nil && !os.IsNotExist(os.ErrNotExist) {
		t.Logf("Got appropriate error for non-existent file: %v", err)
	}
}

// mockReaderWithError - это мок для io.ReaderAt, который всегда возвращает ошибку
type mockReaderWithError struct {
	err error
}

func (m mockReaderWithError) ReadAt(p []byte, off int64) (int, error) {
	return 0, m.err
}

// TestParseBinaryFromReader_Error проверяет, что функция корректно обрабатывает ошибки чтения
func TestParseBinaryFromReader_Error(t *testing.T) {
	// Создаем reader, который всегда возвращает ошибку
	expectedErr := io.ErrUnexpectedEOF
	reader := mockReaderWithError{err: expectedErr}

	// Пытаемся парсить из этого reader
	_, err := ParseBinaryFromReader(reader)

	// Проверяем, что функция вернула ошибку
	if err == nil {
		t.Error("Expected error when reader fails, got nil")
	}
}
