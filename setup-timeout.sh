#!/bin/bash
# Скрипт для автоматической настройки таймаута 3 минуты (180 секунд) в Netlify CLI

TIMEOUT_MS=300000  # 5 минут в миллисекундах

echo "🔍 Ищу установку Netlify CLI..."

# Пробуем найти файл dev.ts в разных местах
POSSIBLE_PATHS=(
  "$(npm root -g)/netlify-cli/src/utils/dev.ts"
  "$HOME/.npm-global/lib/node_modules/netlify-cli/src/utils/dev.ts"
  "/usr/local/lib/node_modules/netlify-cli/src/utils/dev.ts"
  "/opt/homebrew/lib/node_modules/netlify-cli/src/utils/dev.ts"
)

DEV_FILE=""
for path in "${POSSIBLE_PATHS[@]}"; do
  if [ -f "$path" ]; then
    DEV_FILE="$path"
    break
  fi
done

# Если не нашли, пробуем найти через which
if [ -z "$DEV_FILE" ]; then
  NETLIFY_PATH=$(which netlify 2>/dev/null)
  if [ -n "$NETLIFY_PATH" ]; then
    # Получаем директорию, где находится netlify
    NETLIFY_DIR=$(dirname "$NETLIFY_PATH")
    # Пробуем найти dev.ts относительно этой директории
    if [ -f "$NETLIFY_DIR/../lib/node_modules/netlify-cli/src/utils/dev.ts" ]; then
      DEV_FILE="$NETLIFY_DIR/../lib/node_modules/netlify-cli/src/utils/dev.ts"
    fi
  fi
fi

if [ -z "$DEV_FILE" ]; then
  echo "❌ Не удалось найти файл dev.ts в Netlify CLI"
  echo "Пожалуйста, найдите файл вручную и измените SYNCHRONOUS_FUNCTION_TIMEOUT на $TIMEOUT_MS"
  exit 1
fi

echo "✅ Найден файл: $DEV_FILE"

# Проверяем, нужно ли изменять
CURRENT_TIMEOUT=$(grep -oP 'SYNCHRONOUS_FUNCTION_TIMEOUT\s*=\s*\K\d+' "$DEV_FILE" | head -1)

if [ -z "$CURRENT_TIMEOUT" ]; then
  echo "⚠️  Не удалось найти SYNCHRONOUS_FUNCTION_TIMEOUT в файле"
  exit 1
fi

if [ "$CURRENT_TIMEOUT" = "$TIMEOUT_MS" ]; then
  echo "✅ Таймаут уже установлен на $TIMEOUT_MS мс (5 минут)"
  exit 0
fi

echo "📝 Текущий таймаут: $CURRENT_TIMEOUT мс"
echo "🔄 Устанавливаю таймаут: $TIMEOUT_MS мс (5 минут)..."

# Создаем резервную копию
cp "$DEV_FILE" "$DEV_FILE.backup"
echo "💾 Создана резервная копия: $DEV_FILE.backup"

# Заменяем таймаут (используем sed для совместимости)
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/SYNCHRONOUS_FUNCTION_TIMEOUT\s*=\s*[0-9]*/SYNCHRONOUS_FUNCTION_TIMEOUT = $TIMEOUT_MS/g" "$DEV_FILE"
else
  # Linux
  sed -i "s/SYNCHRONOUS_FUNCTION_TIMEOUT\s*=\s*[0-9]*/SYNCHRONOUS_FUNCTION_TIMEOUT = $TIMEOUT_MS/g" "$DEV_FILE"
fi

# Проверяем результат
NEW_TIMEOUT=$(grep -oP 'SYNCHRONOUS_FUNCTION_TIMEOUT\s*=\s*\K\d+' "$DEV_FILE" | head -1)

if [ "$NEW_TIMEOUT" = "$TIMEOUT_MS" ]; then
  echo "✅ Таймаут успешно установлен на $TIMEOUT_MS мс (5 минут)"
  echo "⚠️  Внимание: После обновления Netlify CLI изменения будут потеряны"
  echo "   Запустите этот скрипт снова после обновления CLI"
else
  echo "❌ Ошибка при установке таймаута"
  echo "🔄 Восстанавливаю из резервной копии..."
  mv "$DEV_FILE.backup" "$DEV_FILE"
  exit 1
fi
