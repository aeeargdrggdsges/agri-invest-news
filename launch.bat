@echo off
echo ========================================================
echo   Launching Agri-Capital Briefing Investor Portal
echo   Running on http://localhost:5500
echo ========================================================
start "" http://localhost:5500
python -m http.server 5500
