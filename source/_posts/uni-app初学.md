---
title: uni-app初学
date: 2026-04-20 19:32:00
tags: 
- 框架使用
categories:
- 开发
---

# 前言

本博客借鉴于https://www.yuque.com/hynever/rd5ufc?#，可搭配食用。

现在是大二下册中期，到现在做的项目几乎全都是web开发，还没接触过小程序呢。但学习小程序肯定是作为一个程序员必不可少的，那么就先从一个简单的小程序开发框架开始。（它也能开发APP）

小程序开发框架主要解决一套代码在多个平台（如微信、支付宝、H5等）运行的问题。

**uni-app**

- **简介：** uni-app是由DCloud公司开发的，一款使用 [Vue.js](https://vuejs.org/) 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。
- **优点：** 学习成本低（尤其对Vue开发者），插件市场资源丰富，跨端覆盖最广。
- **适用场景：** 中小团队希望以最低成本快速覆盖多端，尤其是小程序生态
- 教程源码在桌面资料里的fast-api教程的uniapp-demo下

# 入门

### 1、开发工具

uni-app有专门的开发工具，叫做`HbuilderX`。在这里可以下载到：https://www.dcloud.io/hbuilderx.html，下载完成后，用解压软件解压开来，双击`HBuilderX.exe`即可使用。

### 2、项目结构介绍

在创建完一个项目后，就会生成一些文件和目录（如下图是成熟的uniapp文件结构），以下分别进行讲解。

![image-20260420214107103](https://raw.githubusercontent.com/Hafsun/blogs_pic/main/images20260420214114194.png)

- `pages.json`：对`uni-app`项目进行全局配置，决定页面文件的路径、窗口样式、导航条、底部的tabbar等。
- `manifest.json`：应用的配置文件，用于指定应用的名称、图标、权限等。
- `App.vue`：根组件，是整个程序的入口页面，所有其他页面都是它的子页面。
- `main.js`：项目入口文件，用于初始化`vue`实例对象，并配置相关的插件。
- `uni.scss`：预置了一些`scss`样式变量，如有需要可直接导入使用。（不管）
- `unpackage`：打包目录，包括在各个平台的打包文件。
- `pages`：所有的页面，一般一个页面文件用一个文件夹存放。
- `static`：所有的静态文件，比如图片，字体等，但是不要存放`css/sass/less`和`js`等文件。

为了实现多端兼容，综合考虑编译速度、运行性能等因素，`uni-app` 约定了如下开发规范：

- 页面文件遵循 [Vue 单文件组件 (SFC) 规范](https://vue-loader.vuejs.org/zh/spec.html)
- 组件标签靠近小程序规范，详见[uni-app 组件规范](https://uniapp.dcloud.io/component/README)
- 接口能力（JS API）靠近微信小程序规范，但需将前缀 `wx` 替换为 `uni`，详见[uni-app接口规范](https://uniapp.dcloud.io/api/README)
- 数据绑定及事件处理同 `Vue.js` 规范，同时补充了App及页面的生命周期
- 为兼容多端运行，建议使用flex布局进行开发

### 3、运行项目

### 1） 运行在网页

在顶部的菜单栏，找到`运行->运行到浏览器`即可。（这个教程只讲这个）

### 2） 运行在微信小程序

- 安装软件：首先要安装微信小程序开发软件：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html，然后在`HBuilderX->工具->设置->运行设置->小程序运行配置`，找到`微信开发者工具路径`，将微信小程序开发者工具的安装路径设置好。
- 设置测试号：打开微信小程序开发者工具，然后创建项目，点击获取`测试号`。然后在`HBuilderX`的项目中，找到`manifest.json`文件，然后找到`微信小程序配置`，将从微信开发者工具中获取到的测试号设置到`微信小程序AppID`中。
- 运行：在`运行->运行到小程序->微信开发者工具`，即可在微信小程序中运行项目。

### 3） 作为APP运行在安卓真机

由于安卓手机种类繁多，没法写一个统一的教程，要作为安卓app运行在真机上，确保以下两点：

- 在安卓手机上开启：开发者选项，开启USB调试，允许USB安装应用，然后用**数据线**连接电脑。
- 在HBuilderX上：设置合适的adb。设置方式为在`运行->运行手机或模拟器->设置adb路径`。`HBuilderX`自带的`adb`路径在：`HBuilderX\plugins\launcher-tools\tools\adbs`。

然后点击HBuilderX的`运行->运行手机或模拟器`即可启动。
