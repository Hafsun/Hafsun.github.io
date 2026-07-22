document.addEventListener('DOMContentLoaded', () => {
  const submitButton = document.getElementById('submit-password');
  const passwordInput = document.getElementById('post-password');
  const encryptedContent = document.getElementById('encrypted-content');
  const passwordMessage = document.getElementById('password-message');
  const encryptedForm = document.querySelector('.encrypted-post-form');

  if (submitButton && passwordInput && encryptedContent && encryptedForm) {
    submitButton.addEventListener('click', () => {
      const enteredPassword = passwordInput.value;
      // 从页面中读取 front-matter 里设定的 password
      const correctPassword = encryptedForm.getAttribute('data-password') || '024019';

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