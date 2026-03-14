<div class="news-section">

# 🔥 News & Updates

<div class="news-timeline">
  <div class="news-item highlight-news">
    <span class="news-date">2025.09</span>
    <span class="news-content">🎉 <strong>Admitted to Peking University</strong> through the postgraduate recommendation program!</span>
  </div>
</div>

</div>

<style>
.news-section {
  margin: 2em 0;
}

.news-timeline {
  position: relative;
  padding-left: 0;
}

.news-item {
  padding: 1em 1.5em;
  margin-bottom: 1em;
  border-left: 4px solid #667eea;
  background: linear-gradient(to right, rgba(102, 126, 234, 0.05), transparent);
  border-radius: 0 8px 8px 0;
  transition: all 0.3s ease;
  animation: slideInLeft 0.6s ease-out;
}

.news-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  background: linear-gradient(to right, rgba(102, 126, 234, 0.1), transparent);
}

.highlight-news {
  border-left-color: #c41e3a;
  background: linear-gradient(to right, rgba(196, 30, 58, 0.08), transparent);
}

.highlight-news:hover {
  background: linear-gradient(to right, rgba(196, 30, 58, 0.15), transparent);
  box-shadow: 0 4px 12px rgba(196, 30, 58, 0.2);
}

.news-date {
  display: inline-block;
  font-weight: 600;
  color: #667eea;
  min-width: 80px;
  margin-right: 1em;
}

.highlight-news .news-date {
  color: #c41e3a;
}

.news-content {
  color: #333;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>