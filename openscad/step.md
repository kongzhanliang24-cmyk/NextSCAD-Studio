# 🛠 第一步：准备环境

## 1️⃣ 安装 Python

- 官网下载安装 [Python 3.11+](https://www.python.org/downloads/)
  
  检查：
  
  ```bash
  python --version
  ```

## 2️⃣ 创建虚拟环境（推荐）

    python -m venv cad_env
    # 激活环境
    # Windows
    cad_env\Scripts\activate
    # macOS / Linux
    source cad_env/bin/activate

## 3️⃣ 安装 CadQuery 和可视化工具

```bash
pip install cadquery cq-editor jupyterlabv
```

- `cadquery` → 核心建模库
- `cq-editor` → 可视化编辑器（像小型SolidWorks）
- `jupyterlab` → 可以在Notebook里查看3D模型

检查：

```bash
cq-editor
```

打开后，你会看到右边是3D预览，左边是代码编辑



# 🏗 第二步：创建项目结构

建议用模块化管理：

    cad_project/
    ├── main.py          # 项目入口
    ├── config.yaml      # 参数配置
    ├── parts/           # 各个模块
    │   ├── shell.py
    │   ├── base.py
    │   ├── holes.py
    └── utils/
        └── common.py

- 每个零件写成一个函数，参数化控制尺寸
- `main.py` 负责组合零件和导出STEP


