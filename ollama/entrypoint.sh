#!/bin/sh

# 1. /etc/docker/daemon.json 생성 또는 덮어쓰기
cat <<EOF > /etc/docker/daemon.json
{
    "default-runtime": "nvidia",
    "runtimes": {
        "nvidia": {
            "path": "nvidia-container-runtime",
            "runtimeArgs": []
        }
    }
}
EOF

# 2. Docker 데몬 재시작 (권한 필요, 컨테이너 내부에서는 보통 사용하지 않음)
if command -v systemctl >/dev/null 2>&1; then
    systemctl restart docker
elif command -v service >/dev/null 2>&1; then
    service docker restart
else
    echo "Docker 데몬 재시작 명령을 찾을 수 없습니다. 수동으로 재시작하세요."
fi

# 3. Ollama 서버 백그라운드 실행
ollama serve &
sleep 5
ollama pull gemma3:1b
wait
