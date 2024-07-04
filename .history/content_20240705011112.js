let error = null;
import customIcon from './icons/custom-icon.png';

function addPopupButton(retryCount = 0) {
  const youtubePlayer = document.querySelector('.style-scope ytd-player, .ytd-enforcement-message-view-model, ' + error);
  console.log('youtubePlayer', youtubePlayer);

  if (youtubePlayer) {
    addCustomButton()
    const existingPopupButton = document.querySelector('.popup-window-button');
    if (existingPopupButton) {
      existingPopupButton.remove();
    }

    const setVisible = document.querySelector('#player-container-outer');
    if (setVisible) setVisible.style.visibility = 'visible';

    const popupButton = document.createElement('button');
    popupButton.innerText = 'Full Window';
    popupButton.style.position = 'absolute';
    popupButton.style.top = '-28px';
    popupButton.style.left = '20px';
    popupButton.style.padding = '5px 10px 2px 10px';
    popupButton.style.background = 'white';
    popupButton.style.color = 'rgb(15, 15, 15)';
    popupButton.style.cursor = 'pointer';
    popupButton.style.fontFamily = 'inherit';
    popupButton.style.zIndex = '99999';
    popupButton.style.fontWeight = '600';
    popupButton.style.border = '0';
    popupButton.style.borderRadius = '18px 18px 0px 0px';
    popupButton.classList.add('popup-window-button');
    youtubePlayer.appendChild(popupButton);

    function getVideoId(url) {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      const videoId = params.get("v");
      if (videoId) {
        return videoId.split("&")[0];
      }
      return null;
    }

    popupButton.addEventListener('click', () => {
      const videoId = getVideoId(window.location.href);
      if (videoId) {
        const playerContainer = document.createElement('div');
        playerContainer.style.position = 'absolute';
        playerContainer.style.top = '0';
        playerContainer.style.left = '0';
        playerContainer.style.width = '100%';
        playerContainer.style.height = '100dvh';
        playerContainer.style.backgroundColor = 'black';
        playerContainer.style.zIndex = '99999';
        playerContainer.classList.add('iframe-container');

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.allowFullscreen = true;

        playerContainer.appendChild(iframe);

        const exitButton = document.createElement('div');
        exitButton.innerText = 'Exit';
        exitButton.classList.add('exit-player');
        playerContainer.appendChild(exitButton);

        document.body.appendChild(playerContainer);

        exitButton.addEventListener('click', () => {
          playerContainer.remove();
          document.body.style.overflow = 'auto';
        });

        document.body.style.overflow = 'hidden';
      }
    });

    const style = document.createElement('style');
    style.dataset.extension = 'true';
    style.textContent = `
      .exit-player {
        position: absolute;
        top: 0;
        left: 0;
        color: rgb(255, 255, 255);
        background-color: rgb(255, 0, 0);
        border-right: 1px solid rgb(255, 255, 255);
        border-bottom: 1px solid rgb(255, 255, 255);
        border-bottom-right-radius: 13px;
        font-size: 10px;
        padding: 4px;
        opacity: 0.2;
        cursor: pointer;
      }
      .exit-player:hover {
        opacity: 1;
        z-index: 9999;
        color: rgb(255, 255, 255);
        background-color: rgb(255, 0, 0);
        border-right: 1px solid rgb(255, 255, 255);
        border-bottom: 1px solid rgb(255, 255, 255);
      }`;
    document.head.appendChild(style);
  } else if (retryCount < 5) {
    setTimeout(() => {
      addPopupButton(retryCount + 1);
    }, 1000);
  }
}

function checkForPlayabilityError(retryCount = 0) {
  const playabilityError = document.querySelector('.yt-playability-error-supported-renderers');
  console.log('playabilityError', playabilityError);

  if (playabilityError) {
    error = ".yt-playability-error-supported-renderers";
    addPopupButton();
    return;
  } else if (retryCount < 10) {
    setTimeout(() => {
      checkForPlayabilityError(retryCount + 1);
    }, 1000);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request.action', request.action); // Log the received message
  if (request.action === 'urlChanged') {
    document.querySelectorAll('.popup-window-button, .iframe-container').forEach(el => el.remove());
    const styleElement = document.head.querySelector('style[data-extension="true"]');
    if (styleElement) {
      styleElement.remove();
    }
    addPopupButton();
   
  }
});

addPopupButton();
checkForPlayabilityError();


function addCustomButton() {
  const btnContainer = document.querySelector('.ytp-right-controls');
  console.log('btnContainer', btnContainer);

  if (!btnContainer) return;
  btnContainer.style.display = 'flex';
  btnContainer.style.alignItems = 'center';

  // Create img element
  const customImg = document.createElement('img');
  customImg.src = customIcon;
  customImg.alt = 'Custom Button';
  customImg.classList.add('custom-image');
  customImg.style.padding = '5px';
  customImg.style.margin = '0 10px';
  customImg.style.cursor = 'pointer';
  customImg.style.width = '30px'; // Adjust the size as needed
  customImg.style.height = '30px'; // Adjust the size as needed

  // Event listener
  customImg.addEventListener('click', () => {
    alert('Custom image clicked');
  });

  // Append img
  btnContainer.appendChild(customImg);
}