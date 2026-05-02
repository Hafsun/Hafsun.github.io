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

# Vue基础（2026.4.20更新）

## 一、概述

uni-app是用Vue框架作为基础，所以我们在做uni-app项目之前，有必要学会如何基于Vue框架做开发。一个`vue`文件由以下三个模块组成：

- `template`：基于HTML语法的模板代码。
- `script`：基于JavaScript的逻辑代码。
- `style`：基于CSS的样式代码。

其中`script`模块中，有两种实现方式，分别是`vue 2.0`中遗留的选项式API和`vue 3.0`中推荐的组合式API，这里我们使用组合式API。一个`vue`文件结构类似为：

```vue
<template>
	<view>
		
	</view>
</template>

<script setup>
	
</script>

<style>
	       
</style>
```

## 二、template

`vue`文件中模板语法非常多，这里我们围绕变量引用、事件绑定、双向绑定、if语句、for循环来进行讲解。其他的高级用法，我们暂时先不用，或者用到了再跟大家说。

### 1. 变量引用

在script标签中，我们可以用JavaScript语法定义变量，而在模板中，则可以通过{{变量名}}的形式引用script中定义的变量。比如用户名username，不同用户登录后，显示的用户名都不一样，就可以在显示用户名的地方使用变量{{ username }}，然后在script标签中，根据从服务器获取到的用户信息，动态赋值usenrname的值。示例代码如下：

```vue
<template>
	<view>
		<div>{{username}}</div>
	</view>
</template>

<script setup>
	import {ref} from "vue";
	let username = ref("");
	username.value = "张三"
</script>
```

### 2. 事件绑定

假设在`template`中有一个按钮，在点击按钮后要进行某种操作，那么就可以给这个按钮绑定一个点击事件。示例代码如下：

```vue
<template>
	<view>
		<button @click="onLogin">登录</button>
	</view>
</template>

<script setup>
	const onLogin = () => {
		console.log("点击了登录按钮！");
	}
</script>
```

### 3. 双向绑定

变量引用仅仅是`template`从`script`中引用变量，但有些情况需要在`script`中引用`template`，比如我们在`script`中实时读取表单输入框中输入的内容，那么就可以使用双向绑定。双向绑定示例代码如下：

```vue
<template>
	<view>
		<input type="text" v-model="username" placeholder="请输入用户名">
	</view>
</template>

<script setup>
	import {ref, watch} from "vue";
	let username = ref("");
	watch(username, (value, oldValue) => {
		console.log("value: "+value);
	})
</script>
```

### 4. if语句

在vue中，可以通过`v-if`来根据条件渲染不同的组件。示例代码如下：

```vue
<template>
	<view>
		<view v-if="weather=='晴'">今天出公园玩</view>
		<view v-else-if="weather=='阴'">今天去图书馆</view>
		<view v-else>今天待在家里</view>
	</view>
</template>

<script setup>
	import {ref, watch} from "vue";
	let weather = ref("雨");
</script>
```

### 5. for循环

在vue中，可以通过`v-for`来渲染列表。示例代码如下：

```vue
<template>
	<view>
		<table>
			<tbody>
				<tr v-for="(book, index) in books" v-key="index">
					<td>{{index+1}}</td>
					<td>{{book.name}}</td>
					<td>{{book.author}}</td>
				</tr>
			</tbody>
		</table>
	</view>
</template>

<script setup>
	import {ref, watch} from "vue";
	let books = ref([{
		"name": "三国演义",
		"author": "罗贯中"
	}, {
		"name": "水浒传",
		"author": "施耐庵"
	}, {
		"name": "红楼梦",
		"author": "曹雪芹"
	}, {
		"name": "西游记",
		"author": "吴承恩"
	}])
</script>
```

## 三、script

在script中，我们围绕`ref`、`reactive`和生命周期方法进行讲解。

### 1. ref变量

普通类型的`javascript`变量可以在`template`中使用，但是一旦该变量发生改变，无法即时同步到模板中，为了实现这个需求，需要将变量定义成`ref`或`reactive`类型。

针对普通数据类型，比如字符串、数值、布尔类型，以及数组类型，我们通常定义成`ref`类型的。示例代码如下：

```vue
<template>
	<view>
		<view>点击数：{{count}}</view>
		<button @click="onClick">点我</button>
	</view>
</template>

<script setup>
	import {ref} from "vue";
	let count = ref(0)
	const onClick = () => {
		count.value += 1;
	}
</script>
```

需要注意的是，在`script`中想使用`ref`定义的变量，必须通过`.value`属性来实现。

### 2. reactive

对象类型的变量，通常定义成`reactive`类型。示例代码如下：

```vue
<template>
	<view>
		<ul>
			<li>姓名：{{person.name}}</li>
			<li>年龄：{{person.age}}</li>
		</ul>
	</view>
</template>

<script setup>
	import {reactive} from "vue";
	let person = reactive({
		"name": "张三",
		"age": 18
	})
</script>
```

### 3. 生命周期方法

vue中，可以把一个.vue文件理解为一个组件，然后浏览器界面就是一个或多个组件组合而成。在每个界面显现时，组件们都会经历**创建 → 挂载到页面 → 响应数据变化 → 最终被销毁**的整个过程，每个过程由钩子（生命周期函数）控制，它给了你一个“钩住”这些关键时刻的机会，让你可以插入自己的代码。

其中用得最多的就是`onMounted`生命周函数，代表该组件被挂载到父组件后的执行的代码。示例代码如下：

```vue
<template>
	<view>
		用户名：{{username}}
	</view>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	
	let username = ref("");

	onMounted(() => {
		username.value = "张三";
		console.log("onMounted生命周期方法！");
	})
</script>
```





## 标准项目结构

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





