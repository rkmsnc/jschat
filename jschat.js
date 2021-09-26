(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : (factory((global.JSChat = {})))
}(this, function (exports) {
  'use strict'

  const JSChat = /** @class */ (function () {
    class JSChat {
      constructor (options) {
        options = options || {}
        this.httpHost = options.httpHost || 'localhost:8000'
        this.https = options.https ? 'https://' : 'http://'
        this.wss = options.wss ? 'wss://' : 'ws://'
        this.wsHost = options.wsHost || 'localhost:5000'
        this.loginTitle = options.loginTitle || 'Login as'
        this.loginButtonText = options.loginButtonText || 'Let me in'
        this.data = options.sampleData || []
        this.isLogin = (this.data.length === 0)
        this.chatTitle = options.chatTitle || 'My Chat'
        this.inputPlaceHolder = options.inputPlaceHolder || 'type something...'
        this.sendButtonIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#009688"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4.01 6.03l7.51 3.22-7.52-1 .01-2.22m7.5 8.72L4 17.97v-2.22l7.51-1M2.01 3L2 10l15 2-15 2 .01 7L23 12 2.01 3z"/></svg>'
        this.emojiIcon = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#009688"><g><rect fill="none" height="24" width="24"/></g><g><g/><g><circle cx="15.5" cy="9.5" r="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M12,18c2.28,0,4.22-1.66,5-4H7C7.78,16.34,9.72,18,12,18z"/><path d="M11.99,2C6.47,2,2,6.48,2,12c0,5.52,4.47,10,9.99,10C17.52,22,22,17.52,22,12C22,6.48,17.52,2,11.99,2z M12,20 c-4.42,0-8-3.58-8-8c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z"/></g></g></svg>'

        const chatMain = document.querySelector('.chat-main')
        chatMain.innerHTML = `<div class="chat-header">
        ${this.chatTitle} <span class="chat-header-close">&times;</span>
          </div>
          <div class="chat-body"></div>
          <div class="chat-emoji-body" displayhide></div>
          <div class="chat-footer">
            <input class="chat-footer-input" name="chat-footer-input" type='text' value="" placeholder="${this.inputPlaceHolder}" />
            <div class="chat-send-button">
              ${this.sendButtonIcon}
            </div>
            <div class="chat-emoji">
              ${this.emojiIcon}
            </div>
          </div>`

        this.addMessage = (paramData) => {
          const time = paramData.time
          const message = paramData.message
          const username = paramData.username
          const options = paramData.options || {}
          const className = `chat-body-${username === this.getUsername() ? 'right' : 'left'}`
          const divTag = document.createElement('div')
          if (options.type === 'JOINED') {
            divTag.innerHTML = `<span>${username} ~ ${message}</b></span>`
            divTag.classList = 'chat-body-center'
          } else {
            divTag.classList = className
            divTag.innerHTML = `<span>${message}<i> ${time}</i><b> ~ ${username}</b></span>`
          }
          const chatBody = document.querySelector('.chat-body')
          chatBody.appendChild(divTag)
          chatBody.scrollTop = chatBody.scrollHeight
        }

        this.keydownMessage = (e) => {
          if (e.keyCode === 13) {
            this.createMessage()
          }
        }

        this.keydownUsername = (e) => {
          if (e.keyCode === 13) {
            this.setUsername()
          }
        }

        this.setUsername = () => {
          const username = document.querySelector('[name="chat-login-input"]').value
          window.sessionStorage.setItem('username', username)
          this.createServer()
          this.createMessage('joined', { type: 'JOINED' })
          this.hideLogin()
          chatFooterInput.focus()
        }

        this.hideLogin = () => {
          const loginPopup = document.querySelector('.chat-login-main')
          document.querySelector('body').removeChild(loginPopup)
        }

        this.getUsername = () => {
          return window.sessionStorage.getItem('username')
        }

        this.paddingLeft = (num, targetLength) => {
          return num.toString().padStart(targetLength, 0)
        }

        this.getCurrentTime = () => {
          const date = new Date()
          const hours = date.getHours()
          const minutes = this.paddingLeft(date.getMinutes(), 2)
          let time
          if (hours > 12) {
            time = this.paddingLeft(hours - 12, 2) + ':' + minutes + ' PM'
          } else if (hours === 0) {
            time = '12:' + minutes + ' AM'
          } else {
            time = this.paddingLeft(hours, 2) + ':' + minutes + ' AM'
          }
          return time
        }

        this.createMessage = (paramMessage, options = {}) => {
          const message = typeof paramMessage === 'string' ? paramMessage : this.getMessage()
          if (message.trim() !== '') {
            const time = this.getCurrentTime()
            const username = this.getUsername()
            this.sendMessage({
              message: message,
              username: username,
              time: time,
              options: options
            })
          }
        }

        this.sendMessage = async (data) => {
          await window.fetch(this.https + this.httpHost, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          this.setMessage('')
        }

        this.createServer = () => {
          this.socket = new window.WebSocket(this.wss + this.wsHost)

          this.socket.onopen = () => {
            this.socket.send('Connection Established')
          }

          this.socket.onmessage = (e) => {
            this.addMessage(JSON.parse(e.data))
          }
        }

        if (this.isLogin === true) {
          const loginMainTag = document.createElement('div')
          loginMainTag.classList = 'chat-login-main chat-login-overlay'
          loginMainTag.innerHTML = `<div class="chat-login-main-container">
            <div class="chat-login-header">${this.loginTitle}</div>
            <input autofocus name="chat-login-input" class="chat-login-input" type="text" />
            <div class="chat-login-footer">${this.loginButtonText}</div>
          </div>`
          document.querySelector('body').appendChild(loginMainTag)
          document.querySelector('.chat-login-input').addEventListener('keydown', this.keydownUsername)
          document.querySelector('.chat-login-footer').addEventListener('click', this.setUsername)
        }
        document.querySelector('.chat-send-button').addEventListener('click', this.createMessage)
        const chatFooterInput = document.querySelector('[name="chat-footer-input"]')
        chatFooterInput.addEventListener('keydown', this.keydownMessage)

        const emojiBody = document.querySelector('.chat-emoji-body')
        const emojiArray = ['129488', '129327', '129326', '129325', '129324', '129323', '129322', '129321', '129320', '129319', '129317', '129316', '129315', '129314', '129313', '129312', '129301', '129300', '129299', '129298', '129297', '129296', '128580', '128579', '128578', '128577', '128567', '128566', '128565', '128564', '128563', '128562', '128561', '128560', '128559', '128558', '128557', '128556', '128555', '128554', '128553', '128552', '128551', '128550', '128549', '128548', '128547', '128546', '128545', '128544', '128543', '128542', '128541', '128540', '128539', '128538', '128537', '128536', '128535', '128534', '128533', '128532', '128531', '128530', '128529', '128528', '128527', '128526', '128525', '128524', '128523', '128522', '128521', '128520', '128519', '128518', '128517', '128516', '128515', '128514', '128513', '128512']
        for (let i = 0; i < emojiArray.length; i++) {
          const element = emojiArray[i]
          const span = document.createElement('span')
          span.innerHTML = '&#' + element + ';'
          emojiBody.appendChild(span)
        }

        this.chatEmojiClick = () => {
          emojiBody.toggleAttribute('displayhide')
        }
        const chatEmoji = document.querySelector('.chat-emoji')
        chatEmoji.addEventListener('click', this.chatEmojiClick)
        const emoji = document.querySelectorAll('.chat-emoji-body>span')
        for (let i = 0; i < emoji.length; i++) {
          const element = emoji[i]
          element.addEventListener('click', (e) => {
            console.log(e.target.innerHTML)
            this.setMessage(this.getMessage() + e.target.innerHTML)
          })
        }

        this.setMessage = (message) => {
          chatFooterInput.value = message
        }

        this.getMessage = () => {
          return chatFooterInput.value
        }

        if (this.data.length > 0) {
          for (let i = 0; i < this.data.length; i++) {
            this.addMessage(this.data[i])
          }
        }
      }
    }
    JSChat.version = '1.0.0'
    return JSChat
  }())

  window.JSChat = JSChat
  exports.JSChat = JSChat
  exports.default = JSChat
  Object.defineProperty(exports, '__esModule', { value: true })
}))
