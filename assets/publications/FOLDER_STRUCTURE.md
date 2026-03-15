# Publications Images - Folder Structure

## 📁 需要创建的文件夹和文件

我已经为你修改了 `data/publications.json` 文件。现在你需要为每篇论文创建对应的文件夹，并放入两张图片：

### 文件夹列表（按年份排序）

#### 2025年论文

1. **`2025-neptune-x/`**
   - 📄 `thumbnail.png` - 论文架构图/缩略图
   - 🏢 `venue-logo.png` - NeurIPS logo
   - 论文：Neptune-X: Active X-to-Maritime Generation for Universal Maritime Object Detection

2. **`2025-distribution-aligned-decoding/`**
   - 📄 `thumbnail.png`
   - 🏢 `venue-logo.png` - NeurIPS logo

3. **`2025-dynamic-uncertainty-multimodal/`**
   - 📄 `thumbnail.png`
   - 🏢 `venue-logo.png` - arXiv logo

4. **`2025-cp-uniguard/`**
   - 📄 `thumbnail.png`
   - 🏢 `venue-logo.png` - arXiv logo

5. **`2025-llm-task-adaptation/`**
   - 📄 `thumbnail.png`
   - 🏢 `venue-logo.png` - arXiv logo

6. **`2025-task-aware-peft/`**
   - 📄 `thumbnail.png`
   - 🏢 `venue-logo.png` - IEEE GLOBECOM logo

7. **`2025-cp-guard-plus/`**
   - 📄 `thumbnail.png`
   - 🏢 `venue-logo.png` - arXiv logo

8. **`2025-gcp/`**
   - 📄 `thumbnail.png`
   - 🏢 `venue-logo.png` - arXiv logo

9. **`2025-adaptive-attack/`**
   - 📄 `thumbnail.png`
   - 🏢 `venue-logo.png` - arXiv logo

10. **`2025-directed-cp/`**
    - 📄 `thumbnail.png`
    - 🏢 `venue-logo.png` - ICRA logo

11. **`2025-cp-guard/`**
    - 📄 `thumbnail.png`
    - 🏢 `venue-logo.png` - AAAI logo

#### 2024年论文

12. **`2024-r-acp/`**
    - 📄 `thumbnail.png`
    - 🏢 `venue-logo.png` - IEEE JSAC logo

13. **`2024-oran-digital-twin/`**
    - 📄 `thumbnail.png`
    - 🏢 `venue-logo.png` - IEEE TGCN logo

#### 2023年论文

14. **`2023-digital-twin-drl/`**
    - 📄 `thumbnail.png`
    - 🏢 `venue-logo.png` - IEEE GLOBECOM logo

15. **`2023-drl-digital-twin/`**
    - 📄 `thumbnail.png`
    - 🏢 `venue-logo.png` - IEEE LNET logo

---

## 📝 文件命名规则

### 缩略图 (thumbnail)
- **文件名**: `thumbnail.png` 或 `thumbnail.jpg`
- **建议尺寸**: 宽 400-600px，高度自适应
- **格式**: PNG（推荐，支持透明背景）或 JPG
- **内容**: 论文的架构图、流程图或主要示意图

### 会议Logo (venue-logo)
- **文件名**: `venue-logo.png` 或 `venue-logo.svg`
- **建议尺寸**: 高度 80-120px，宽度自适应
- **格式**: PNG（推荐，透明背景）或 SVG
- **内容**: 会议/期刊的官方logo

---

## 🎨 需要的Logo列表

你需要下载以下会议/期刊的官方logo：

### 会议Logo
- ✅ **NeurIPS** - Neural Information Processing Systems
- ✅ **ICRA** - IEEE International Conference on Robotics and Automation
- ✅ **AAAI** - Association for the Advancement of Artificial Intelligence
- ✅ **GLOBECOM** - IEEE Global Communications Conference

### 期刊Logo
- ✅ **IEEE JSAC** - IEEE Journal on Selected Areas in Communications
- ✅ **IEEE TGCN** - IEEE Transactions on Green Communications and Networking
- ✅ **IEEE LNET** - IEEE Networking Letters

### 预印本Logo
- ✅ **arXiv** - arXiv.org logo

---

## 🔧 快速创建文件夹命令（Windows PowerShell）

```powershell
# 进入publications目录
cd "assets\publications"

# 创建所有文件夹
$folders = @(
    "2025-neptune-x",
    "2025-distribution-aligned-decoding",
    "2025-dynamic-uncertainty-multimodal",
    "2025-cp-uniguard",
    "2025-llm-task-adaptation",
    "2025-task-aware-peft",
    "2025-cp-guard-plus",
    "2025-gcp",
    "2025-adaptive-attack",
    "2025-directed-cp",
    "2025-cp-guard",
    "2024-r-acp",
    "2024-oran-digital-twin",
    "2023-digital-twin-drl",
    "2023-drl-digital-twin"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force
    Write-Host "Created: $folder"
}
```

---

## 📥 获取Logo资源

### 常用资源网站
1. **官方网站**: 大多数会议在官网都有品牌资源下载页面
2. **Wikimedia Commons**: https://commons.wikimedia.org/
3. **GitHub Awesome Logos**: 搜索 "conference logos github"

### 具体下载链接参考
- **NeurIPS**: https://neurips.cc/
- **IEEE**: https://www.ieee.org/about/help/logos-pubs.html
- **AAAI**: https://www.aaai.org/
- **arXiv**: https://arxiv.org/ (可以截图logo部分)

---

## ✅ 完成后的文件结构示例

```
assets/publications/
├── 2025-neptune-x/
│   ├── thumbnail.png       ← 你的论文架构图
│   └── venue-logo.png      ← NeurIPS logo
├── 2025-cp-guard/
│   ├── thumbnail.png       ← CP-Guard 架构图
│   └── venue-logo.png      ← AAAI logo
├── 2024-r-acp/
│   ├── thumbnail.png       ← R-ACP 系统图
│   └── venue-logo.png      ← IEEE JSAC logo
└── ...
```

---

## 🎯 优先级建议

建议先处理以下论文（首页会显示的前10篇）：
1. ⭐ Neptune-X (NeurIPS'25 Spotlight)
2. ⭐ Distribution-Aligned Decoding (NeurIPS'25)
3. ⭐ Dynamic Uncertainty-aware (arXiv)
4. ⭐ CP-uniGuard (arXiv)
5. ⭐ LLM Task Adaptation (arXiv)
6. ⭐ Task-Aware PEFT (GLOBECOM'25)
7. ⭐ R-ACP (IEEE JSAC)
8. ⭐ CP-Guard+ (arXiv)
9. ⭐ GCP (arXiv)
10. ⭐ Adaptive Attack (arXiv)

剩余论文可以稍后补充。

---

## ❓ 如果暂时没有图片怎么办？

如果某些论文暂时还没有准备好图片，可以：
1. 创建一个占位符图片（灰色背景 + 论文标题文字）
2. 或者暂时注释掉 publications.json 中对应的 `thumbnail` 和 `venueLogo` 字段
3. 系统会自动忽略不存在的图片，只显示文字信息

