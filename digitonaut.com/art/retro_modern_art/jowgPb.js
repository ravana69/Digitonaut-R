setTimeout(() => {
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .not-important__link {
        width: 35px;
        height: 35px;
        position: fixed;
        bottom: 10px;
        left: 10px;
      }

      .not-important__link img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      .not-important__link:hover {
        width: 45px;
        height: 45px;
        bottom: 5px;
        left: 5px;
      }

      .not-important__link:hover img {
        border-radius: 6px;
      }
    </style>
  `);
}, 0);