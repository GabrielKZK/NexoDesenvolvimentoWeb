@echo off
rem Sobe o backend em modo leve (perfil "mobile"), para desenvolver e testar o app.
rem Requisitos: JDK 17 ou superior no PATH (ou JAVA_HOME). Porta: 8080.
rem Banco: H2 em arquivo (pasta data/), sem Postgres. Com o banco vazio o seed cria
rem os usuarios aluno, professor, diretor e admin, todos com a senha 123456.
setlocal
cd /d "%~dp0"

rem O backend exige o segredo do JWT no ambiente. Para desenvolvimento local usa um valor
rem fixo; para outro ambiente defina NEXO_JWT_SECRET antes de rodar este script.
if "%NEXO_JWT_SECRET%"=="" (
  set "NEXO_JWT_SECRET=segredo-de-desenvolvimento-local-nao-usar-em-producao-0123456789"
  echo [aviso] NEXO_JWT_SECRET nao definido: usando um segredo FIXO de desenvolvimento.
)

rem Usa o Java do JAVA_HOME quando definido (evita pegar um Java antigo que esteja no PATH).
set "JAVA=java"
if defined JAVA_HOME set "JAVA=%JAVA_HOME%\bin\java.exe"

rem O backend precisa de JDK 17 ou superior.
set "JV="
"%JAVA%" -version 2> "%TEMP%\nexo-javaver.txt"
for /f "tokens=3" %%v in ('findstr /i "version" "%TEMP%\nexo-javaver.txt"') do if not defined JV set "JV=%%~v"
del "%TEMP%\nexo-javaver.txt" 2>nul
for /f "tokens=1,2 delims=." %%a in ("%JV%") do (set "MAJOR=%%a" & set "MINOR=%%b")
if "%MAJOR%"=="1" set "MAJOR=%MINOR%"
if not defined MAJOR goto :javaantigo
if %MAJOR% LSS 17 goto :javaantigo
goto :javaok
:javaantigo
echo [erro] Java %JV% encontrado, mas o backend precisa de JDK 17 ou superior.
echo        Instale o JDK 17+ (ex.: Eclipse Temurin) e defina JAVA_HOME apontando para ele.
exit /b 1
:javaok

rem Compila uma vez (gera target\nexo-backend-*.jar). Depois roda direto do .jar, sem deixar o
rem Maven aberto (economiza ~300 MB). Para recompilar apos mudar o codigo, apague a pasta target.
set "JAR="
for %%f in (target\nexo-backend-*.jar) do if not "%%~xf"==".original" set "JAR=%%f"
if not defined JAR (
  call mvnw.cmd -q -DskipTests package || exit /b 1
  for %%f in (target\nexo-backend-*.jar) do if not "%%~xf"==".original" set "JAR=%%f"
)

rem Limites da JVM: ~400 MB no maximo, GC simples e compilacao rapida (inicio mais veloz).
"%JAVA%" -Xmx384m -XX:+UseSerialGC -XX:TieredStopAtLevel=1 -Dspring.profiles.active=mobile -jar "%JAR%"
