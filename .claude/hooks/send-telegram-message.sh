# Vérifie que les variables d'environnement sont définies
if [[ -z "$CLAUDE_CODE_TELEGRAM_TOKEN" || -z "$CLAUDE_CODE_TELEGRAM_CHAT_ID" ]]; then
  exit 0
fi

if [ ! -f CLAUDE_TEST.md ]; then
  exit 0
fi

TOKEN="$CLAUDE_CODE_TELEGRAM_TOKEN"
CHAT_ID="$CLAUDE_CODE_TELEGRAM_CHAT_ID"
MESSAGE="$1"

# Envoie le message avec curl
curl -s -X POST "https://api.telegram.org/bot${TOKEN}/sendMessage" \
  -d "chat_id=${CHAT_ID}" \
  -d "text=${MESSAGE}" > /dev/null

rm CLAUDE_TEST.md