<div class="publications-section">

# 📝 Publications

<div class='paper-box featured-paper'>
<div class='paper-box-image'>
<div>
<div class="badge bibm">BIBM 2025</div>
<img src='images/papers/DPASyn.png' alt="DPASyn" width="100%">
</div>
</div>
<div class='paper-box-text' markdown="1">

<div class="paper-title">
[**DPASyn: Mechanism-Aware Drug Synergy Prediction via Dual Attention and Precision-Aware Quantization**](https://ieeexplore.ieee.org/abstract/document/11356358)
</div>

<div class="paper-authors">
**Yuxuan Nie**, Yutong Song, Jinjie Yang, Yupeng Song, Yujue Zhou, Hong Peng*
</div>

<div class="paper-meta">
  <span class="paper-venue">🏛️ IEEE BIBM 2025</span>
  <span class="paper-type">📄 Conference Paper</span>
</div>

</div>
</div>


<div class='paper-box featured-paper'>
<div class='paper-box-image'>
<div>
<div class="badge npc">IFIP NPC 2025</div>
<img src='images/papers/NPC.png' alt="NPC" width="50%">
</div>
</div>
<div class='paper-box-text' markdown="1">

<div class="paper-title">
[**Carbon-Aware Task Scheduling in Distributed Computing Continuum: A Lyapunov-Guided Reinforcement Learning Approach**](https://link.springer.com/chapter/10.1007/978-3-032-10459-5_18)
</div>

<div class="paper-authors">
Shujia Niu, Zhenli He*, Yuanfei Xiao, **Yuxuan Nie**, Yao Chen, Bingning Liu
</div>

<div class="paper-meta">
  <span class="paper-venue">🏛️ IFIP NPC 2025</span>
  <span class="paper-type">📄 Conference Paper</span>
</div>

</div>
</div>
</div>

<style>
.publications-section {
  margin: 2.5em 0;
}

.paper-box {
  display: flex;
  gap: 1.5em;
  margin-bottom: 2em;
  padding: 1.5em;
  background: white;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
}

.paper-box.featured-paper {
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
}

.paper-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.paper-box.featured-paper:hover {
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.25);
}

.paper-box-image {
  flex-shrink: 0;
  width: 200px;
}

.paper-box-image img {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge {
  display: inline-block;
  padding: 0.3em 0.8em;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 0.5em;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.badge.bibm {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.badge.npc {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.paper-box-text {
  flex: 1;
}

.paper-title {
  font-size: 1.1em;
  font-weight: 700;
  margin-bottom: 0.8em;
  line-height: 1.5;
}

.paper-title a {
  color: #2d3436;
  text-decoration: none;
  transition: color 0.3s ease;
}

.paper-title a:hover {
  color: #667eea;
}

.paper-authors {
  color: #636e72;
  margin-bottom: 0.8em;
  line-height: 1.6;
}

.paper-meta {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
}

.paper-meta span {
  display: inline-block;
  padding: 0.3em 0.8em;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
}

@media (max-width: 768px) {
  .paper-box {
    flex-direction: column;
  }

  .paper-box-image {
    width: 100%;
  }
}
</style>
