if ("undefined" == typeof ColorZilla || !ColorZilla) var ColorZilla = {};
var cz = ColorZilla;
cz.Popup = {
  "init": function () {
    var a = chrome.extension.getBackgroundPage();
    cz.Popup.bg = a.ColorZilla.Background, cz.gbCZLowerCaseHexa = cz.Popup.bg.options.lowercaseHexa, cz.Popup._sampledColor = cz.Popup.bg.currentColor, cz.Popup._currentColor = cz.Popup._sampledColor, cz.Popup._currentColor && (cz.Popup.setActiveColorAndData(cz.Popup._currentColor), cz.Popup.updateCopyToClipboardMenu()), cz.Popup.colorAnalyzerUI = cz.ColorAnalyzerUI;
    var b = {
      "container": $("#webpage-color-analyzer-panel"),
      "setColorCallback": cz.Popup.setSampledColor,
      "highlightElementsByColorCallback": cz.Popup.bg.highlightElementsByColor,
      "analyzePageColorsCallback": cz.Popup.bg.analyzePageColors,
      "closeCallback": cz.Popup.onMainPanelClose
    };
    cz.Popup.colorAnalyzerUI.init(b), cz.Popup.bg.clearMonitoringHighlights(), cz.Popup.bg.options.autostartEyedropper ? setTimeout(function () {
      cz.Popup.startMonitoring()
    }, 20) : cz.Popup.stopMonitoring(), cz.Popup.handleBlockedInjection(function () {
      cz.Popup.attachEventHandlers(), window.debugTrace = cz.Popup.bg.debugTrace
    })
  }, "translateUI": function () {
    var a = cz.ChromeUtils.i18nReplace;
    a("#eyedropper-menuitem .menu-item-text", "pick_color_from_page"), a("#color-picker-menuitem .menu-item-text", "color_picker"), a("#show-copy-to-clipboard-menuitem .menu-item-text", "copy_to_clipboard_menu_label"), a("#resample-last-location-menuitem .menu-item-text", "resample_last_location"), a("#show-history-menuitem .menu-item-text", "picked_color_history"), a("#page-color-analyzer-menuitem .menu-item-text", "webpage_color_analyzer"), a("#palette-browser-menuitem .menu-item-text", "palette_browser"), a("#gradient-generator-menuitem .menu-item-text", "css_gradient_generator"), a("#help-menuitem .menu-item-text", "help"), a("#options-menuitem .menu-item-text", "options"), a("#online-help-menuitem .menu-item-text", "online_help"), a("#whats-new-menuitem .menu-item-text", "whats_new"), a("#colorzilla-homepage-menuitem .menu-item-text", "colorzilla_homepage"), a("#about-colorzilla-menuitem .menu-item-text", "about_colorzilla"), a("#webpage-color-analyzer-panel h1", "css_color_analysis_results"), a(".ok-button", "ok"), a(".cancel-button", "cancel")
  }, "attachEventHandlers": function () {
    addEventListener("unload", function (a) {
      cz.Popup.bg.onPopupClose()
    }, !0), document.addEventListener("click", function (a) {
      cz.Popup.handleClick(a), 0 == $(event.target).closest("#eyedropper-menuitem").length && cz.Popup.stopMonitoring()
    }, !0), cz.Popup.mouseIsOverPopup = !1, $(document).bind("mouseenter mousemove", function () {
      cz.Popup.mouseIsOverPopup || (cz.Popup.mouseIsOverPopup = !0, cz.Popup._sampledColor && cz.Popup.bg.updateColor({"color": cz.Popup._sampledColor}), cz.Popup.bg.clearMonitoringHighlights())
    }), $(document).mouseleave(function () {
      cz.Popup.mouseIsOverPopup = !1
    })
  }, "handleClick": function (a) {
    var b = $(a.target).closest(".menu-item");
    if (0 != b.length && !b.hasClass("disabled")) {
      var c = b.attr("id");
      if (c) {
        if (c.match(/^copy-(.*)-menuitem/)) {
          var d = RegExp.$1;
          return cz.Popup.bg.copyColorToClipboard(cz.Popup._currentColor, d), void window.close()
        }
        switch (c) {
          case"color-picker-menuitem":
            cz.Popup.showColorPicker();
            break;
          case"eyedropper-menuitem":
            setTimeout(function () {
              cz.Popup.startMonitoring(), window.close()
            }, 100);
            break;
          case"gradient-generator-menuitem":
            cz.ChromeUtils.openURLInNewTab("http://www.colorzilla.com/gradient-editor/"), window.close();
            break;
          case"page-color-analyzer-menuitem":
            $("#main-menu").hide(), cz.ColorAnalyzerUI.showPageAnalyzerPanelAndAnalyze();
            break;
          case"options-menuitem":
            cz.ChromeUtils.openURLInNewTab("/html/options.html"), window.close();
            break;
          case"help-menuitem":
            $("#main-menu").hide(), $("#help-menu").show();
            break;
          case"online-help-menuitem":
            cz.ChromeUtils.openURLInNewTab("http://www.colorzilla.com/chrome/help.html"), window.close();
            break;
          case"whats-new-menuitem":
            cz.ChromeUtils.openURLInNewTab("http://www.colorzilla.com/chrome/versions.html"), window.close();
            break;
          case"colorzilla-homepage-menuitem":
            cz.ChromeUtils.openURLInNewTab("http://www.colorzilla.com/chrome/"), window.close();
            break;
          case"about-colorzilla-menuitem":
            cz.ChromeUtils.openURLInNewTab("/html/about.html"), window.close();
            break;
          case"show-copy-to-clipboard-menuitem":
            $("#main-menu").hide(), $("#copy-to-clipboard-menu").show();
            break;
          case"resample-last-location-menuitem":
            cz.Popup.bg.resampleLastLocation();
            break;
          case"show-history-menuitem":
            cz.Popup.showColorPicker();
            break;
          case"palette-browser-menuitem":
            var e = {
              "container": $("#palette-browser-panel"),
              "setColorCallback": cz.Popup.setSampledColor,
              "closeCallback": cz.Popup.onMainPanelClose
            };
            $("#main-menu").hide(), cz.PaletteBrowser.show(e);
            break;
          case"error-message-menuitem":
            chrome.tabs.create({"url": "chrome://extensions/?id=" + chrome.runtime.id})
        }
      }
    }
  }, "close": function () {
    window.close()
  }, "startMonitoring": function () {
    cz.Popup.dropperDisabled || (cz.Popup.bg.startMonitoring(), $("#eyedropper-menuitem .menu-item-text").text(chrome.i18n.getMessage("page_color_picker_active")), $("#eyedropper-menuitem").addClass("active"))
  }, "stopMonitoring": function () {
    cz.Popup.bg.stopMonitoring(), $("#eyedropper-menuitem .menu-item-text").text(chrome.i18n.getMessage("pick_color_from_page")), $("#eyedropper-menuitem").removeClass("active")
  }, "showColorPicker": function () {
    var a = {
      "container": $("#colorpicker"),
      "initialColor": cz.Popup._currentColor,
      "setColorCallback": cz.Popup.setSampledColor,
      "closeCallback": cz.Popup.onMainPanelClose,
      "history": cz.Popup.bg.history,
      "lowercaseHexa": cz.Popup.bg.options.lowercaseHexa
    };
    $("#main-menu").hide(), cz.ColorPickerUI.show(a)
  }, "onMainPanelClose": function () {
    $("#main-menu").show()
  }, "setSampledColor": function (a) {
    cz.Popup.bg.updateColor({"color": a, "op": "color-sampled"})
  }, "setActiveColorAndData": function (a, b) {
    if (!b || !b.op || "sampling-color" != b.op) {
      cz.Popup._currentColor = a;
      var c = cz.czRGBHexaAttributeToCol(a),
        d = cz.czColToRGBAttribute(c) + "   |   " + a + "   |   " + cz.czColToHSLAttribute(c),
        e = $("#color-picker-menuitem .current-color");
      e.css("background-color", a).show(), e.attr("title", d), b && b.op && "color-sampled" == b.op && (cz.Popup._sampledColor = a), cz.Popup.updateCopyToClipboardMenu()
    }
  }, "updateCopyToClipboardMenu": function () {
    function a(a) {
      return chrome.i18n.getMessage("copy_with_param", a)
    }

    var b = cz.czRGBHexaAttributeToCol(cz.Popup._currentColor);
    $("#copy-rgb-menuitem .menu-item-text").html(a(cz.czColToRGBAttribute(b))).parent().show(), $("#copy-rgb-perc-menuitem .menu-item-text").html(a(cz.czColToRGBPercentageAttribute(b))).parent().show(), $("#copy-hsl-menuitem .menu-item-text").html(a(cz.czColToHSLAttribute(b))).parent().show(), $("#copy-hex-menuitem .menu-item-text").html(a(cz.czColToRGBHexaAttribute(b))).parent().show(), $("#copy-hex-no-hash-menuitem .menu-item-text").html(a(cz.czColToRGBHexaAttribute(b).substring(1))).parent().show(), $(".current-color-ops-separator").show(), $("#show-copy-to-clipboard-menuitem").show(), $("#resample-last-location-menuitem").show()
  }, "handleBlockedInjection": function (a, b) {
    cz.Popup.dropperDisabled = !1, chrome.tabs.getSelected(null, function (c) {
      var d = null, e = "disabled";
      if (0 == c.url.indexOf("chrome")) d = chrome.i18n.getMessage("chrome_doesn_allow_picking_special_page"); else if (0 == c.url.indexOf("https://chrome.google.com/extensions") || 0 == c.url.indexOf("https://chrome.google.com/webstore")) d = chrome.i18n.getMessage("chrome_doesn_allow_picking_webstore"); else if (0 == c.url.indexOf("file")) {
        if ("undefined" == typeof b) return void chrome.extension.isAllowedFileSchemeAccess(function (b) {
          cz.Popup.handleBlockedInjection(a, b)
        });
        b || (d = chrome.i18n.getMessage("allow_access_to_file_urls"), e = "")
      }
      d && (cz.Popup.dropperDisabled = !0, cz.Popup.stopMonitoring(), $("#main-menu").prepend('<div class="menu-item ' + e + '" id="error-message-menuitem"><span class="menu-item-text">' + d + "</span></div>"), $("#resample-last-location-menuitem").addClass("disabled"), $("#eyedropper-menuitem").addClass("disabled"), $("#page-color-analyzer-menuitem").addClass("disabled"))
    }), a()
  }
}, cz.ColorPickerUI = {
  "show": function (a) {
    function b(a) {
      var b = cz.czRGBHexaAttributeToCol(a);
      l.val(cz.czColToRGBAttribute(b)), m.val(cz.czColToHSLAttribute(b))
    }

    function c(a) {
      var b = $('.jPicker input[type="radio"]:checked').val();
      b && (localStorage["last-color-picker-color-mode"] = b);
      var c = "#" + a.val("hex");
      i || (c = c.toUpperCase()), h(c), j.hide()
    }

    function d(a) {
      var c = "#" + a.val("hex");
      b(c)
    }

    function e(a) {
      j.hide()
    }

    this._options = a;
    var f = a.initialColor, g = a.container, h = a.setColorCallback, i = a.lowercaseHexa, j = this;
    j._container = g, j._widget = g.find(".colorpicker-widget"), f || (f = "#ff0000");
    var k = new $.jPicker.Color({"hex": f}), l = g.find(".rgb-color"), m = g.find(".hsl-color");
    b(f), g.show();
    for (var n = this._options.history.get(), o = [], p = 0; p < n.length; p++) o.push(new $.jPicker.Color({"hex": n[p]}));
    var q = 65 - n.length;
    for (p = 0; q > p; p++) o.push(new $.jPicker.Color({"hex": "#efefef"}));
    var r = "last-color-picker-color-mode" in localStorage ? localStorage["last-color-picker-color-mode"] : "h", s = {
      "window": {"title": "&nbsp;"},
      "color": {"active": k, "quickList": o, "mode": r},
      "images": {"clientPath": "/lib/jPicker/images/"},
      "localization": {
        "text": {
          "ok": chrome.i18n.getMessage("ok"),
          "cancel": chrome.i18n.getMessage("Cancel"),
          "newColor": chrome.i18n.getMessage("new_color_label"),
          "currentColor": chrome.i18n.getMessage("current_color_label")
        }
      }
    };
    j._widget.jPicker(s, c, d, e), setTimeout(function () {
      j.adjustColorPickerUI()
    }, 1)
  }, "hide": function () {
    this._container.hide(), this._options.closeCallback()
  }, "adjustColorPickerUI": function () {
    var a = this;
    $(".jPicker input.Hex").attr("maxlength", "7");
    var b = a._widget.find(".Grid .QuickColor");
    b.slice(-7).remove();
    var c = $('<span class="QuickColor" title="' + chrome.i18n.getMessage("clear_history") + '" style="background-color:#efefef;background-image: url(/lib/jPicker/images/NoColor.png)">&nbsp</span>'),
      d = a._widget.find(".Grid");
    c.appendTo(d), c.click(function () {
      var b;
      if (b = cz.ChromeUtils.platformIs("mac") ? !0 : confirm(chrome.i18n.getMessage("clear_history_question"))) {
        a._widget.find(".QuickColor").slice(0, -1).remove();
        for (var c = [], d = 0; 65 > d; d++) c.push('<span class="QuickColor" title="" style="background-color:#efefef;cursor:default">&nbsp;</span>');
        var e = a._widget.find(".Grid .QuickColor");
        $(c.join("")).insertBefore(e), a._options.history.clear()
      }
    });
    var e = a._widget.find("hr");
    $('<div class="history-header">' + chrome.i18n.getMessage("color_history_label") + "</div>").insertAfter(e)
  }
}, cz.ColorAnalyzerUI = {
  "_isInited": !1, "_myPanel": null, "_colors": null, "init": function (a) {
    if (!this._isInited) {
      var b = this;
      this._options = a, this._myPanel = a.container, this._myPanel.find(".ok-button").click(function () {
        b.activeColor && b._options.setColorCallback(b.activeColor), b._options.highlightElementsByColorCallback(null), b.hidePageAnalyzerPanel(), b._options.closeCallback()
      }), this._myPanel.find(".cancel-button").click(function () {
        b._options.highlightElementsByColorCallback(null), b.hidePageAnalyzerPanel(), b._options.closeCallback()
      });
      var c = this._myPanel.find(".selected-color-info");
      b.rgbColorElem = c.find(".rgb-color"), b.hexColorElem = c.find(".hex-color"), b.elemInfoElem = c.find(".elem-info"), b.colorsContainer = this._myPanel.find(".colors-container"), b.colorsContainer.click(function (a) {
        b.setActiveColor(a.target, !0)
      }), this._isInited = !0
    }
  }, "setActiveColor": function (a, b) {
    var c = this;
    c._myPanel.removeClass("initial-state");
    var d = a;
    if ($(d).hasClass("color-panel")) {
      b && ("undefined" != typeof c.activeColorElem && c.activeColorElem.removeClass("active"), $(d).addClass("active"), c.activeColorElem = $(d));
      var e = $(d).attr("cz-color"), f = cz.czRGBAttributeToCol(e), g = cz.czColToRGBAttribute(f),
        h = cz.czColToRGBHexaAttribute(f);
      b && (c.activeColor = h), c.rgbColorElem.val(g), c.hexColorElem.val(h);
      for (var i = [], j = 0; j < c._colors[e].computed.length && 15 > j; j++) {
        var k = c._colors[e].computed[j];
        i.push('<span class="color-selector">' + k.elemLongName + "</span>")
      }
      c.elemInfoElem.html(i.join(" ")), c._options.highlightElementsByColorCallback(null), c._options.highlightElementsByColorCallback(f)
    }
  }, "showPageAnalyzerPanelAndAnalyze": function () {
    this._myPanel.show(), this._myPanel.addClass("initial-state"), this.colorsContainer.html('<span class="please-wait">' + chrome.i18n.getMessage("analyzing_please_wait") + "</span>"), this._options.analyzePageColorsCallback()
  }, "hidePageAnalyzerPanel": function () {
    this._myPanel.hide()
  }, "populatePageAnalyzerColors": function (a) {
    this._colors = a;
    var b = [];
    for (e in a) b.push(e);
    b.sort(this.sortByHue);
    var c = this.colorsContainer;
    c.html("");
    for (var d = 0; d < b.length; d++) {
      var e = b[d], f = e;
      $('<div class="color-panel" cz-color="' + e + '" style="background:' + e + '" title="' + f + '">&nbsp;</div>"').appendTo(c)
    }
  }, "sortByHue": function (a, b) {
    b = cz.czRGBAttributeToCol(b), a = cz.czRGBAttributeToCol(a);
    var c = cz.czGetRValue(b), d = cz.czGetGValue(b), e = cz.czGetBValue(b), f = cz.czGetRValue(a),
      g = cz.czGetGValue(a), h = cz.czGetBValue(a), i = cz.czRGBToHSV(c, d, e), j = cz.czRGBToHSV(f, g, h),
      k = c == d && d == e || i.s < 3, l = f == g && g == h || j.s < 3;
    return k && l ? j.v - i.v : i.h == j.h || k || l ? i.s != j.s ? i.s - j.s : i.v - j.v : i.h - j.h
  }
}, cz.PaletteBrowser = {
  "_inited": !1, "init": function (a, b) {
    if (this._inited) return void b();
    var c = this, d = new XMLHttpRequest;
    d.open("get", "/js/palette-db.json", !0), d.onreadystatechange = function (e) {
      4 == d.readyState && (ColorZilla.PaletteDB = JSON.parse(d.responseText).palettes, c.initDelayed(a), b())
    }, d.send({}), this._inited = !0
  }, "initDelayed": function (a) {
    this._options = a;
    var b = a.container;
    this._container = b;
    var c = b.find(".palette-chooser");
    this.populatePaletteChooser(c);
    var d = this;
    c.change(function () {
      var a = c.val();
      d.showPalette(a), localStorage["last-displayed-palette"] = a
    });
    var e = this._container.find(".palette-colors");
    e.click(function (a) {
      var b = $(a.target);
      if (b.hasClass("color-panel")) {
        d._currentColorPanel && d._currentColorPanel.removeClass("active"), b.addClass("active");
        var c = b.attr("cz-color"), e = b.attr("cz-color-name");
        d.setCurrentColor(c, e), d._currentColorPanel = b
      }
    }), this._container.find(".ok-button").click(function () {
      d._currentColor && d._options.setColorCallback(d._currentColor), d.hide(), d._options.closeCallback()
    }), this._container.find(".cancel-button").click(function () {
      d.hide(), d._options.closeCallback()
    })
  }, "setCurrentColor": function (a, b) {
    if (this._currentColor = a, a) {
      var c = cz.czRGBHexaAttributeToCol(a);
      this._container.find(".current-color").css("background-color", a);
      var d = cz.czGetRValue(c), e = cz.czGetGValue(c), f = cz.czGetBValue(c);
      this._container.find(".color-r").val(d), this._container.find(".color-g").val(e), this._container.find(".color-b").val(f), this._container.find(".color-hex").val(cz.czColToRGBHexaAttribute(c)), "undefined" != typeof b && b || (b = ""), this._container.find(".color-name").val(b)
    } else this._container.find(".current-color").css("background-color", "#fff"), this._container.find(".color-r").val(""), this._container.find(".color-g").val(""), this._container.find(".color-b").val(""), this._container.find(".color-hex").val(""), this._container.find(".color-name").val("")
  }, "populatePaletteChooser": function (a) {
    me = this, cz.PaletteDB.forEach(function (b) {
      var c = me.calcPaletteKey(b.name), d = chrome.i18n.getMessage("palette_name_" + c);
      $('<option value="' + c + '">' + d + "</option>").appendTo(a)
    })
  }, "calcPaletteKey": function (a) {
    var b = a.toLowerCase();
    return b = b.replace(/[ \t]/g, "")
  }, "show": function (a) {
    var b = this;
    this.init(a, function () {
      b._currentColorPanel = null, b.setCurrentColor(null);
      var a = b._container.find(".palette-chooser"),
        c = "last-displayed-palette" in localStorage ? localStorage["last-displayed-palette"] : a.val();
      b.showPalette(c), a.val(c), b._container.show()
    })
  }, "hide": function () {
    this._container.hide()
  }, "showPalette": function (a) {
    for (var b = null, c = 0; c < cz.PaletteDB.length; c++) {
      var d = cz.PaletteDB[c], e = me.calcPaletteKey(d.name);
      if (a == e) {
        b = d;
        break
      }
    }
    if (b) {
      var f = this._container.find(".palette-colors");
      f.empty(), setTimeout(function () {
        var a = 260, c = 260, d = 15, e = Math.floor(b.colors.length / b.nColumns);
        e * d > c + 25 && (a -= 18);
        for (var g = Math.floor(a / b.nColumns), h = 0; h < b.colors.length; h++) {
          var i = b.colors[h].value, j = b.colors[h].name ? b.colors[h].name : "", k = i;
          j && (k += " - " + j), $('<div class="color-panel" cz-color="' + i + '" cz-color-name="' + j + '" title="' + k + '" style="width:' + g + "px;height:" + d + "px;background:" + i + ';"></div>').appendTo(f)
        }
      }, 10)
    }
  }
}, window.addEventListener("load", function () {
  ColorZilla.Popup.init()
}, !1), document.addEventListener("DOMContentLoaded", function () {
  ColorZilla.Popup.translateUI()
}, !1);
