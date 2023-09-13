// ==UserScript==
// @name         Fintopia Extension
// @namespace    http://tampermonkey.net/
// @version      0.7.14
// @description  fintopia helper
// @author       Dante Clericuzio
// @match        https://*.easycash.id/*
// @match        https://*.fintopia.tech/*
// @match        https://*.tapd.cn/*
// @match        https://*.yangqianguan.com/*
// @icon         https://fintopia.tech/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      easycash.id
// @connect      fintopia.tech
// @connect      geteasycash.asia
// @connect      yangqianguan.com
// @downloadURL  https://github.com/KennethChang1/test/raw/main/index.user.js
// @require      https://ng.wangerry.com/GM_config.js
// @require      https://ng.wangerry.com/moment.min.js
// @homepageURL  https://github.com/KennethChang1/test/blob/main/index.user.js
// @require      https://ng.wangerry.com/axios.min.js
// @noframes
// ==/UserScript==

(() => {
    'use strict';
  
    GM_config.init({
      'id': 'FintopiaConfig',
      'title': 'Function module switch',
      'fields': {
        "kibana": {
          'label': 'Kibana Function',
          'type': 'checkbox',
          'default': true
        },
        "overlay": {
          'label': 'Remove YqgAdmin new version prompt',
          'type': 'checkbox',
          'default': true
        },
        "contract_sync": {
          'label': 'Admin protocol synchronization',
          'type': 'checkbox',
          'default': true
        },
        "jenkins": {
          'label': 'Jenkins Function',
          'type': 'checkbox',
          'default': true
        },
        "api-stat": {
          'label': 'Mr.Big Statistics page',
          'type': 'checkbox',
          'default': true
        },
        "code": {
          'label': 'Phabricator',
          'type': 'checkbox',
          'default': true
        },
        "tsTooltips": {
          'label': 'Select timestamp prompt',
          'type': 'checkbox',
          'default': true
        },
        "tapd": {
          "label": "TAPD Task Synchronization",
          "type": "checkbox",
          "default": true
        },
        "tapd-bug": {
          "label": "TAPD Task Synchronization - Defects",
          "type": "checkbox",
          "default": true
        },
        "tapd-task": {
          "label": "TAPD Task Synchronization - Tasks",
          "type": "checkbox",
          "default": true
        },
        "tapd-story": {
          "label": "TAPD Task Synchronization - Requirements",
          "type": "checkbox",
          "default": true
        },
        "env-switch": {
          "label": "Environment Switching Toggle",
          "type": "checkbox",
          "default": true
        },
        "code-openai": {
          "label": "Phabricator Integration for OpenAI Code Review",
          "type": "checkbox",
          "default": true
        }      
      }
    });
    GM_registerMenuCommand('Function Module Switch', () => {
      GM_config.open()
    })
  
    let host = window.location.host
    let pathname = window.location.pathname
  
    switch (host) {
      case "kibana.yangqianguan.com":
      case "kibana.fintopia.tech":
        if (GM_config.get('kibana')) {
          forOnlineKibana();
        }
        if (GM_config.get('env-switch')) {
          forEnvSwitchKibana();
        }
        break
  
      case "kibana-test.yangqianguan.com":
      case "kibana-test.fintopia.tech":
        if (GM_config.get('kibana')) {
          forTestKibana();
        }
        if (GM_config.get('env-switch')) {
          forEnvSwitchKibana();
        }
        break
  
      case "yqg-admin.yangqianguan.com":
      case "yqg-admin-test.yangqianguan.com":
      case "yqg-admin.fintopia.tech":
      case "yqg-admin-test.fintopia.tech":
  
        if (GM_config.get('overlay')) {
          forDisableYqgadminOverlay()
        }
        if (pathname.startsWith("/loan/admin/analysis/") && GM_config.get('api-stat')) {
          forApiStat()
        }
        if (pathname.startsWith("/cash-loan/advanced/contract/upload") && GM_config.get('contract_sync')) {
          forAdminContractSync(host === "yqg-admin.yangqianguan.com" || host === "yqg-admin.fintopia.tech")
        }
        break
  
      case "jenkins.yangqianguan.com":
      case "jenkins.fintopia.tech":
        if (GM_config.get('jenkins')) {
          forJenkins()
        }
        break
  
      case "api.yangqianguan.com":
      case "api.fintopia.tech":
        if (pathname.startsWith("/api/loan/analysis/")) {
          if (GM_config.get('api-stat')) {
            forApiStat()
          }
        }
        break
  
      case "code.yangqianguan.com":
      case "code.fintopia.tech":
        if (GM_config.get('code')) {
          forPhabricator()
        }
        if (GM_config.get('tapd') && (pathname.startsWith("/differential/revision/attach") || pathname.startsWith("/differential/revision/edit/"))) {
          forTapdInjectPhabricator();
        }
        if (GM_config.get('code-openai')) {
          if (pathname.startsWith("/differential/diff")) {
            // commit page
            forPhabricatorOpenAIPreview();
          } else if (pathname.startsWith("/D")) {
            // review page
            forPhabricatorOpenAIReview();
          }
        }
  
        forDifferentialCopy();
        break;
  
      case "loan-admin.fintopia.tech":
      case "loan-admin-test.yangqianguan.com":
        // if (GM_config.get('highlight')) {
        //     forLoanAdminHighlight()
        // }
        if (GM_config.get('env-switch')) {
          forEnvSwitchLoanAdmin();
        }
        break;
  
      case "tech-admin.fintopia.tech":
      case "tech-admin-test.yangqianguan.com":
        // if (GM_config.get('highlight')) {
        //     forLoanAdminHighlight()
        // }
        if (GM_config.get('env-switch')) {
          forEnvSwitchTechAdmin();
        }
        break;
  
      case "www.tapd.cn":
        if (GM_config.get('tapd')) {
          forTapdGet();
        }
        break;
  
      case "ychat.fintopia.tech":
      case "ychat-test.yangqianguan.com":
        if (GM_config.get('env-switch')) {
          forEnvSwitchYchat();
        }
        break;
  
      case "funding-admin.fintopia.tech":
        if (pathname.startsWith("/sql")) {
          forFundingAdminOverseaFetch();
        }
        break;
  
      default:
        console.log("useless sites for yqg", host)
    }
  
    if (GM_config.get('tsTooltips')) {
      tsTooltips()
    }
  })();
  
  function forFundingAdminOverseaFetch() {
    unsafeWindow.overseaFetch = GM_xmlhttpRequest;
  }
  
  function forDifferentialCopy() {
    let title = document.querySelector('.phui-header-header').innerText
    let href = location.href
  
    if (location.pathname.startsWith("/D")) {
      let container = document.createElement("span");
      container.className = "policy-header-callout";
  
      let icon = document.createElement("span")
      icon.className = "visual-only phui-icon-view phui-font-fa fa-copy";
  
      let link = document.createElement("a");
      link.className = "policy-link";
      link.text = "Copy Title and Link";
      link.onclick = () => {
        navigator.clipboard.writeText(title + "\n" + href);
        icon.classList.replace("fa-copy", "fa-check")
        link.text = "Copy Success";
        setTimeout(() => {
          link.text = "Copy Title and Link";
          icon.classList.replace("fa-check", "fa-copy")
        }, 1000);
      }
  
      container.append(icon);
      container.append(link);
  
      document.querySelector('.phui-header-subheader').prepend(container);
    }
  }
  
  function forPhabricatorOpenAIPreview() {
    let commitId = location.pathname.match(/\d+/)[0];
    forPhabricatorOpenAI(commitId, false)
  }
  
  function forPhabricatorOpenAIReview() {
    try {
      let commitId = document.querySelector('.differential-update-history-footer').parentElement.querySelector('tr:last-child').querySelectorAll('td')[1].innerText;
      forPhabricatorOpenAI(commitId, true)
    } catch (e) {
      console.error("get commitId failed", e);
    }
  }
  
  function forPhabricatorOpenAI(commitId, hasSummary) {
    console.log("openai commitId:", commitId);
    GM_addStyle('.differential-ai-notice{border-top: 1px solid #c9b8a8;border-bottom: 1px solid #c9b8a8;background-color: #dcffe5;padding: 12px;}')
    let openAILogoSVG = '<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 118 32" class="" style="width: 59px;height: 16px;margin-right:5px;vertical-align: bottom;"><g fill="currentColor"><path d="m36.7 15.4c0 5.2 3.4 8.9 8 8.9s8-3.6 8-8.9-3.4-8.9-8-8.9-8 3.7-8 8.9zm13 0c0 3.7-2 6.2-4.9 6.2s-4.9-2.4-4.9-6.2 2-6.2 4.9-6.2 4.9 2.4 4.9 6.2z"></path><path d="m61.4 24.3c3.5 0 5.5-3 5.5-6.6s-2-6.6-5.5-6.6c-1.6 0-2.8.6-3.6 1.6v-1.3h-2.9v16.9h2.9v-5.6c.8.9 2 1.6 3.6 1.6zm-3.7-6.9c0-2.4 1.3-3.7 3.1-3.7 2.1 0 3.2 1.6 3.2 4s-1.1 4-3.2 4c-1.8 0-3.1-1.3-3.1-3.6z"></path><path d="m74.8 24.3c2.5 0 4.5-1.3 5.4-3.5l-2.5-.9c-.4 1.3-1.5 2-2.9 2-1.8 0-3.1-1.3-3.4-3.5h8.8v-1c0-3.5-1.9-6.2-5.6-6.2-3.5 0-6 2.9-6 6.6 0 3.8 2.6 6.5 6.2 6.5zm-.2-10.7c1.8 0 2.7 1.2 2.7 2.6h-5.8c.5-1.7 1.6-2.6 3.1-2.6z"></path><path d="m82.4 24h2.9v-7.4c0-1.8 1.3-2.8 2.6-2.8 1.6 0 2.2 1.1 2.2 2.7v7.5h2.9v-8.3c0-2.7-1.6-4.5-4.2-4.5-1.6 0-2.8.7-3.5 1.6v-1.3h-2.9z"></path><path d="m101.4 6.8-6.5 17.2h3l1.5-3.9h7.4l1.5 3.9h3.1l-6.5-17.2zm1.7 3.4 2.7 7.2h-5.4z"></path><path d="m116.4 6.8h-3.1v17.2h3.1z"></path><path class="a-icon--logo-text-logo" d="m29.7 13.1c.4-1.1.5-2.2.4-3.3s-.5-2.2-1-3.2c-.9-1.5-2.2-2.7-3.7-3.4-1.6-.7-3.3-.9-5-.5-.8-.8-1.7-1.5-2.7-2s-2.2-.7-3.3-.7c-1.7 0-3.4.5-4.8 1.5s-2.4 2.4-2.9 4c-1.2.3-2.2.8-3.2 1.4-.9.7-1.6 1.6-2.2 2.5-.9 1.5-1.2 3.2-1 4.9s.9 3.3 2 4.6c-.4 1.1-.5 2.2-.4 3.3s.5 2.2 1 3.2c.9 1.5 2.2 2.7 3.7 3.4 1.6.7 3.3.9 5 .5.8.8 1.7 1.5 2.7 2s2.2.7 3.3.7c1.7 0 3.4-.5 4.8-1.5s2.4-2.4 2.9-4c1.1-.2 2.2-.7 3.1-1.4s1.7-1.5 2.2-2.5c.9-1.5 1.2-3.2 1-4.9s-.8-3.3-1.9-4.6zm-12 16.8c-1.6 0-2.8-.5-3.9-1.4 0 0 .1-.1.2-.1l6.4-3.7c.2-.1.3-.2.4-.4s.1-.3.1-.5v-9l2.7 1.6v7.4c.1 3.5-2.7 6.1-5.9 6.1zm-12.9-5.5c-.7-1.2-1-2.6-.7-4 0 0 .1.1.2.1l6.4 3.7c.2.1.3.1.5.1s.4 0 .5-.1l7.8-4.5v3.1l-6.5 3.8c-1.4.8-3 1-4.5.6-1.6-.4-2.9-1.4-3.7-2.8zm-1.7-13.9c.7-1.2 1.8-2.1 3.1-2.6v.2 7.4c0 .2 0 .4.1.5.1.2.2.3.4.4l7.8 4.5-2.7 1.6-6.4-3.7c-1.4-.8-2.4-2.1-2.8-3.6s-.3-3.3.5-4.7zm22.1 5.1-7.8-4.5 2.7-1.6 6.4 3.7c1 .6 1.8 1.4 2.3 2.4s.8 2.1.7 3.3c-.1 1.1-.5 2.2-1.2 3.1s-1.6 1.6-2.7 2v-7.6c0-.2 0-.4-.1-.5 0 0-.1-.2-.3-.3zm2.7-4s-.1-.1-.2-.1l-6.4-3.7c-.2-.1-.3-.1-.5-.1s-.4 0-.5.1l-7.8 4.5v-3.1l6.5-3.8c1-.6 2.1-.8 3.3-.8 1.1 0 2.2.4 3.2 1.1.9.7 1.7 1.6 2.1 2.6s.5 2.2.3 3.3zm-16.8 5.6-2.7-1.6v-7.5c0-1.1.3-2.3.9-3.2.6-1 1.5-1.7 2.5-2.2s2.2-.7 3.3-.5c1.1.1 2.2.6 3.1 1.3 0 0-.1.1-.2.1l-6.4 3.7c-.2.1-.3.2-.4.4s-.1.3-.1.5zm1.4-3.2 3.5-2 3.5 2v4l-3.5 2-3.5-2z"></path></g></svg>';
  
    let fileDivMap = [];
  
    doInject();
  
    function doInject() {
      if (document.querySelectorAll('.differential-loading').length > 0) {
        setTimeout(doInject, 1000);
        return;
      }
  
      document.querySelectorAll('.differential-changeset').forEach(fileDiv => {
        let fileName = fileDiv.querySelector('h1').innerText;
  
        let injectContainer = fileDiv.querySelector('.changeset-view-content');
  
        let injectDiv = document.createElement('ul');
        injectDiv.className = 'differential-ai-notice';
        fileDivMap[fileName] = injectDiv;
        addTips(injectDiv, ["Loading..."])
  
        injectContainer.prepend(injectDiv);
      })
  
      let summaryContentList = document.createElement('ul');
      if (hasSummary) {
        let summaryContainer = document.querySelector('.phui-property-list-section');
        let summaryHeader = document.createElement('div');
        summaryHeader.className = "phui-property-list-section-header";
        summaryHeader.innerHTML = openAILogoSVG;
        summaryContainer.append(summaryHeader);
        let summaryContent = document.createElement('div');
        summaryContent.className = "phui-property-list-text-content";
        summaryContentList.className = 'differential-ai-notice';
        addTips(summaryContentList, ["Loading..."], false)
        summaryContent.append(summaryContentList);
        summaryContainer.append(summaryContent);
      }
  
      let retryCount = 0;
  
      requestAI(commitId);
  
      function requestAI(commitId) {
        console.log("request codereview", commitId)
        retryCount++;
        if (retryCount > 1) {
          console.log("too many retry, exit")
          fillAllTips("Request Failed")
          return;
        } else if (retryCount > 1) {
          fillAllTips("There is a problem, please try again....(" + retryCount + ")")
        }
        GM.xmlHttpRequest({
          method: "GET",
          url: "https://phabulous.yangqianguan.com/ai/codeReview?diffId=" + commitId,
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 300000,
          onload: function (resp) {
            try {
              console.log("codeReview response", resp, resp.responseText);
              let response = JSON.parse(resp.responseText);
              Object.entries(fileDivMap).forEach(entry => {
                const [key, value] = entry;
                if (response.diff_result[key]) {
                  let tips = response.diff_result[key].replace("\n\n", "").replaceAll("\n\n", "\n").split("\n");
                  addTips(value, tips);
                } else {
                  addTips(value, ["No suggested results for this file."])
                }
              });
              if (response.summary_result && hasSummary) {
                addTips(summaryContentList, response.summary_result.replace("\n\n", "").replaceAll("\n\n", "\n").split("\n"), false)
              }
            } catch (e) {
              console.error("process ai api response error, retry in 1second", e)
              setTimeout(() => requestAI(commitId), 1000);
            }
          },
          onerror: function (response) {
            console.error("request ai api error, retry in 1second", response);
            setTimeout(() => requestAI(commitId), 1000);
          },
          ontimeout: function (response) {
            console.error("request ai api timeout, retry in 1second", response);
            setTimeout(() => requestAI(commitId), 1000);
          }
        });
      }
  
      function addTips(ulDiv, tips, firstLogo = true) {
        ulDiv.innerHTML = "";
        for (let i = 0; i < tips.length; i++) {
          let t = tips[i];
  
          let li = document.createElement('li');
          li.innerText = t;
          if (i === 0 && firstLogo) {
            let logoSvg = document.createElement('div');
            logoSvg.style = "display: inline;"
            logoSvg.innerHTML = openAILogoSVG;
            li.prepend(logoSvg);
          }
          ulDiv.append(li);
        }
      }
  
      function fillAllTips(message) {
        if (hasSummary) {
          addTips(summaryContentList, [message], false)
        }
        Object.entries(fileDivMap).forEach(entry => {
          const [key, value] = entry;
          addTips(value, [message], true);
        });
      }
  
    }
  }
  
  function forEnvSwitchTechAdmin() {
    check();
  
    function check() {
      if (document.querySelector(".right-box")) {
        doInject();
      } else {
        setTimeout(check, 1000);
      }
    }
  
    function doInject() {
      let text = "";
      if (location.host.endsWith("fintopia.tech")) {
        text = "Switch to the testing environment";
      } else {
        text = "Switch to the production environment";
      }
  
      let div = document.createElement("button");
      div.textContent = text;
      div.style = "margin-right: 10px";
      div.onclick = switchEnv;
      document.querySelector(".right-box").prepend(div)
    }
  }
  
  function forEnvSwitchLoanAdmin() {
    check();
  
    function check() {
      if (document.querySelector(".yqg-header-left")) {
        doInject();
      } else {
        setTimeout(check, 1000);
      }
    }
  
    function doInject() {
      let text = "";
      if (location.host.endsWith("fintopia.tech")) {
        text = "Switch to the testing environment";
      } else {
        text = "Switch to the production environment";
      }
  
      let div = document.createElement("button");
      div.innerText = text;
      div.className = "ant-btn ant-btn-primary"
      div.style = "margin-left: 10px";
      div.onclick = switchEnv;
      document.querySelector(".yqg-header-left").appendChild(div)
    }
  
  }
  
  function forEnvSwitchYchat() {
    check();
  
    function check() {
      if (document.querySelector(".yqg-header-icons")) {
        doInject();
      } else {
        setTimeout(check, 1000);
      }
    }
  
    function doInject() {
      let text = "";
      if (location.host.endsWith("fintopia.tech")) {
        text = "Switch to the testing environment";
      } else {
        text = "Switch to the production environment";
      }
  
      let div = document.createElement("button");
      div.textContent = text;
      div.style = "margin-right: 10px";
      div.className = "header-ytalk-btn ant-btn";
      div.onclick = switchEnv;
      document.querySelector(".yqg-header-icons").prepend(div)
    }
  }
  
  function forEnvSwitchKibana() {
  
  }
  
  function switchEnv() {
    let host = location.host;
    let path = location.pathname;
  
    if (host.endsWith("-test.yangqianguan.com")) {
      host = host.replace("-test.yangqianguan.com", ".fintopia.tech")
    } else {
      host = host.replace(".fintopia.tech", "-test.yangqianguan.com")
    }
  
    window.open("https://" + host + path, "_blank");
  }
  
  function forTapdGet() {
    // Try to access the task page
    let div = document.querySelector("#svn_keyword_new");
    if (div) {
      let copy = div.getAttribute("data-clipboard-text");
      saveCopy(copy)
    }
  
    let worktable = document.querySelector(".j-worktable-preview");
    if (worktable) {
      console.log("Dashboard page, monitor the tasks that can potentially be clicked.")
      worktable.addEventListener("DOMNodeInserted", (event) => {
        if (event.target.className === "j-worktable-preview-box") {
          setTimeout(() => {
            let copyDiv = document.querySelector(".j-worktable-preview__sourcecode")
            if (copyDiv) {
              let copy = copyDiv.getAttribute("data-clipboard-text");
              if (copy.indexOf('_orginal_url') === -1) {
                saveCopy(copy)
              }
            }
          }, 1000);
        }
      })
    }
  
    function saveCopy(str) {
      let key = str.split(" ")[0]
      let needTask = GM_config.get("tapd-task") && str.startsWith("--task");
      let needBug = GM_config.get("tapd-bug") && str.startsWith("--bug");
      let needStory = GM_config.get("tapd-story") && str.startsWith("--story");
  
      if (needTask || needBug || needStory) {
        let records = GM_getValue('tapd-task');
        if (!records) {
          records = [];
        }
        records = records.filter(t => t.split(" ")[0] !== key)
        records.unshift(str);
        GM_setValue('tapd-task', records)
        console.log("tapd-task", records)
      } else {
        console.log("Ignore the source code associations", str);
      }
    }
  }
  
  function forTapdInjectPhabricator() {
  
    let appendMount = [...document.querySelectorAll(".aphront-form-label")].filter(t => t.innerText === 'Summary')[0].parentElement;
  
    let rootDiv = document.createElement("div");
    rootDiv.className = "aphront-form-control grouped aphront-form-control-text";
  
    let labelDiv = document.createElement("label");
    labelDiv.className = "aphront-form-label";
    labelDiv.innerText = "Tapd enhancement (click to refresh)";
    labelDiv.onclick = () => {
      loadLocalStorage();
    }
    rootDiv.appendChild(labelDiv);
  
    let containerDiv = document.createElement("div");
    containerDiv.className = "aphront-form-input";
    rootDiv.appendChild(containerDiv);
    loadLocalStorage();
    appendMount.append(rootDiv);
  
    function loadLocalStorage() {
      let data = GM_getValue('tapd-task');
      containerDiv.innerHTML = "";
      if (data && data.length > 0) {
        data.forEach(a => {
          let title = a.substring(a.indexOf(" ", a.indexOf("--user")), a.indexOf("https://")).trim();
          let url = a.substring(a.indexOf("https:"))
          let id = a.split(" ")[0];
  
          let wrapperDiv = document.createElement("div");
          wrapperDiv.style = "display: block";
  
          let copyBtn = document.createElement("a");
          copyBtn.className = "button button-grey has-text icon-last phui-button-default";
          copyBtn.innerText = "Select";
          copyBtn.onclick = function () {
            document.querySelector('textarea[name="summary"]').value += "\n\n" + a
          }
          wrapperDiv.appendChild(copyBtn);
  
          let removeBtn = document.createElement("a");
          removeBtn.className = "button button-grey has-text icon-last phui-button-default";
          removeBtn.innerText = "Select";
          removeBtn.onclick = function () {
            data = data.filter(d => d !== a);
            GM_setValue('tapd-task', data);
            if (data.length === 0) {
              containerDiv.innerHTML = "";
              let toastDiv = document.createElement("p");
              toastDiv.style = "margin-top: 5px"
              toastDiv.innerText = "Please open the task in Tapd first, it will automatically synchronize here";
              containerDiv.appendChild(toastDiv);
            }
            wrapperDiv.style = "display: none";
            console.log(data);
          }
          wrapperDiv.appendChild(removeBtn);
  
          let titleDiv = document.createElement("a");
          titleDiv.href = url;
          titleDiv.target = "_blank";
          titleDiv.innerText = "[" + id + "] " + title;
          wrapperDiv.appendChild(titleDiv);
  
          containerDiv.appendChild(wrapperDiv);
        })
      } else {
        let toastDiv = document.createElement("p");
        toastDiv.style = "margin-top: 5px"
        toastDiv.innerText = "Please open the task in Tapd first; it will automatically sync here";
        containerDiv.appendChild(toastDiv);
      }
    }
  }
  
  function tsTooltips() {
    // Timestamp Popup
    GM_addStyle(".tm_ts_tooltips {  background-color: #dfdede;  color: #1797d3;  text-align: center;  border-radius: 5px;  font-size: 10px;  padding: 5px;  margin-left: 5px;  position: fixed; z-index: 999999}");
    let tsTooltips = document.createElement('div')
    tsTooltips.id = "tm_ts_tooltips"
    tsTooltips.className = "tm_ts_tooltips"
    tsTooltips.style = "display: none"
    document.body.append(tsTooltips);
  
    document.body.onmouseup = (ev) => {
      let select = window.getSelection().toString();
      if (select) {
        if (!isNaN(select)) {
          let number = parseInt(select);
          if (number > 1546272000000 && number < 1767196800000) {
            let m = moment(number)
            if (m.isValid()) {
              tsTooltips.style = "top: " + (ev.y + 10) + "px; left: " + (ev.x + 10) + "px;";
              tsTooltips.textContent = m.format('YYYY-MM-DD HH:mm:ss');
              return;
            }
          }
        }
      }
      tsTooltips.style = "display: none";
    }
  }
  
  /**
   * For loan-admin highLight
   */
  function forLoanAdminHighlight() {
    GM_addStyle(".yqg-highlight {color: #1890ff; display: inline; background: #eeeeee; border-radius: 5px; padding: 1px 1px;}");
    document.querySelector("body").addEventListener("DOMNodeInserted", () => {
      document.querySelectorAll(".def-value").forEach(element => {
        if (element.innerHTML.indexOf("yqg-highlight") === -1) {
          if (element.innerText.indexOf("#{") !== -1) {
            element.innerHTML = element.innerHTML.replaceAll(/(\#\{.*?\})/g, '<div class="yqg-highlight">$1</div>')
          }
        }
      });
    })
  }
  
  /**
   * Admin agreement synchronization, copy directly from the test environment to the production environment
   * @param {*} onlineEnv
   */
  function forAdminContractSync(onlineEnv) {
    if (!onlineEnv) {
      doTestEnvInject()
    } else {
      doOnlineEnvOp()
    }
  
    function doOnlineEnvOp() {
      let records = GM_getValue('contract-sync')
      if (records && records.length > 0) {
        console.log("inject contract sync online")
        try {
          let controller = angular.element(document.querySelector('yqg-cash-loan-advanced-contract-upload'))
          if (controller) {
            let allRecords = controller.data().$isolateScope.vm.recordList;
            if (allRecords.length > 0) {
              // Delete all values
              GM_setValue('contract-sync', [])
              // Filter out configurations that do not exist
              let uncommon = records.filter(r => !allRecords.find(ar => ar.contractGroup === r.contractGroup && ar.type === r.type && ar.version === r.version))
              if (uncommon.length === 0) {
                YqgAlert.error("There are no agreements to synchronize")
              } else {
                console.log(uncommon)
                YqgAlert.warning("Please note that we will synchronize agreements from the testing environment to the production environment. Existing agreements will be ignored. To cancel the synchronization, please close this page. The synchronization will start after closing this dialog. Number of agreements:：" + uncommon.length).then(() => {
                  uncommon.forEach(r => downloadContractAndUpload(r))
                })
              }
            } else {
              console.log("records empty, retry")
              setTimeout(doOnlineEnvOp, 1000);
            }
          } else {
            console.log("retry waiting angular js")
            setTimeout(doOnlineEnvOp, 1000);
          }
        } catch (e) {
          console.log("catch exception", e)
          console.log("retry waiting angular js")
          setTimeout(doOnlineEnvOp, 1000);
        }
      }
    }
  
    function downloadContractAndUpload(d) {
      GM_xmlhttpRequest({
        method: "GET",
        url: d.fileDownloadsUrl,
        responseType: "blob",
        onload: function (args) {
          let postData = {
            signContractTiming: d.signContractTiming,
            signatures: JSON.stringify(d.signatures),
            type: d.type,
            version: d.version,
            contractGroup: d.contractGroup,
            individualContractGroup: d.individualContractGroup,
            displayNameForCustomer: d.displayNameForCustomer,
            contractTemplate: args.response,
            comment: ""
          }
  
          let formData = new FormData()
          for (let k in postData) {
            if (k === "contractTemplate") {
              formData.append(k, postData[k], "demo.docx");
            } else {
              formData.append(k, postData[k]);
            }
          }
  
          fetch("/admin/operation/cashloan/contract/uploadContractTemplate", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "en;q=0.9",
              "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
            },
            "referrer": "https://yqg-admin.fintopia.tech/cash-loan/advanced/contract/upload",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": formData,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
          }).then(r => r.json())
            .then(r => {
              console.log("upload", d, r)
              YqgToast.info("Upload: " + d.type)
            })
        }
      })
    }
  
    function doTestEnvInject() {
      console.log("inject contract sync")
      try {
        let controller = angular.element(document.querySelector('yqg-cash-loan-advanced-contract-upload'))
        if (controller) {
          let btn = document.createElement('button');
          btn.className = "btn btn-danger"
          btn.id = "_yqg_contract_sync"
          btn.textContent = "Synchronize to production environment"
          btn.onclick = function () {
            let records = controller.data().$isolateScope.vm.recordList
            if (records.length > 20) {
              YqgAlert.error("Boss, having more than 20 agreements must be a mistake, right?");
            } else {
              GM_setValue('contract-sync', records)
              window.open("https://yqg-admin.fintopia.tech/cash-loan/advanced/contract/upload", '_blank')
            }
          }
          let btns = document.querySelectorAll('.yqg-cash-loan-advanced-contract-upload form button');
          btns[btns.length - 1].after(btn)
        } else {
          console.log("retry waiting angular js")
          setTimeout(doTestEnvInject, 1000);
        }
      } catch (e) {
        console.log("catch exception", e)
        console.log("retry waiting angular js")
        setTimeout(doTestEnvInject, 1000);
      }
    }
  }
  
  /**
   * For Phabricator
   */
  function forPhabricator() {
    GM_addStyle(".phui-document-view.phui-document-view-pro {max-width: 1500px !important}}");
    // new line background
    GM_addStyle(".differential-diff td.new {background: #b2fab445;");
    // new line
    GM_addStyle(".differential-diff td.new span.bright, .differential-diff td.new-full, .prose-diff span.new {background: #73e37dad;}");
    // old line background
    GM_addStyle(".differential-diff td.old {background: rgba(251,175,175,.1);}");
    // old line
    GM_addStyle(".differential-diff td.old span.bright, .differential-diff td.old-full, .prose-diff span.old {background: rgb(251 120 120 / 40%);}");
  }
  
  /**
   * For Mr.Big Api Stat Page Enhance
   */
  function forApiStat() {
    let params = new URLSearchParams(window.location.search)
  
    let body = document.body
  
    let enhanceContainer = document.createElement('div')
    enhanceContainer.className = "markdown-body"
    enhanceContainer.style = "padding-bottom: 0px"
    body.prepend(enhanceContainer)
  
    let header = document.createElement('h2')
    header.textContent = "Funding source: " + params.get("provider")
    enhanceContainer.append(header)
  
    // Functional buttons (Daily Statistics, Hourly Statistics)
    let btnGroupFunction = document.createElement('div')
    btnGroupFunction.append(createButton('* Statistical hourly breakdown', () => {
      currentWithUnit(params, 1, 0, 'HOURS')
    }))
    btnGroupFunction.append(createButton('* Statistical daily breakdown', () => {
      currentWithUnit(params, 0, -1, 'DAYS')
    }))
    btnGroupFunction.style = "padding-bottom: 10px"
    enhanceContainer.append(btnGroupFunction)
  
    // Forward and Backward buttons
    let btnGroup = document.createElement('div')
    enhanceContainer.append(btnGroup)
  
    if (params.get('unit').toUpperCase() === 'DAYS') {
      doMock('Day', 'Today', -1)
    } else if (params.get('unit').toUpperCase() === 'HOURS') {
      doMock('Hour', 'The current hour', 0)
    }
  
    function doMock(tip, currentTip, currentEnd) {
      btnGroup.append(createButton('<- Go back one hour' + tip, () => {
        before(params, 1)
      }))
  
      if (params.get('end') * 1 !== currentEnd) {
        // If it's not today, then add today and the next day.
        btnGroup.append(createButton('- ' + currentTip + ' -', () => {
          current(params, currentEnd + 1, currentEnd)
        }))
        btnGroup.append(createButton('Go forward one hour' + tip + ' ->', () => {
          after(params, 1)
        }))
      }
    }
  
    function createButton(text, func) {
      let btn = document.createElement('button')
      btn.textContent = text
      btn.onclick = func
      return btn
    }
  
    function after(params, value) {
      params.set('end', params.get('end') - value)
      params.set('start', params.get('start') - value)
      window.location.href = "?" + params.toString()
    }
  
    function before(params, value) {
      params.set('end', params.get('end') * 1 + value)
      params.set('start', params.get('start') * 1 + value)
      window.location.href = "?" + params.toString()
    }
  
    function current(params, start, end) {
      params.set('start', start)
      params.set('end', end)
      window.location.href = "?" + params.toString()
    }
  
    function currentWithUnit(params, start, end, unit) {
      params.set('start', start)
      params.set('end', end)
      params.set('unit', unit)
      window.location.href = "?" + params.toString()
    }
  }
  
  
  /**
   * For Disable Yqgadmin Overlay
   */
  function forDisableYqgadminOverlay() {
    document.querySelector("body").addEventListener("DOMNodeInserted", () => {
      document.querySelectorAll(".swal-overlay").forEach(element => {
        if (element.innerText.indexOf("New version notification") !== -1) {
          element.remove()
          console.log("removing new version overlay")
        }
      });
    })
  }
  
  /**
   * For Jenkins
   * 1. Increase the options for adding an executor/branch/related time on the project page.
   */
  function forJenkins() {
    let maxRetryCount = 3
    let retryCount = 0
    let jenkinsData = []
    let stageViewEventAdded = false
  
    function doInject() {
      let stageView = document.querySelector(".cbwf-stage-view");
      if (stageView && !stageViewEventAdded) {
        stageView.addEventListener("DOMNodeInserted", (event) => {
          if (event.target.className.indexOf("extrainfo") === -1) {
            fillTips()
          }
        })
        stageViewEventAdded = true
      }
  
      let boxDiv = document.getElementById("pipeline-box")
      if (boxDiv) {
        // let thHead = document.createElement("th")
        // thHead.className = "stage-header-name-addon"
        // thHead.textContent = "Additional Information"
        // document.querySelector("#pipeline-box tr").appendChild(thHead)
  
        // let totalTd = document.createElement("td")
        // totalTd.className = "stage-total-addon"
        // totalTd.textContent = "-"
        // document.querySelector("#pipeline-box .totals-box tr").appendChild(totalTd)
        fillTips();
      } else {
        retryCount++
        if (retryCount <= maxRetryCount) {
          setTimeout(() => {
            doInject()
          }, 1000);
        }
      }
    }
  
    function fillTips() {
      let jobs = document.querySelectorAll('.tobsTable-body tr')
      jobs.forEach(jobDiv => {
        let jobId = jobDiv.getAttribute('data-runid')
        if (jobId !== null) {
          if (jenkinsData[jobId]) {
            setElementTips(jobDiv, jenkinsData[jobId])
          } else {
            getElementTipByJobId(jobDiv, jobId)
          }
        }
      })
    }
  
    function getElementTipByJobId(jobDiv, jobId) {
      axios.get(window.location.href + "/" + jobId + "/api/json?pretty=true").then(r => r.data)
        .then(data => {
          let tips = {}
  
          data.actions.forEach(action => {
            if (action._class === 'hudson.model.ParametersAction') {
              action.parameters.forEach(p => {
                if (p.name === "RELEASE_BRANCH" || p.name === "releaseBranch") {
                  tips['RELEASE_BRANCH'] = p.value.replace("origin/", "")
                } else if (p.name === "STAGE" || p.name === "buildEnv") {
                  tips['STAGE'] = p.value
                } else if (p.name === "MODULE_NAME" || p.name === "moduleName") {
                  tips['MODULE_NAME'] = p.value
                } else if (p.name === "SWIM_LANE_ID") {
                  tips['SWIM_LANE_ID'] = p.value
                } else if (p.name === "SUB_PROJECT") {
                  tips['SUB_PROJECT'] = p.value
                }
              })
            } else if (action._class === "hudson.model.CauseAction") {
              action.causes.forEach(c => {
                if (c._class === "hudson.model.Cause$UserIdCause") {
                  tips['USER'] = c.userName
                }
              })
            }
          })
  
          jenkinsData[jobId] = tips;
          // Write data
          setElementTips(jobDiv, tips)
        })
    }
  
    function setElementTips(jobDiv, tips) {
      let existsDiv = jobDiv.querySelector('td.extrainfo');
      while (existsDiv) {
        jobDiv.removeChild(existsDiv)
        existsDiv = jobDiv.querySelector('td.extrainfo');
      }
  
      let td = document.createElement('td')
      td.className = "extrainfo stage-cell"
      td.style = "padding: 1px 20px 1px 10px;"
  
      td.appendChild(createElement('div', 'extrainfo user', null, tips.USER, "white-space: nowrap; font-weight: 800; font-size: 16px"))
      if (tips.RELEASE_BRANCH) {
        td.appendChild(createElement('div', 'extrainfo branch', "Branch: ", tips.RELEASE_BRANCH, "white-space: nowrap"))
      }
      if (tips.STAGE) {
        td.appendChild(createElement('div', 'extrainfo stage', "Environment: ", tips.STAGE, "white-space: nowrap"))
      }
      if (tips['MODULE_NAME']) {
        td.appendChild(createElement('div', 'extrainfo module', "Module: ", tips['MODULE_NAME'], "white-space: nowrap"))
      }
      if (tips['SUB_PROJECT']) {
        td.appendChild(createElement('div', 'extrainfo swim', "Subproject: ", tips['SUB_PROJECT'], "white-space: nowrap"))
      }
      if (tips['SWIM_LANE_ID']) {
        td.appendChild(createElement('div', 'extrainfo swim', "Lane: ", tips['SWIM_LANE_ID'], "white-space: nowrap"))
      }
  
      jobDiv.append(td);
    }
  
    function createElement(type, clazz, title, content, style = "") {
      let ele = document.createElement(type)
      ele.className = clazz
      ele.style = style
      ele.textContent = content
  
      let titleEl = document.createElement('div')
      titleEl.textContent = title;
      titleEl.style = "display: inline; user-select: none";
      ele.prepend(titleEl);
      return ele
    }
  
    setTimeout(() => {
      doInject()
    }, 1000);
  }
  
  
  /**
   * For kibana
   * 1. Adjust the line height of search results to display them in full height
   * 2. Change the background color of the search results to make it easier to distinguish from the user's search color
   */
  function forOnlineKibana() {
    forKibana();
    GM_addStyle(".globalFilterGroup__wrapper { background-color: rgb(233 49 49 / 66%);}")
  
  }
  
  function forTestKibana() {
    forKibana();
    GM_addStyle(".globalFilterGroup__wrapper { background-color: rgb(29 197 59 / 68%);}")
  
  }
  
  function forKibana() {
    GM_addStyle("td > .truncate-by-height { max-height: 12224px !important; display: inline-block;}");
    GM_addStyle("mark { background-color: plum;}")
  }