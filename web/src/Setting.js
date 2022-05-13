// Copyright 2021 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Alert, message, Tag} from "antd";
import {isMobile as isMobileDevice} from "react-device-detect";
import i18next from "i18next";
// import moment from "moment";
import Sdk from "casdoor-js-sdk";

export let ServerUrl = '';
export let CasdoorSdk;

export function initServerUrl() {
  const hostname = window.location.hostname;
  if (hostname === 'localhost') {
    ServerUrl = `http://${hostname}:12000`;
  }
}

export function initCasdoorSdk(config) {
  CasdoorSdk = new Sdk(config);
}

function getUrlWithLanguage(url) {
  if (url.includes("?")) {
    return `${url}&language=${getLanguage()}`;
  } else {
    return `${url}?language=${getLanguage()}`;
  }
}

export function getSignupUrl() {
  return getUrlWithLanguage(CasdoorSdk.getSignupUrl());
}

export function getSigninUrl() {
  return getUrlWithLanguage(CasdoorSdk.getSigninUrl());
}

export function getUserProfileUrl(userName, account) {
  return getUrlWithLanguage(CasdoorSdk.getUserProfileUrl(userName, account));
}

export function getMyProfileUrl(account) {
  return getUrlWithLanguage(CasdoorSdk.getMyProfileUrl(account));
}

export function getProductBuyUrl(account, productName) {
  return getMyProfileUrl(account).replace("/account", `/products/${productName}/buy`);
}

export function getPaymentUrl(account, payment) {
  return getMyProfileUrl(account).replace("/account", `/payments/${payment.name}/result`);
}

export function getPaymentInvoiceUrl(account, payment) {
  return getMyProfileUrl(account).replace("/account", `/payments/${payment.name}`);
}

export function signin() {
  return CasdoorSdk.signin(ServerUrl);
}

export function parseJson(s) {
  if (s === "") {
    return null;
  } else {
    return JSON.parse(s);
  }
}

export function myParseInt(i) {
  const res = parseInt(i);
  return isNaN(res) ? 0 : res;
}

export function openLink(link) {
  // this.props.history.push(link);
  const w = window.open('about:blank');
  w.location.href = link;
}

export function openLinkSafe(link) {
  // Javascript window.open issue in safari
  // https://stackoverflow.com/questions/45569893/javascript-window-open-issue-in-safari
  let a = document.createElement('a');
  a.href = link;
  a.setAttribute('target', '_blank');
  a.click();
}

export function goToLink(link) {
  window.location.href = link;
}

export function goToLinkSoft(ths, link) {
  ths.props.history.push(link);
}

export function goToContact(ths) {
  goToLinkSoft(ths, "/contact");
}

export function showMessage(type, text) {
  if (type === "") {
    return;
  } else if (type === "success") {
    message.success(text);
  } else if (type === "error") {
    message.error(text);
  }
}

export function isAdminUser(account) {
  return account?.isAdmin;
}

export function isEditorUser(account) {
  return account?.tag === "Editor";
}

export function deepCopy(obj) {
  return Object.assign({}, obj);
}

export function insertRow(array, row, i) {
  return [...array.slice(0, i), row, ...array.slice(i)];
}

export function addRow(array, row) {
  return [...array, row];
}

export function prependRow(array, row) {
  return [row, ...array];
}

export function deleteRow(array, i) {
  // return array = array.slice(0, i).concat(array.slice(i + 1));
  return [...array.slice(0, i), ...array.slice(i + 1)];
}

export function swapRow(array, i, j) {
  return [...array.slice(0, i), array[j], ...array.slice(i + 1, j), array[i], ...array.slice(j + 1)];
}

export function trim(str, ch) {
  if (str === undefined) {
    return undefined;
  }

  let start = 0;
  let end = str.length;

  while(start < end && str[start] === ch)
    ++start;

  while(end > start && str[end - 1] === ch)
    --end;

  return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

export function isMobile() {
  // return getIsMobileView();
  return isMobileDevice;
}

export function getFormattedDate(date) {
  if (date === undefined || date === null) {
    return null;
  }

  date = date.replace('T', ' ');
  date = date.replace('+08:00', ' ');
  return date;
}

export function getFormattedDateShort(date) {
  return date.slice(0, 10);
}

export function getShortName(s) {
  return s.split('/').slice(-1)[0];
}

export function getShortText(s, maxLength=35) {
  if (s.length > maxLength) {
    return `${s.slice(0, maxLength)}...`;
  } else {
    return s;
  }
}

function getRandomInt(s) {
  let hash = 0;
  if (s.length !== 0) {
    for (let i = 0; i < s.length; i++) {
      let char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
  }

  return hash;
}

export function getAvatarColor(s) {
  const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
  let random = getRandomInt(s);
  if (random < 0) {
    random = -random;
  }
  return colorList[random % 4];
}

export function getLanguageText(text) {
  if (!text.includes("|")) {
    return text;
  }

  let res;
  const tokens = text.split("|");
  if (getLanguage() !== "zh") {
    res = trim(tokens[0], "");
  } else {
    res = trim(tokens[1], "");
  }
  return res;
}

export function getLanguage() {
  return i18next.language;
}

export function setLanguage(language) {
  localStorage.setItem("language", language);
  changeMomentLanguage(language);
  i18next.changeLanguage(language);
}

export function changeLanguage(language) {
  localStorage.setItem("language", language);
  changeMomentLanguage(language);
  i18next.changeLanguage(language);
  window.location.reload(true);
}

export function changeMomentLanguage(lng) {
  return;
  // if (lng === "zh") {
  //   moment.locale("zh", {
  //     relativeTime: {
  //       future: "%s内",
  //       past: "%s前",
  //       s: "几秒",
  //       ss: "%d秒",
  //       m: "1分钟",
  //       mm: "%d分钟",
  //       h: "1小时",
  //       hh: "%d小时",
  //       d: "1天",
  //       dd: "%d天",
  //       M: "1个月",
  //       MM: "%d个月",
  //       y: "1年",
  //       yy: "%d年",
  //     },
  //   });
  // }
}

export function getFilenameFromUrl(url) {
  const filename = url.substring(url.lastIndexOf('/') + 1);
  return filename;
}

function getCurrencySymbol(product) {
  if (product?.currency === "USD") {
    return "$";
  } else if (product?.currency === "CNY") {
    return "￥";
  } else {
    return "(Unknown currency)";
  }
}

function getCurrencyText(product) {
  if (product?.currency === "USD") {
    return i18next.t("payment:USD");
  } else if (product?.currency === "CNY") {
    return i18next.t("payment:CNY");
  } else {
    return "(Unknown currency)";
  }
}

export function getPrice(product) {
  return `${getCurrencySymbol(product)}${product?.price} (${getCurrencyText(product)})`;
}

export function getState(payment) {
  if (payment?.state === "Paid") {
    return i18next.t("payment:Paid");
  } else if (payment?.state === "Created") {
    return i18next.t("payment:Created");
  } else {
    return "(Unknown state)";
  }
}

export function getAlert(type, text) {
  return (
    <Alert
      message={text}
      type={type}
      showIcon
    />
  )
}

export function getTag(text, color="processing") {
  return (
    <Tag color={color}>
      {text}
    </Tag>
  )
}

function getTagColor(s) {
  return "default";
}

export function getTags(tags) {
  let res = [];
  if (!tags) return res;
  tags.forEach((tag, i) => {
    res.push(
      <Tag color={getTagColor(tag)}>
        {tag}
      </Tag>
    );
  });
  return res;
}
