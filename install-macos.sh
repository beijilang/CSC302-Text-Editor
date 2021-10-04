curl "https://nodejs.org/dist/v14.18.0/node-v14.18.0.pkg" > "$HOME/Downloads/node-latest.pkg"
installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"