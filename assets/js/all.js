"use strict";

AOS.init({
  once: true,
  offset: 50
});
AOS.refresh();
var url = "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
var cardList = document.querySelector(".card-list");
var select = document.querySelector(".select-group");
var tabsList = document.querySelector(".tabs-list");
var subtitle = document.querySelector(".subtitle");
var pageList = document.querySelector(".pagination-list");
var data = [];
var page = {}; //axios get data

function getData() {
  axios.get(url).then(function (response) {
    data = response.data.result.records;
    renderData(data);
  });
}

getData(); //渲染select filter

function renderData(showData) {
  //渲染有存在的行政區到選單欄位
  //方法一
  //let selectGroup = data.map(item => item.Zone);
  //let newSelect = [new Set(selectGroup)];
  //方法二
  var selectGroup = showData.map(function (item) {
    return item.Zone;
  });
  var newSelect = selectGroup.filter(function (item, index) {
    return selectGroup.indexOf(item) == index;
  });
  var selectStr = "<option value=\"\u9AD8\u96C4\u5168\u5340\" selected>-- \u9AD8\u96C4\u5168\u5340 --</option>";
  newSelect.forEach(function (item) {
    var list = "<option value=\"".concat(item, "\">").concat(item, "</option>");
    selectStr += list;
  });
  select.innerHTML = selectStr;
  subtitle.textContent = "高雄全區";
  pagination(showData, 1);
} //渲染所有清單資料到畫面上


function updateData(showData) {
  var str = '';
  showData.forEach(function (item) {
    var content = "<li class=\"card\" data-aos=\"fade\" data-aos-duration=\"900\">\n        <div class=\"card-header\" style=\"background-image:url(".concat(item.Picture1, "\"  title=\"").concat(item.Picdescribe1, "\" data-aos=\"fade\" data-aos-duration=\"800\">\n          <div class=\"card-title\">\n          <h4>").concat(item.Name, "</h4>\n          <p>").concat(item.Zone, "</p>\n            </div>\n        </div>\n        <ul class=\"card-body\">\n          <li>\n           <i class=\"fas fa-clock\"></i>\n            <p>").concat(item.Opentime, "</p>\n          </li>\n          <li>\n            <i class=\"fas fa-map-marker-alt\"></i>\n            <p>").concat(item.Add, "</p>\n          </li>\n          <li class=\"card-footer\">\n            <div>\n            <i class=\"fas fa-mobile-alt\"></i>\n            <p>").concat(item.Tel, "</p>\n              </div>\n            <div class=\"card-footer-item\" data-display=").concat(item.Ticketinfo == "免費參觀" ? "" : "d-none", ">\n              <i class=\"fas fa-tag\"></i>\n              <p>").concat(item.Ticketinfo, "</p>\n            </div>\n          </li>\n        </ul>\n    </li>");
    str += content;
  });
  cardList.innerHTML = str;
} //監聽select change event


select.addEventListener("change", switchDataSelect, false);

function switchDataSelect(e) {
  if (e.target.value == "") {
    return;
  }

  ;
  var chosenDistrict = e.target.value;
  dataFilter(chosenDistrict); // 切換分頁

  if (e.target.dataset.type === 'tab' || e.target.dataset.type === "num") {
    var _page = e.target.dataset.page;
    dataFilter(chosenDistrict);
    pagination(dataFilter(chosenDistrict), _page);
  }

  return false;
} //監聽tabs click 事件


tabsList.addEventListener('click', switchDataTabs, false);

function switchDataTabs(e) {
  e.preventDefault();

  if (e.target.nodeName !== "A") {
    return;
  }

  ;
  var chosenTab = e.target.dataset.district;
  dataFilter(chosenTab); // 切換分頁

  if (e.target.dataset.type === 'page' || e.target.dataset.type === "num") {
    var _page2 = e.target.dataset.page;
    var title = subtitle.textContent;
    dataFilter(title);
    pagination(dataFilter(title), _page2);
  }

  return false;
} // 輸入showData 資料，用來計算 page 數量資料 


function pagination(data, nowPage) {
  var dataTotal = data.length;
  var showPerPage = 6; // 可能會有餘數-> 無條件進位

  var pageTotal = Math.ceil(dataTotal / showPerPage);
  var currentPage = nowPage; // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"

  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  } //最小值公式  -> 當前可顯示的最少資料量


  var minData = currentPage * showPerPage - showPerPage + 1; //最大值公式

  var maxData = currentPage * showPerPage;
  var currentPageData = []; // 處理資料

  data.forEach(function (item, index) {
    // 獲取陣列索引，但因為索引是從 0 開始所以要 +1。
    var num = index + 1;

    if (num >= minData && num <= maxData) {
      currentPageData.push(item); //用來篩選的陣列
    }

    ;
  }); //物件中的資料都是字串

  page = {
    dataTotal: dataTotal,
    pageTotal: pageTotal,
    currentPage: currentPage,
    hasPage: currentPage > 1,
    //boolean
    hasNext: currentPage < dataTotal
  };
  updateData(currentPageData);
  pageBtn(page, nowPage);
} //新增頁數功能 渲染在畫面中 ->放到renderData


function pageBtn(page, current) {
  //console.log(page);
  var str = '';
  var pageLen = page.pageTotal; //總共頁數

  var now = parseInt(page.currentPage);

  if (current > 1) {
    str += "<li class=\"page-item\">\n      <a href=\"#\" class=\"page-link active\" data-type=\"page\" data-page=\"".concat(now - 1, "\">\n        <i class=\"fas fa-angle-left\"></i> prev</a> \n      </li>");
  } else {
    str += "<li class=\"page-item\">\n                 <a href=\"#\" class=\"page-link\" data-type=\"page\" data-page=\"".concat(now, "\"><i class=\"fas fa-angle-left\">\n                  </i> prev</a> \n              </li>");
  }

  ;

  for (var i = 1; i <= pageLen; i++) {
    if (parseInt(page.currentPage) === i) {
      str += "<li class=\"page-item\">\n                 <a href=\"#\" class=\"page-link active\" data-type=\"num\" data-page=\"".concat(i, "\">").concat(i, "</a>\n                </li>");
    } else {
      str += "<li class=\"page-item\">\n      <a href=\"#\" class=\"page-link\" data-type=\"num\" data-page=\"".concat(i, "\">").concat(i, "</a>\n      </li>");
    }

    ;
  }

  ;

  if (current < pageLen) {
    str += "<li class=\"page-item\">\n                <a href=\"#\" class=\"page-link active\" data-type=\"page\" data-page=\"".concat(now + 1, "\">next <i class=\"fas fa-angle-right\">    </i></a> \n              </li>");
  } else {
    str += "<li class=\"page-item\">\n                <a href=\"#\" class=\"page-link\" data-type=\"page\" data-page=\"".concat(now, "\">next <i class=\"fas fa-angle-right\">    </i></a>\n      </li>");
  }

  ;
  pageList.innerHTML = str;
} //user 點擊換頁功能 監聽 pageList click event


pageList.addEventListener('click', switchPage, false); //這一段無效 只能用全區data//

function switchPage(e) {
  e.preventDefault();

  if (e.target.nodeName !== "A") {
    return;
  }

  ;
  var pageClicked = parseInt(e.target.dataset.page);
  pagination(data, pageClicked);
} // 用這行取代 switch Page 防止換頁監聽資訊遺漏


function dataFilter(chosenDistrict) {
  var filterData = [];
  data.filter(function (item) {
    if (chosenDistrict === item.Zone) {
      filterData.push(item);
    } else if (chosenDistrict === '高雄全區') {
      filterData = data;
    }

    return filterData;
  });
  select.value = chosenDistrict;
  subtitle.textContent = chosenDistrict;
  pagination(filterData, 1);
  return filterData;
}
//# sourceMappingURL=all.js.map
