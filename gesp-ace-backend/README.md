# GESP Ace Backend

AI智能编程陪练工具后端服务

## 技术栈

- **Runtime**: Node.js 20.x
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache**: Redis 7.x
- **Judge Engine**: Judge0 CE
- **Auth**: JWT

## 快速开始

### 1. 环境要求

- Node.js >= 20.0.0
- Docker & Docker Compose
- PostgreSQL 16 (或使用 Docker)
- Redis 7 (或使用 Docker)

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，修改数据库密码等配置
```

### 4. 初始化数据库

```bash
# 使用 Docker Compose 启动数据库
docker-compose up -d postgres redis judge0

# 生成 Prisma Client
npm run prisma:generate

# 推送 schema 到数据库
npm run prisma:push

# 初始化种子数据
docker-compose exec postgres psql -U postgres -d gespace -f /app/prisma/init.sql
```

### 5. 启动开发服务器

```bash
npm run dev
```

### 6. API 访问

- API Base URL: `http://localhost:3000/api/v1`
- 健康检查: `http://localhost:3000/api/v1/health`

## Docker 部署

### 使用 Docker Compose

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend

# 停止服务
docker-compose down
```

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | postgresql://postgres:postgres@postgres:5432/gespace |
| `REDIS_URL` | Redis 连接字符串 | redis://redis:6379 |
| `JWT_SECRET` | JWT 密钥 | - |
| `CORS_ORIGIN` | 允许的跨域源 | http://localhost:5173 |

## API 文档

### 认证模块 `/api/v1/auth`

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/register` | 用户注册 |
| POST | `/login` | 用户登录 |
| POST | `/logout` | 退出登录 |
| PUT | `/password` | 修改密码 |

### 用户模块 `/api/v1/users`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/me` | 获取当前用户信息 |
| GET | `/me/levels` | 获取等级进度 |
| GET | `/me/knowledge` | 获取知识点进度 |

### 题目模块 `/api/v1/questions`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/daily` | 获取每日一练 |
| GET | `/` | 获取题目列表 |
| GET | `/knowledge` | 获取知识点树 |
| GET | `/:id` | 获取题目详情 |

### 练习模块 `/api/v1/practice`

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/start` | 开始练习 |
| POST | `/answer` | 提交答案 |
| POST | `/complete` | 完成练习 |
| GET | `/history` | 获取练习历史 |

### 判题模块 `/api/v1/code`

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/run` | 运行代码 |
| POST | `/submit` | 提交代码 |

### 诊断模块 `/api/v1/diagnosis`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 获取 AI 诊断报告 |

### 报告模块 `/api/v1/reports`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/weekly` | 获取周报 |
| GET | `/monthly` | 获取月报 |

## 目录结构

```
gesp-ace-backend/
├── src/
│   ├── config/          # 配置文件
│   ├── controllers/     # 控制器
│   ├── services/        # 业务逻辑
│   ├── routes/          # 路由
│   ├── middlewares/     # 中间件
│   ├── models/          # 类型定义
│   ├── utils/           # 工具函数
│   └── constants/       # 常量定义
├── prisma/
│   ├── schema.prisma    # 数据库模型
│   └── init.sql         # 初始化脚本
└── docker-compose.yml   # Docker 编排
```

## License

MIT
