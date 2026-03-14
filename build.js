const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({ html: true });

// 读取配置
const config = yaml.load(fs.readFileSync('_config.yml', 'utf8'));

// 创建输出目录
const distDir = './dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 读取布局文件
function readLayout(layoutName) {
  return fs.readFileSync(`_layouts/${layoutName}.html`, 'utf8');
}

// 读取include文件
function readInclude(includeName) {
  const includePath = `_includes/${includeName}`;
  if (fs.existsSync(includePath)) {
    return fs.readFileSync(includePath, 'utf8');
  }
  return '';
}

// 处理include标签
function processIncludes(content, depth = 0) {
  if (depth > 5) return content; // 防止无限递归

  let result = content.replace(/\{%\s*include\s+([^\s%]+)\s*%\}/g, (match, includeName) => {
    const includeContent = readInclude(includeName);
    return processIncludes(includeContent, depth + 1); // 递归处理嵌套的includes
  });

  return result;
}

// 处理include_relative标签
function processIncludeRelative(content, basePath) {
  return content.replace(/\{%\s*include_relative\s+([^\s%]+)\s*%\}/g, (match, relativePath) => {
    const fullPath = path.join(basePath, relativePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    }
    return '';
  });
}

// 处理变量替换
function processVariables(content, data) {
  let result = content;

  // 处理 {{ site.xxx }}
  result = result.replace(/\{\{\s*site\.(\w+)\s*\}\}/g, (match, key) => {
    return config[key] || '';
  });

  // 处理 {{ page.xxx }}
  result = result.replace(/\{\{\s*page\.(\w+)\s*\}\}/g, (match, key) => {
    return data[key] || '';
  });

  // 处理 {{ site.author.xxx }}
  result = result.replace(/\{\{\s*site\.author\.(\w+)\s*\}\}/g, (match, key) => {
    return config.author?.[key] || '';
  });

  return result;
}

// 移除所有未处理的 Jekyll 语法
function removeJekyllSyntax(content) {
  let result = content;

  // 移除所有 {% ... %} 标签
  result = result.replace(/\{%[^%]*%\}/g, '');

  // 移除所有 {{ ... }} 变量（除了已经处理过的）
  result = result.replace(/\{\{[^}]*\}\}/g, '');

  return result;
}

// 处理条件语句 {% if %}
function processConditionals(content, data) {
  let result = content;

  // 简单的 if 处理
  result = result.replace(/\{%\s*if\s+page\.(\w+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, (match, key, innerContent) => {
    return data[key] ? innerContent : '';
  });

  result = result.replace(/\{%\s*if\s+layout\.(\w+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, (match, key, innerContent) => {
    return data[key] ? innerContent : '';
  });

  return result;
}

// 处理 for 循环
function processLoops(content) {
  let result = content;

  // 处理 {% for link in site.data.navigation.main %}
  result = result.replace(/\{%\s*for\s+(\w+)\s+in\s+site\.data\.navigation\.main\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, (match, varName, loopContent) => {
    try {
      const navData = yaml.load(fs.readFileSync('_data/navigation.yml', 'utf8'));
      if (navData && navData.main) {
        return navData.main.map(item => {
          return loopContent.replace(new RegExp(`\\{\\{\\s*${varName}\\.(\\w+)\\s*\\}\\}`, 'g'), (m, prop) => {
            return item[prop] || '';
          });
        }).join('');
      }
    } catch (e) {
      console.warn('无法读取 navigation.yml');
    }
    return '';
  });

  return result;
}

// 读取about.md
const aboutPath = '_pages/about.md';
const aboutContent = fs.readFileSync(aboutPath, 'utf8');

// 解析front matter
const frontMatterMatch = aboutContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
let pageData = {};
let markdownContent = aboutContent;

if (frontMatterMatch) {
  pageData = yaml.load(frontMatterMatch[1]);
  markdownContent = frontMatterMatch[2];
}

// 处理include_relative
markdownContent = processIncludeRelative(markdownContent, '_pages');

// 转换markdown为HTML
const htmlContent = md.render(markdownContent);

// 读取默认布局
let layout = readLayout('default');

// 处理循环
layout = processLoops(layout);

// 处理includes
layout = processIncludes(layout);

// 处理条件语句
layout = processConditionals(layout, pageData);

// 替换content
layout = layout.replace(/\{\{\s*content\s*\}\}/g, htmlContent);

// 处理变量
layout = processVariables(layout, pageData);

// 移除所有剩余的 Jekyll 语法
layout = removeJekyllSyntax(layout);

// 写入输出文件
fs.writeFileSync(path.join(distDir, 'index.html'), layout);

// 复制静态资源
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 复制资源文件
['assets', 'images'].forEach(dir => {
  if (fs.existsSync(dir)) {
    copyDir(dir, path.join(distDir, dir));
  }
});

console.log('✓ 构建完成！输出目录: ./dist');

