export function initAttachments() {
  const attachBtn = document.querySelector(".composer-button--attach");
  const fileInput = document.querySelector("#file-input");
  const preview = document.querySelector("#composer-attachments");

  attachBtn.onclick = () => fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    preview.hidden = false;
    preview.innerHTML = `<span>Uploading...</span>`;

    setTimeout(() => {
      if (file.size > 5000000) {
        preview.innerHTML = `<span class="attachment-error">File too large</span> <button type="button" id="remove-file">×</button>`;
      } else {
        const isImage = file.type.startsWith("image/");
        const imgHtml = isImage ? `<img src="${URL.createObjectURL(file)}" width="24" height="24" alt="">` : "";
        preview.innerHTML = `${imgHtml}<span>${file.name}</span> <button type="button" id="remove-file">×</button>`;
      }
      document.querySelector("#remove-file").onclick = clear;
    }, 500);
  };

  function clear() {
    fileInput.value = "";
    preview.innerHTML = "";
    preview.hidden = true;
  }

  return {
    getFile: () => fileInput.files[0],
    clear,
  };
}
