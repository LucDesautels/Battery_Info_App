## Info
This app was made as an easy way to refernce voltages for various lithium style batteries. 
- Includes LiPo, Li-ion, LiFePO4, and NiMH
- For cell counts 1s to 8s
- Battery % SOC estimation
- Information is at easy acess from the tool tab. For printing, all information is on the chart tab.
- You can self-host this by installing with docker compose

Made with replit ai and claude code. 🥀

## Preview:
<img width="1474" height="1503" alt="image" src="https://github.com/user-attachments/assets/65e3a74e-6f5f-45ef-8189-6616ebfb9507" />


## Docker Compose setup
- You can self-host this by installing with docker compose
```
git clone https://github.com/LucDesautels/Battery_Info_App.git
cd Battery_Info_App
docker compose up -d
```

Example with caddy:
- Caddy file
```
yourdomain.com {
    reverse_proxy battery-info:3000
}
```
- Compose file
```
services:
  battery-info:
    build: .
    restart: unless-stopped

  caddy:
    image: caddy:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on:
      - battery-info
    restart: unless-stopped

volumes:
  caddy_data:

```
