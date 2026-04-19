---
title: 适用于python的数据库框架sqlalchemy
date: 2026-04-18 12:47:00
tags: 
- 数据库
categories:
- 开发
---

# 简介

在python中，我们常使用ORM（Object Relationship Mapping）框架来操作数据库，然后在众多ORM框架中，最主流的是SQLALchemy,它经常与fastapi搭配食用，因为都支持异步。

# 安装

写此篇时，我是看fastapi+sqlalchemy+vue的教程，所以主要记录的是异步版本的sqlalchemy(见下)，安装之后还得安装驱动，安装时注意也要安装异步的，详细安装步骤临时搜即可。

```bash
$ pip install "sqlalchemy[asyncio]"
```

注意初始化项目时，选择fastapi框架。每个框架的初始化都不同，每次从零自己新建文件夹有点蠢。

# 创建连接

### 1、配置连接参数

使用`SQLAlchemy`连接数据库，是通过设置一个固定格式的字符串来实现的。`mysql+aiomysql`为例，那么其连接格式如下：（一般放在settings.py文件中）

```python
DB_URI = "mysql+aiomysql://用户名:密码@主机名:端口号/数据库名称?charset=utf8mb4"
```

示例（本地）：
```python
DB_URI = "mysql+aiomysql://root:root@127.0.0.1:3306/book_db?charset=utf8mb4"
```

### 2、创建Engine对象（管理连接用）

`SQLAlchemy`中的`Engine`对象，它负责管理数据库连接的创建（并不直接操作数据库）、连接池的维护、SQL语句的翻译等。`Engine`对象在整个程序中只能有一个。创建Engine对象代码如下：

```python
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    DB_URI,
    # 将输出所有执行SQL的日志（默认是关闭的）
    echo=True,
    # 连接池大小（默认是5个）
    pool_size=10,
    # 允许连接池最大的连接数（默认是10个）
    max_overflow=20,
    # 获得连接超时时间（默认是30s）
    pool_timeout=10,
    # 连接回收时间（默认是-1，代表永不回收）
    pool_recycle=3600,
    # 连接前是否预检查（默认为False）
    pool_pre_ping=True,
)
```



### 3、创建会话工厂

使用sqlalchemy.orm.sessionmaker类来创建会话工厂，这个会话工厂实际上就是Session或者它的子类，以后如果要操作数据库，那么就需要创建一个会话工厂的对象（即：Session类的对象），来完成相关操作。示例代码如下：

```python
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession

AsyncSessionFactory = sessionmaker(
    # Engine或者其子类对象（这里是AsyncEngine）
    bind=engine,  # 前面实例化的
    # Session类的代替（默认是Session类）
    class_=AsyncSession,
    # 是否在查找之前执行flush操作（默认是True）
    autoflush=True,
    # 是否在执行commit操作后Session就过期（默认是True）
    expire_on_commit=False
)
```

# 创建模型

### 1、定义Base类

`Base`类是所有`ORM Model`类的父类，一个`ORM Model`类对应数据库中的一张表，`ORM Model`中的一个`Column`类属性对应数据库表中的一个字段。`Base`类的生成可以使用`sqlalchemy.ext.declarative.declarative_base`函数来实现，也可以继承`sqlalchemy.MetaData`类，实现自己的子类，并在子类中编写约束规范。示例代码如下：

```python
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import MetaData

# 定义命名约定的Base类
class Base(DeclarativeBase):
    metadata = MetaData(naming_convention={
        # ix: index，索引。
        "ix": 'ix_%(column_0_label)s',
        # un：unique，唯一约束
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        # ck：Check，检查约束
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        # fk：Foreign Key，外键约束
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        # pk：Primary Key，主键约束
        "pk": "pk_%(table_name)s"
    })
```

### 2、创建ORM模型

这里我们以创建一个User模型为例来说明模型的创建（每一个ORM模型对应数据库中的一张表）

```python
from typing import Optional
from sqlalchemy import Integer, String, select
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(100),unique=True,index=True)
    username: Mapped[str] = mapped_column(String(100))
    password: Mapped[str] = mapped_column(String(200))
```

### 3、模型关系（各表关系）

这里我们使用外键来实现一对一、一对多和多对多，示例代码如下：

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, ForeignKey

class User(Base):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(100),unique=True,index=True)
    username: Mapped[str] = mapped_column(String(100))
    password: Mapped[str] = mapped_column(String(200))

    user_extension: Mapped["UserExtension"] = relationship(back_populates="user", uselist=False)
    articles: Mapped['Article'] = relationship(back_populates="author")

# 和User模型一对一关系
class UserExtension(Base):
    __tablename__ = 'user_extension'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    university: Mapped[str] = mapped_column(String(100))
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="user_extension")

# 和Article是多对多关系
class Tag(Base):
    __tablename__ = 'tag'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    articles: Mapped[list["Article"]] = relationship("Article", secondary="article_tag", back_populates='tags', lazy='dynamic')

# 和User是一对多关系
class Article(Base):
    __tablename__ = 'article'
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(100))
    content: Mapped[str] = mapped_column(Text)
    author_id: Mapped[int] = mapped_column(Integer, ForeignKey('user.id'))
    author: Mapped["User"] = relationship("User", back_populates='articles')
    tags: Mapped[list["Tag"]] = relationship("Tag", secondary="article_tag", back_populates='articles', lazy='dynamic')

# Article和Tag多对多关系的中间表
class ArticleTag(Base):
    __tablename__ = "article_tag"
    article_id: Mapped[int] = mapped_column(Integer, ForeignKey("article.id"), primary_key=True)
    tag_id: Mapped[int] = mapped_column(Integer, ForeignKey("tag.id"), primary_key=True)
```

看代码的话有点复杂，感觉很多时候也没必要理解各个表的关系，vibecoding时应该更不用管

# 模型迁移

模型定义好后，要将模型映射到数据库中生成表，或者是以后模型上的字段名、字段类型等发生改变了，可以非常方便的使用`alembic`来进行迁移。

### 迁移用的包

```bash
$ pip install alembic==1.13.2
```

吐槽：怎么干个啥动作都要安装一个包，就这玩意不能直接集成到sqlalchemy中吗？

用法：和git差不多(也支持版本回退)，得先创建迁移仓库，然后生成迁移脚本（效果图如下），具体的问AI

![image-20260418154150494](https://raw.githubusercontent.com/Hafsun/blogs_pic/main/images20260418154157803.png)





# 后续工作

上面讲的是数据库模块细节，在项目中，它还是要与其它模块对接的。这个过程中，session作为中间人，在python端的main函数等模块和数据库之前起桥梁作用。

# 感言

说实话专门拿一个框架来管理数据库还是有点麻烦，感觉不如直接去数据库中执行sql语句来的方便。但是在vibecoding中AI真的会告诉我应该怎么执行sql语句吗，在这个角度来看，应该还是用高级语言来写数据库方便点，也许是初学的原因，感觉有点复杂，或许以后可以试试其它轻量级的数据库框架？pysql?sqllite?
