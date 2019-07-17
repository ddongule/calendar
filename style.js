var month = [
	"1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
];

var weekday = [
	"일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"
];
var weekdayShort = [
	"sun", "mon", "tue", "wed", "thu", "fri", "sat"
];
var monthDirection = 0;

function getNextMonth() {
	monthDirection++;
	var current;
	var now = new Date();
	if (now.getMonth() == 11) {
        current = new Date(now.getFullYear() + monthDirection, 0, 1);
	} else {
		current = new Date(now.getFullYear(), now.getMonth() + monthDirection, 1);
	}
    initCalendar(getMonth(current));
    initCalendar.r
}

function getPrevMonth() {
	monthDirection--;
	var current;
	var now = new Date();
	if (now.getMonth() == 11) {
		current = new Date(now.getFullYear() + monthDirection, 0, 1);
	} else {
		current = new Date(now.getFullYear(), now.getMonth() + monthDirection, 1);
	}
	initCalendar(getMonth(current));
}

Date.prototype.isSameDateAs = function (pDate) {
	return (
		this.getFullYear() === pDate.getFullYear() &&
		this.getMonth() === pDate.getMonth() &&
		this.getDate() === pDate.getDate()
	);
};

function getMonth(currentDay) {
	var now = new Date();
	var currentMonth = month[currentDay.getMonth()];
	var monthArr = [];
	for (i = 1 - currentDay.getDate(); i < 31; i++) {
		var tomorrow = new Date(currentDay);
		tomorrow.setDate(currentDay.getDate() + i);
		if (currentMonth !== month[tomorrow.getMonth()]) {
			break;
		} else {
			monthArr.push({
				date: {
					weekday: weekday[tomorrow.getDay()],
					weekday_short: weekdayShort[tomorrow.getDay()],
					day: tomorrow.getDate(),
					month: month[tomorrow.getMonth()],
					year: tomorrow.getFullYear(),
					current_day: now.isSameDateAs(tomorrow) ? true : false,
					date_info: tomorrow
				}
			});
		};
    };


    return monthArr;
}

function clearCalendar() {
	$("table tbody tr").each(function () {
		$(this).find("td").removeClass("active selectable currentDay between hover").html("");
	});
	$("td").each(function () {
		$(this).unbind('mouseenter').unbind('mouseleave');
	});
	$("td").each(function () {
		$(this).unbind('click');
    });
    $("table tbody tr").each(function () {
		$(this).find("td").removeClass("active selectable currentDay between hover").html("");
	});
	clickCounter = 0;
}

function initCalendar(monthData) {
	var row = 0;
    var currentDay = "";
    
	clearCalendar();
	$.each(monthData,
		function (i, value) {
			var weekday = value.date.weekday_short;
			var day = value.date.day;
			var column = 0;

			$(".sideb .header .month").html(value.date.month);
			$(".sideb .header .year").html(value.date.year);
			if (value.date.current_day) {
				currentDay = "currentDay";
			}
			$("tr.weedays th").each(function () {
				var row = $(this);
				if (row.data("weekday") === weekday) {
					column = row.data("column");
					return;
				}
			});
            $($($($("tr.days").get(row)).find("td").get(column)).addClass(currentDay).html(day));
            $($($($("tr.agendas").get(row)).find("td").get(column)).addClass("selectable"));
            
			currentDay = "";
			if (column == 6) {
				row++;
            }
        });
}
initCalendar(getMonth(new Date()));

var clickCounter = 0;
$(".fa-angle-double-right").click(function () {
	$(".right-wrapper").toggleClass("is-active");
	$(this).toggleClass("is-active");
});




function getDateRange(startDate, endDate, listDate) {
    var dateMove = new Date(startDate);
    var strDate = startDate;
    if (startDate == endDate){
        var strDate = dateMove.toISOString().slice(0,10);
        listDate.push(strDate);
    } else {
        while (strDate < endDate) {
            var strDate = dateMove.toISOString().slice(0, 10);
            listDate.push(strDate);
            dateMove.setDate(dateMove.getDate() + 1);
        }
    }
    return listDate;
};



function insert(){
    var peachday = document.getElementsByClassName("eachday");
    var jsonLocation = 'https://api.myjson.com/bins/pdq8b';
    $.getJSON(jsonLocation, function(data) {
        var listDate = [];
        var newListDate = [];
        listDate.forEach(function(item) {
            var dateItem = new Date(item);
            newListDate.push(dateItem);
        });


        var jsdates = [];
        $.each(data,function(I, item){
            var jsdate = new Date(item.date);
            var jsevent = item.event;
            jsdates.push({jsdate, jsevent});
        })

        $(function(){
            $.each(jsdates, function(i, val) {
                $.each(peachday, function(i, v) {
                    var pdays = document.getElementsByClassName('days');
                    var pmonth = document.getElementsByClassName("month");
                    var pmonthname = pmonth[0].innerText;
                    
                    if (pmonthname == val.jsdate.getMonth()+1+"월" && v.innerText == val.jsdate.getDate()) {
                        var pgendas = document.getElementsByClassName('agendas');
                        $.each(pdays, function(i, day){
                            $.each(pgendas, function(i, genda){
                                var i;
                                for (i=0; i<7; i++) {
                                    try {
                                        if (day.getElementsByClassName('eachday')[i].innerHTML == val.jsdate.getDate()) {
                                            for (a=0; a<7; a++) {
                                                if (day.getElementsByClassName('eachday')[i].getAttribute('id') == genda.getElementsByClassName('selectable')[a].getAttribute('id')) {
                                                    var newEl = document.createTextNode(val.jsevent);
                                                    var br = document.createElement("br");
                                                    var space = document.createTextNode("\n");

                                                    genda.getElementsByClassName('selectable')[a].appendChild(newEl);
                                                    genda.getElementsByClassName('selectable')[a].appendChild(br);
                                                    genda.getElementsByClassName('selectable')[a].appendChild(space);
                                                } else {
                                                }
                                            };
                                        }
                                    } catch (e){
                                    }
                                };
                            });
                        });
                    } else {
                    }

                    $(".fa-angle-left, .fa-angle-right").click(function() {
                        var pdays = document.getElementsByClassName('days');
                        var pmonth = document.getElementsByClassName("month");
                        var pyear = document.getElementsByClassName('year');

                        var pmonthname = pmonth[0].innerText;
                        var pyearname = pyear[0].innerText;
                        
                        if (pyearname == val.jsdate.getFullYear() && pmonthname == val.jsdate.getMonth()+1+"월" && v.innerText == val.jsdate.getDate()) {
                            var pgendas = document.getElementsByClassName('agendas');
                            $.each(pdays, function(i, day){
                                $.each(pgendas, function(i, genda){
                                    var i;
                                    for (i=0; i<7; i++) {
                                        try {
                                            if (day.getElementsByClassName('eachday')[i].innerHTML == val.jsdate.getDate()) {
                                                for (a=0; a<7; a++) {
                                                    if (day.getElementsByClassName('eachday')[i].getAttribute('id') == genda.getElementsByClassName('selectable')[a].getAttribute('id')) {
                                                        var newEl = document.createTextNode(val.jsevent);
                                                        var br = document.createElement("br");
                                                        var space = document.createTextNode("\n");

                                                        genda.getElementsByClassName('selectable')[a].appendChild(newEl);
                                                        genda.getElementsByClassName('selectable')[a].appendChild(br);
                                                        genda.getElementsByClassName('selectable')[a].appendChild(space);
                                                    } else {
                                                    }
                                                }
                                            }
                                        } catch (e){
                                        };
                                    }
                                });
                            });
                        } else {
                        }
                    });
                });
            });
        });    
    });
};
insert();

$(".fa-angle-left").click(function () {
	getPrevMonth();
	$(".main").addClass("is-rotated-left");
	setTimeout(function () {
		$(".main").removeClass("is-rotated-left");
    }, 195);
    $('.agenda').click(function() {
        if ($(this).text() != "") {
            alert($(this).text());
        }
    });
});

$(".fa-angle-right").click(function () {
	getNextMonth();
	$(".main").addClass("is-rotated-right");
	setTimeout(function () {
		$(".main").removeClass("is-rotated-right");
    }, 195);
    $('.agenda').click(function() {
        if ($(this).text() != "") {
            alert($(this).text());
        }
    });
});

$('.agenda').click(function() {
    if ($(this).text() != "") {
        alert($(this).text());
    }
});