# Interactive Code Editor

Inspired by [GetThatBread](https://github.com/TanLeYang/GetThatBread).

Project hosted here: https://leetgrindr.vercel.app/ 

![Home](/leetgrindr_home.png)

Current Features:
- Create/Join room with live code editor
- Run Python scripts using `python-shell` node package
- Save room code every 5s to redis database
- Show participants in room

Pending Features:
- Show participants cursor
- Question bank from leetcode
- Video/Voice support
- Support for other programming languages

Client: Hosted on Vercel

Server: Currently hosted on heroku
(Vercel serverless does not support websockets)
- Setup reverse proxy using nginx
- Setup docket images for easier deployment