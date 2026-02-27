#!/bin/bash
# start-display.sh — Sobe Xvfb + x11vnc para sessão de autenticação headful
# Uso: ./start-display.sh [porta-vnc]
# Default VNC port: 5900

DISPLAY_NUM=${1:-99}
VNC_PORT=${2:-5900}
DISPLAY=:${DISPLAY_NUM}

echo "🖥️  Subindo Xvfb no display ${DISPLAY}..."
Xvfb ${DISPLAY} -screen 0 1280x800x24 &
XVFB_PID=$!
echo "   Xvfb PID: ${XVFB_PID}"
sleep 1

echo "🔒 Subindo x11vnc na porta ${VNC_PORT}..."
x11vnc -display ${DISPLAY} -nopw -listen localhost -port ${VNC_PORT} -forever -quiet &
VNC_PID=$!
echo "   x11vnc PID: ${VNC_PID}"

echo ""
echo "✅ Display virtual pronto!"
echo "   DISPLAY=${DISPLAY}"
echo "   VNC: localhost:${VNC_PORT} (tunelar com SSH)"
echo ""
echo "🔗 No terminal local, rode:"
echo "   ssh -L ${VNC_PORT}:127.0.0.1:${VNC_PORT} usuario@ip-do-vps -N"
echo "   Depois conecte com qualquer cliente VNC em: localhost:${VNC_PORT}"
echo ""
echo "🌐 Para abrir Chrome nesse display:"
echo "   DISPLAY=${DISPLAY} google-chrome --no-sandbox &"
echo ""
echo "Para parar: kill ${XVFB_PID} ${VNC_PID}"
echo "${XVFB_PID} ${VNC_PID}" > /tmp/display-pids.txt

# Exporta DISPLAY para o ambiente atual
export DISPLAY=${DISPLAY}
echo "export DISPLAY=${DISPLAY}" > /tmp/display-env.sh
