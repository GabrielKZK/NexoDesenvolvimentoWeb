#!/usr/bin/env sh
# Sobe o backend em modo leve (perfil "mobile"), para desenvolver e testar o app.
# Requisitos: JDK 17 ou superior (JAVA_HOME ou no PATH). Porta: 8080.
# Banco: H2 em arquivo (pasta data/), sem Postgres. Com o banco vazio o seed cria
# os usuários aluno, professor, diretor e admin, todos com a senha 123456.
cd "$(dirname "$0")" || exit 1

# O backend exige o segredo do JWT no ambiente. Para desenvolvimento local usa um valor
# fixo; para outro ambiente defina NEXO_JWT_SECRET antes de rodar este script.
if [ -z "$NEXO_JWT_SECRET" ]; then
  export NEXO_JWT_SECRET="segredo-de-desenvolvimento-local-nao-usar-em-producao-0123456789"
  echo "[aviso] NEXO_JWT_SECRET não definido: usando um segredo FIXO de desenvolvimento."
fi

# Usa o Java do JAVA_HOME quando definido (evita pegar um Java antigo que esteja no PATH).
JAVA=java
[ -n "$JAVA_HOME" ] && JAVA="$JAVA_HOME/bin/java"

# O backend precisa de JDK 17 ou superior.
VERSAO=$("$JAVA" -version 2>&1 | head -1 | sed -E 's/.*"([0-9]+)(\.([0-9]+))?.*/\1 \3/')
PRINCIPAL=${VERSAO%% *}
[ "$PRINCIPAL" = "1" ] && PRINCIPAL=${VERSAO##* }   # Java 8 aparece como "1.8"
if [ -z "$PRINCIPAL" ] || [ "$PRINCIPAL" -lt 17 ] 2>/dev/null; then
  echo "[erro] Java $PRINCIPAL encontrado, mas o backend precisa de JDK 17 ou superior."
  echo "       Instale o JDK 17+ (ex.: Eclipse Temurin) e defina JAVA_HOME apontando para ele."
  exit 1
fi

# Compila uma vez (gera target/nexo-backend-*.jar). Depois roda direto do .jar, sem deixar o
# Maven aberto (economiza ~300 MB). Para recompilar após mudar o código, apague a pasta target.
achar_jar() { ls target/nexo-backend-*.jar 2>/dev/null | grep -v '\.original$' | head -1; }
JAR=$(achar_jar)
if [ -z "$JAR" ]; then
  ./mvnw -q -DskipTests package || exit 1
  JAR=$(achar_jar)
fi

# Limites da JVM: ~400 MB no máximo, GC simples e compilação rápida (início mais veloz).
exec "$JAVA" -Xmx384m -XX:+UseSerialGC -XX:TieredStopAtLevel=1 -Dspring.profiles.active=mobile -jar "$JAR"
