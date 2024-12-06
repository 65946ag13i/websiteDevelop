<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fullscreen API</title>
  <style>
    #fullscreenElement {
      width: 300px;
      height: 200px;
      background-color: lightblue;
      text-align: center;
      line-height: 200px;
      margin: 20px auto;
      border: 1px solid #000;
    }
  </style>
</head>
<body>
  <div id="fullscreenElement">點擊我全螢幕</div>
  <script>
    const element = document.getElementById('fullscreenElement');

    element.addEventListener('click', () => {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { // for Safari
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { // for IE
        element.msRequestFullscreen();
      }
    });

    document.addEventListener('fullscreenchange', () => {
      console.log(document.fullscreenElement
        ? '進入全螢幕模式'
        : '退出全螢幕模式');
    });
  </script>
</body>
</html>
