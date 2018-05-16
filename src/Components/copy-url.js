import React from 'react'

const CopyUrl = () => {

  const addToClipboard = (e) => {
    e.preventDefault()
    const url = window.location.href
    navigator.clipboard.writeText(url);
  }

  return (
    <div id="copy-url-btn">
      <a href="#" onClick={addToClipboard}>
        <img src="/images/copy-url.png" alt="copy-url" id="copy-url-img" />
        <span className="url-btn">Copy URL</span>
      </a>
    </div>
  )
}

export default CopyUrl;
