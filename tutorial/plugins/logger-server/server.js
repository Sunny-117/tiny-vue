const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // 引入 cors 中间件
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// 使用 cors 中间件解决跨域问题
app.use(cors());

// 使用 body-parser 中间件解析 JSON 请求体
app.use(bodyParser.json());

// 日志记录的目录
const logDirectory = path.join(__dirname, "logs");

// 确保日志目录存在
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 处理日志记录的路由
app.post("/log", (req, res) => {
  const { error, stack, info, time } = req.body;

  // 创建日志条目
  const logEntry = `[${time}] ${info}: ${error}\n${stack}\n\n`;

  // 将日志写入文件
  const logFilePath = path.join(logDirectory, "error.log");
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write log:", err);
      return res.status(500).send("Failed to write log");
    }
    console.log("Log entry recorded");
    res.status(200).send("Log entry recorded");
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Logger server is running on http://localhost:${port}`);
});
