---
title: 关于Vue3和Spring Boot的模糊记忆
date: 2026-04-03 10:58:08
tags:
- Vue3
- Spring boot
categories:
- 开发
---

# 前言

因为我根本没认真学这俩框架，说是入门都有点过了，所以本篇主要记录对这俩东西的最大程度记忆（大概率以后也不会学，那么此时就是记得最清楚的时候—_—）,防止以后回忆时屁都不知道。



# Spring Boot

首先是环境，java不需要像python那样配置虚拟环境，而是把依赖项全部写在.xml文件中，然后maven一下就好了。此时要注意maven版本、jdk版本都要匹配，同时这俩也分全局配置和项目配置。

然后怎么初始化一个springboot项目呢，当然是借助工具Spring Initializr。 它会帮我们搭好基本的文件结构.

java业务逻辑和python类似，都是面向对象，分离接口模块及实现模块，但是会有更规范的文件结构，文件结构例如以下图。

response是一个统一返回结果类。通常用于封装 API 返回给前端的 JSON 数据格式（例如：包含 code, message, data 等字段），确保所有接口的返回都长这样；

controller是接口层，负责直接与前端交互：接收 HTTP 请求（GET, POST 等），获取参数，调用 Service 层处理业务，最后将结果返回给前端；

service 是业务逻辑层，**`StudentService`** (接口): 定义了业务功能的规范（比如“添加学生”、“删除学生”），**`StudentServiceImpl`** (实现类): 真正写业务逻辑的地方；

dao(或者说repository/mapper)是数据访问层，对接数据库，student实现类与数据库中的student表一一对应。**`StudentRepository`**: 这是一个接口类，负责操作数据库（增删改查）；

dto是数据传输对象，用于在不同层之间传输数据，比如，前端传来的参数可能和数据库表结构不一样，或者数据库表里有敏感字段（如密码）不能返回给前端。这时就会创建 `StudentDTO` 或 `StudentVO` 来专门用于数据传递，而不是直接暴露 `Student` 实体类；

总结一个完整的请求流程：Controller收到请求 -> Controller调用Service -> Service处理业务逻辑，然后调用dao -> dao去数据库查询数据，返回entity(实体) -> 可能会有个convert操作 ->  Controller将dto包装进Response对象，返回给前端。

![image-20260408214442840](https://raw.githubusercontent.com/Hafsun/blogs_pic/main/images20260408214449900.png)



# Vue3

Vue3是基于Node.js环境运行的，然后构建工具用的是Vite。至于如何初始化一个Vue3项目，问问AI应该没啥问题。

## 项目结构

my-vue-app/
├── node_modules/       # 项目依赖的第三方库
├── public/             # 静态资源文件夹
│   ├── index.html      # 应用的 HTML 模板
│   └── ...             # 其他静态资源（如图片、字体等）
├── src/                # 项目源代码
│   ├── assets/         # 静态资源（如图片、字体等）
│   ├── components/     # 可复用的 Vue 组件
│   ├── views/          # 页面级组件
│   ├── App.vue         # 根组件
│   ├── main.js         # 项目入口文件
│   ├── router.js       # 路由配置
│   ├── store.js        # Vuex 状态管理配置
│   └── ...             # 其他配置和资源
├── package.json        # 项目配置和依赖管理
├── package-lock.json   # 依赖的精确版本锁定文件
└── README.md           # 项目说明文档

然后Vue3有个生命周期，这个和前端的运转有关，比较复杂，不宜深究。





