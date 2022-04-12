MAC.Star.Init = function () {
  var $that = $('.mac_star');
  if ($that.length == 0) {
    return;
  }
  MAC.Ajax(maccms.path + '/index.php/ajax/score?mid=' + $that.attr('data-mid') + '&id=' + $that.attr('data-id'), 'get', 'json', '', function (e) {
    $that.attr({
      'score': e.data.score,
      'data-star': Math.ceil(e.data.score / 2)
    });
    $(".raty-score-num").text(e.data.score);
    $(".raty-score-bar").animate({
      'width': e.data.score * 10 + '%'
    }, 300);
    if (e.data.score_num > 0) {
      $("#rating-kong").hide();
      $("#rating-main").show();
    } else {
      $("#rating-kong .loadingg").text('暂无人评分');
    }
    $that.raty({
      starType: 'li',
      number: 5,
      numberMax: 5,
      space: false,
      score: function () {
        $(".raty-score-num").text($that.attr('score'));
        $(".raty-score-bar").animate({
          'width': $that.attr('score') * 10 + '%'
        }, 300);
        return $that.attr('data-star');
      },
      hints: ['很差', '较差', '还行', '推荐', '力荐'],
      starOff: '',
      starOn: 'active',
      target: $("#ratewords"),
      targetKeep: e.data.score_num > 0 ? true : false,
      click: function (score, evt) {
        MAC.Ajax(maccms.path + '/index.php/ajax/score?mid=' + $that.attr('data-mid') + '&id=' + $that.attr('data-id') + '&score=' + (score * 2), 'get', 'json', '', function (r) {
          if (r.code == 1) {
            $that.attr({
              'score': r.data.score,
              'data-star': Math.ceil(r.data.score / 2)
            });
            $(".raty-score-num").text(r.data.score);
            $(".raty-score-bar").animate({
              'width': r.data.score * 10 + '%'
            }, 300);
            if (r.data.score_num > 0) {
              $("#rating-kong").hide();
              $("#rating-main").show();
            } else {
              $("#rating-kong .loadingg").text('暂无人评分');
            }
            $that.raty('set', {
              'score': Math.ceil(r.data.score / 2),
              'targetKeep': r.data.score_num > 0 ? true : false,
            });
            MAC.Pop.Msg(100, 20, '评分成功', 1000);
          } else {
            $that.raty('score', $that.attr('data-star'));
            MAC.Pop.Msg(100, 20, r.msg, 1000);
          }
        }, function () {
          $that.raty('score', $that.attr('data-star'));
          MAC.Pop.Msg(100, 20, '网络异常', 1000);
        });
      }
    });

  });
}

$(document).ready(function () {
  $(".lazyload").lazyload({
    effect: "fadeIn",
    threshold: 200,
    failurelimit: 15,
    skip_invisible: false
  });
  if ($("#qrcode").length) {
    var qrcode = new QRCode('qrcode', {
      text: location.href,
      width: 150,
      height: 150,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    $("#qrcode img").attr("class", "img-responsive");
  }

  if ($("#qrcode2").length) {
    var qrcode = new QRCode('qrcode2', {
      text: location.href,
      width: 160,
      height: 160,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    $("#qrcode2 img").attr("class", "img-responsive").css({
      "padding": "10px",
      "background-color": "#fff"
    });
  }

  $('a[data-toggle="tab"]').on("shown.bs.tab", function (a) {
    var b = $(a.target).text();
    $(a.relatedTarget).text();
    $("span.active-tab").html(b);
  });
  if ($("#header-top").length) {
    var header = document.querySelector("#header-top");
    var headroom = new Headroom(header, {
      tolerance: 5,
      offset: 205,
      classes: {
        initial: "top-fixed",
        pinned: "top-fixed-up",
        unpinned: "top-fixed-down"
      }
    });
    headroom.init();
  }
  if ($("#dianbo_history").length) {
    if ($.cookie("recente")) {
      var json = eval("(" + $.cookie("recente") + ")");
      var list = "";
      for (i = 0; i < json.length; i++) {
        list = list + "<li class='top-line'><a href='" + json[i].vod_url + "' title='" + json[i].vod_name + "'><span class='pull-right text-red'>" + json[i].vod_part + "</span>" + json[i].vod_name + "</a></li>";
      }
      $("#dianbo_history").append(list);
    } else
      $("#dianbo_history").append("<p style='padding: 80px 0; text-align: center'>您还没有看过影片哦</p>");

    $(".historyclean").on("click", function () {
      $.cookie("recente", null, {
        expires: -1,
        path: '/'
      });
      $("#dianbo_history").html("<p style='padding: 80px 0; text-align: center'>播放记录已清空</p>");
    });
  }

  500 < $(window).scrollTop() ? $("a.backtop").css("display", "") : $("a.backtop").css("display", "none");
  $(window).scroll(function () {
    500 < $(window).scrollTop() ? $("a.backtop").css("display", "") : $("a.backtop").css("display", "none");
  });
  $("a.backtop").on("click", function () {
    $("html, body").animate({
      scrollTop: 0
    }, 400);
    return !1
  });
  
  if ($(".copylink").length) {
    var clipboard = new Clipboard('.copylink', {
      text: function(){
        return location.href;
      }
    });
    clipboard.on('success', function (e) {
      MAC.Pop.Msg(100, 20, '地址复制成功', 1000);
    });
  }
  
  if ($(".nav-slide").length > 0) {
    var navSlide = new Swiper('.nav-slide', {
      freeMode: true,
      slidesPerView: 'auto',
      initialSlide: $(this).find(".active").index() - 1,
    });
  }
  
  if ($(".index-slide").length > 0) {
    var indexSlide = new Swiper('.index-slide', {
      loop: true, // 循环模式选项
      autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: false, //改为false,点击按钮可以继续动
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      lazy: {
        loadPrevNext: true,
        loadPrevNextAmount: 2,
      },
    });
  }
  
  if ($(".type-slide").length > 0) {
    var typeSlide = new Swiper(".type-slide", {
      freeMode: true,
      slidesPerView: 'auto',
      on: {
        init: function () {
          this.slideTo($(this.wrapperEl).find(".active").index() - 1);
        },
      }
    });
  }
  
  if ($(".playlist-slide").length > 0) {
    var playlistSlide = new Swiper(".playlist-slide", {
      freeMode: true,
      slidesPerView: 'auto',
      on: {
        init: function () {
          this.slideTo($(this.wrapperEl).find(".active").index() - 1);
        },
      }
    });
  }

  $(".share").html('<span class="bds_shere"></span><a class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a><a class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a><a class="bds_weixin" data-cmd="weixin" title="分享到微信"></a><a class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博"></a><a class="bds_sqq" data-cmd="sqq" title="分享到QQ好友"></a><a class="bds_bdhome" data-cmd="bdhome" title="分享到百度新首页"></a><a class="bds_tqf" data-cmd="tqf" title="分享到腾讯朋友"></a><a class="bds_youdao" data-cmd="youdao" title="分享到有道云笔记"></a><a class="bds_more" data-cmd="more" title="更多"></a>');
  window._bd_share_config = {
    "common": {
      "bdSnsKey": {},
      "bdText": "",
      "bdMini": "2",
      "bdMiniList": false,
      "bdPic": "",
      "bdStyle": "0",
      "bdSize": "24"
    },
    "share": {}
  };
  with(document) 0[(getElementsByTagName("head")[0] || body).appendChild(createElement('script')).src = '' + share_path + "static/api/js/share.js" + '?cdnversion=' + ~(-new Date() / 36e5)];
});
