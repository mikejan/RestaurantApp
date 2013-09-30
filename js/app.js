function navigateTo(x) {
    window.location = x + ".html";
}

function $new(tag) {
    return $(document.createElement(tag));
}

function InitBodySize() {
    //var newHeight = $(window).height() + 32;
    $('#app').css('height', window.innerHeight);
    $('#app').css('width', window.innerWidth);
}

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

function RequestData(_url, successCallBack, errorCallBack, method) {
    $.ajax({
        type: method ? method : "GET",
        url: _url,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        dataType: 'jsonp',
        headers: { Accept: "application/json", "Access-Control-Allow-Origin": "*" },
        success: function (json) {
            successCallBack(json);
        },
        error: function (json) {
            errorCallBack(json);
        },
    });
}

function CreateMenu(json) {
    var temp = window.localStorage.getObject('MENU');
    for (var I in json) {
        if(!isDuplicate(json[I], temp)) temp.push(json[I]);
    }
    window.localStorage.setObject('MENU', temp);

    var menuItem;
    for (I = 0; I < temp.length; I++) {
        menuItem = $new('div').addClass('menu-item').attr('id', 'menu-' + temp[I].Id).attr('uid', I);
        menuItem.append($new('div').addClass('menu-item-image').attr('uid', I));
        menuItem.append($new('div').addClass('menu-item-title').append($new('div').text(temp[I].Name).attr('uid', I)).attr('uid', I));

        if (I % 2 == 0) {
            $(menuItem).addClass('left');
        } else {
            $(menuItem).addClass('right');
        }

        menuItem.click(function (e) {
            var menu = window.localStorage.getObject('MENU');
            var uid = parseInt($(e.target).attr('uid'));
            window.localStorage.setObject('selectedItem', menu[uid]);
            navigateTo('submenu');
        });

        $('#content').append(menuItem);
    }

    var menuItemImage;
    for (I = 0; I < temp.length; I++) {
        menuItemImage = $('#menu-' + temp[I].Id + ' .menu-item-image');
        menuItemImage.css({ 'background-image': 'url(' + temp[I].ImageUrl + ')' });
    }
}

function CreateItems(json) {
    var temp = window.localStorage.getObject('ITEMS');
    for (var I in json) {
        if (!isDuplicate(json[I], temp)) temp.push(json[I]);
    }
    window.localStorage.setObject('ITEMS', temp);

    var selectedMenu = window.localStorage.getObject('selectedItem');
    var menuItem;
    for (I = 0; I < temp.length; I++) {
        if (temp[I].MenuId != selectedMenu.Id) continue;
        menuItem = $new('div').addClass('menu-item').attr('id', 'menu-' + temp[I].Id);
        menuItem.append($new('div').addClass('menu-item-image'));
        menuItem.append($new('div').addClass('menu-item-title').append($new('div').text(temp[I].Name)));

        if (I % 2 == 0) {
            $(menuItem).addClass('left');
        } else {
            $(menuItem).addClass('right');
        }

        $('#content').append(menuItem);
    }

    var menuItemImage;
    for (I = 0; I < temp.length; I++) {
        if (temp[I].MenuId != selectedMenu.Id) continue;
        menuItemImage = $('#menu-' + temp[I].Id + ' .menu-item-image');
        menuItemImage.css({ 'background-image': 'url(' + temp[I].ImageUrl + ')' });
    }
}

function ErrorConnection(json) {
    $('#content').text('Check internet connection...');
}

function isDuplicate(item, array) {
    var result = $.grep(array, function (e) {
        if (item.MenuId) return (e.Id == item.Id && e.Name == item.Name && e.MenuId == item.MenuId);
        return (e.Id == item.Id && e.Name == item.Name);
    });
    return (result.length != 0);
}