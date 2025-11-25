<template>
  <div class="error-container">
    <div class="error-content">
      <h1>404</h1>
      <h2>Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <div class="error-actions">
        <button @click="$router.push('/')">Go to Home</button>
        <button @click="$router.go(-1)" class="secondary">Go Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 无额外逻辑，保持极简
</script>

<style scoped>
.error-container {
  /* 全屏居中 */
  /* 1vh 等于当前浏览器可视区域高度的 1% */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
}

.error-content {
  /* 文本居中对齐 */
  text-align: center;
  max-width: 600px;
  width: 100%;
}

h1 {
  /*rem: 大小相对于根元素（<html>标签）的字体大小 默认情况下：1rem = 16px*/
  font-size: 8rem;
  font-weight: 300;
  margin: 0 0 20px;
  color: #333;
}

h2 {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0 0 15px;
  color: #555;
}

p {
  font-size: 1rem;
  color: #666;
  margin: 0 0 30px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 4px;
}

button:hover {
  background: #eee;
}

button.secondary {
  background: transparent;
}

button.secondary:hover {
  background: #f0f0f0;
}
</style>
