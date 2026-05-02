document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit-password');
  const passwordInput = document.getElementById('post-password');
  const encryptedContent = document.getElementById('encrypted-content');
  const passwordMessage = document.getElementById('password-message');
  const encryptedForm = document.querySelector('.encrypted-post-form');

  if (submitButton && passwordInput && encryptedContent && encryptedForm) {
    submitButton.addEventListener('click', () => {
      const enteredPassword = passwordInput.value;
      // Hexo 会将 front-matter 中的 password 字段作为 page.password 传递给模板
      // 但在客户端 JS 中，我们无法直接访问 page.password。
      // 理想情况下，Hexo 应该在渲染时将加密文章的密码哈希值或一个标识符嵌入到页面中。
      // 为了简化，这里直接使用硬编码的密码。
      const correctPassword = '024019'; // 替换为你的实际密码

      if (enteredPassword === correctPassword) {
        encryptedContent.style.display = 'block';
        encryptedForm.style.display = 'none';
        passwordMessage.textContent = '';
        const tocDiv = document.getElementById('toc-div');
        if (tocDiv) tocDiv.classList.remove('is-toc-locked');
      } else {
        passwordMessage.textContent = '密码错误，请重试。';
      }
    });
  }
});