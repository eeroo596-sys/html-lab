const themeToggleBtn = document.getElementById('themeToggle');

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = 'Dark Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = 'Light Mode';
    }
});