/* =========================================================
   PGX - Gaming Center Management System
   FINAL PROFESSIONAL VERSION
   Password: tamer2008
   ========================================================= */


/* =========================================================
   كلمة السر
========================================================= */

const ADMIN_PASSWORD = "tamer2008";


/* =========================================================
   الأجهزة
========================================================= */

const devices = [
    { name: "🎮 PS1", type: "PS", price: 20 },
    { name: "🎮 PS2", type: "PS", price: 20 },
    { name: "🎮 PS3", type: "PS", price: 20 },

    { name: "🖥️ PC1", type: "PC", price: 20 },
    { name: "🖥️ PC2", type: "PC", price: 20 },
    { name: "🖥️ PC3", type: "PC", price: 20 },
    { name: "🖥️ PC4", type: "PC", price: 20 },
    { name: "🖥️ PC5", type: "PC", price: 20 },
    { name: "🖥️ PC6", type: "PC", price: 20 }
];


/* =========================================================
   حالة الأجهزة
========================================================= */

let currentDevice = -1;

let timers = [];
let elapsedSeconds = [];
let openMode = [];
let sessionStartedAt = [];

let orders = [];
let gameMoney = [];

devices.forEach(() => {
    orders.push([]);
    gameMoney.push(0);
    timers.push(null);
    elapsedSeconds.push(0);
    openMode.push(false);
    sessionStartedAt.push(null);
});


/* =========================================================
   السجلات
========================================================= */

let history = [];
let activityLog = [];


/* =========================================================
   الموظفون
========================================================= */

let employees = [];


/* =========================================================
   المخزن
========================================================= */

let inventory = [
    {
        name: "🥤 بيبسي",
        buyPrice: 15,
        sellPrice: 20,
        stock: 0,
        sold: 0,
        revenue: 0,
        profit: 0
    },
    {
        name: "💧 مياه",
        buyPrice: 7,
        sellPrice: 10,
        stock: 0,
        sold: 0,
        revenue: 0,
        profit: 0
    },
    {
        name: "☕ شاي",
        buyPrice: 5,
        sellPrice: 10,
        stock: 0,
        sold: 0,
        revenue: 0,
        profit: 0
    },
    {
        name: "☕ قهوة",
        buyPrice: 12,
        sellPrice: 20,
        stock: 0,
        sold: 0,
        revenue: 0,
        profit: 0
    },
    {
        name: "☕ نسكافيه",
        buyPrice: 15,
        sellPrice: 25,
        stock: 0,
        sold: 0,
        revenue: 0,
        profit: 0
    },
    {
        name: "🍜 إندومي",
        buyPrice: 4,
        sellPrice: 10,
        stock: 0,
        sold: 0,
        revenue: 0,
        profit: 0
    }
];


/* =========================================================
   بيانات اليوم
========================================================= */

let todayMoney = 0;
let todayGameMoney = 0;
let todayDrinkMoney = 0;
let todayProfit = 0;
let todayExpenses = 0;


/* =========================================================
   الإحصائيات
========================================================= */

let dailyStats = {
    sessions: 0,
    deviceMoney: {},
    deviceSessions: {},
    totalPlaySeconds: 0
};


/* =========================================================
   الشيفت الحالي
========================================================= */

let shift = {
    open: false,
    id: null,
    startTime: null,
    employee: "",
    startingCash: 0,

    startTodayMoney: 0,

    sessions: 0,
    gameRevenue: 0,
    drinksRevenue: 0,
    profit: 0,
    expenses: 0,

    devices: {}
};


/* =========================================================
   تقارير الشيفتات
========================================================= */

let shiftReports = [];


/* =========================================================
   الأصوات
========================================================= */

let audioContext = null;


/* =========================================================
   أدوات عامة
========================================================= */

function money(value) {
    return Number(value || 0).toFixed(2);
}


function nowText() {
    return new Date().toLocaleString("ar-EG");
}


function askPassword() {

    const pass = prompt("🔐 أدخل كلمة سر الإدارة");

    return pass === ADMIN_PASSWORD;
}


function addLog(action, details = "") {

    activityLog.push({
        id: Date.now(),
        action: action,
        details: details,
        date: nowText()
    });

    if (activityLog.length > 1000) {
        activityLog = activityLog.slice(-1000);
    }

    saveData();
}


/* =========================================================
   تحميل البيانات
========================================================= */

function loadData() {

    try {

        const data = {

            orders: "pgx_orders",
            gameMoney: "pgx_gameMoney",
            history: "pgx_history",
            inventory: "pgx_inventory",
            employees: "pgx_employees",
            todayMoney: "pgx_todayMoney",
            todayGameMoney: "pgx_todayGameMoney",
            todayDrinkMoney: "pgx_todayDrinkMoney",
            todayProfit: "pgx_todayProfit",
            todayExpenses: "pgx_todayExpenses",
            dailyStats: "pgx_dailyStats",
            prices: "pgx_prices",
            shift: "pgx_shift",
            shiftReports: "pgx_shiftReports",
            activityLog: "pgx_activityLog"

        };


        if (localStorage.getItem(data.orders)) {
            orders = JSON.parse(
                localStorage.getItem(data.orders)
            );
        }


        if (localStorage.getItem(data.gameMoney)) {
            gameMoney = JSON.parse(
                localStorage.getItem(data.gameMoney)
            );
        }


        if (localStorage.getItem(data.history)) {
            history = JSON.parse(
                localStorage.getItem(data.history)
            );
        }


        if (localStorage.getItem(data.inventory)) {

            const saved =
                JSON.parse(
                    localStorage.getItem(data.inventory)
                );

            inventory = saved.map(item => ({

                name: item.name || "منتج",

                buyPrice:
                    Number(item.buyPrice) || 0,

                sellPrice:
                    Number(item.sellPrice) || 0,

                stock:
                    Number(item.stock) || 0,

                sold:
                    Number(item.sold) || 0,

                revenue:
                    Number(item.revenue) || 0,

                profit:
                    Number(item.profit) || 0

            }));

        }


        if (localStorage.getItem(data.employees)) {

            employees =
                JSON.parse(
                    localStorage.getItem(data.employees)
                );

        }


        todayMoney =
            Number(
                localStorage.getItem(data.todayMoney)
            ) || 0;


        todayGameMoney =
            Number(
                localStorage.getItem(data.todayGameMoney)
            ) || 0;


        todayDrinkMoney =
            Number(
                localStorage.getItem(data.todayDrinkMoney)
            ) || 0;


        todayProfit =
            Number(
                localStorage.getItem(data.todayProfit)
            ) || 0;


        todayExpenses =
            Number(
                localStorage.getItem(data.todayExpenses)
            ) || 0;


        if (localStorage.getItem(data.dailyStats)) {

            dailyStats =
                JSON.parse(
                    localStorage.getItem(data.dailyStats)
                );

        }


        if (localStorage.getItem(data.prices)) {

            const prices =
                JSON.parse(
                    localStorage.getItem(data.prices)
                );

            prices.forEach((price, index) => {

                if (devices[index]) {

                    devices[index].price =
                        Number(price) || 20;

                }

            });

        }


        if (localStorage.getItem(data.shift)) {

            shift =
                JSON.parse(
                    localStorage.getItem(data.shift)
                );

        }


        if (localStorage.getItem(data.shiftReports)) {

            shiftReports =
                JSON.parse(
                    localStorage.getItem(data.shiftReports)
                );

        }


        if (localStorage.getItem(data.activityLog)) {

            activityLog =
                JSON.parse(
                    localStorage.getItem(data.activityLog)
                );

        }


        normalizeData();

    } catch (error) {

        console.error(
            "PGX Load Error:",
            error
        );

    }

}


/* =========================================================
   إصلاح البيانات القديمة
========================================================= */

function normalizeData() {

    while (orders.length < devices.length) {
        orders.push([]);
    }

    while (gameMoney.length < devices.length) {
        gameMoney.push(0);
    }

    while (timers.length < devices.length) {
        timers.push(null);
    }

    while (elapsedSeconds.length < devices.length) {
        elapsedSeconds.push(0);
    }

    while (openMode.length < devices.length) {
        openMode.push(false);
    }

    while (sessionStartedAt.length < devices.length) {
        sessionStartedAt.push(null);
    }


    if (!dailyStats.deviceMoney) {
        dailyStats.deviceMoney = {};
    }

    if (!dailyStats.deviceSessions) {
        dailyStats.deviceSessions = {};
    }

    if (!dailyStats.sessions) {
        dailyStats.sessions = 0;
    }

    if (!dailyStats.totalPlaySeconds) {
        dailyStats.totalPlaySeconds = 0;
    }


    inventory.forEach(item => {

        if (item.revenue === undefined) {
            item.revenue = 0;
        }

        if (item.profit === undefined) {
            item.profit = 0;
        }

        if (item.sold === undefined) {
            item.sold = 0;
        }

    });

}


/* =========================================================
   حفظ البيانات
========================================================= */

function saveData() {

    try {

        localStorage.setItem(
            "pgx_orders",
            JSON.stringify(orders)
        );

        localStorage.setItem(
            "pgx_gameMoney",
            JSON.stringify(gameMoney)
        );

        localStorage.setItem(
            "pgx_history",
            JSON.stringify(history)
        );

        localStorage.setItem(
            "pgx_inventory",
            JSON.stringify(inventory)
        );

        localStorage.setItem(
            "pgx_employees",
            JSON.stringify(employees)
        );

        localStorage.setItem(
            "pgx_todayMoney",
            todayMoney
        );

        localStorage.setItem(
            "pgx_todayGameMoney",
            todayGameMoney
        );

        localStorage.setItem(
            "pgx_todayDrinkMoney",
            todayDrinkMoney
        );

        localStorage.setItem(
            "pgx_todayProfit",
            todayProfit
        );

        localStorage.setItem(
            "pgx_todayExpenses",
            todayExpenses
        );

        localStorage.setItem(
            "pgx_dailyStats",
            JSON.stringify(dailyStats)
        );

        localStorage.setItem(
            "pgx_prices",
            JSON.stringify(
                devices.map(
                    device => device.price
                )
            )
        );

        localStorage.setItem(
            "pgx_shift",
            JSON.stringify(shift)
        );

        localStorage.setItem(
            "pgx_shiftReports",
            JSON.stringify(shiftReports)
        );

        localStorage.setItem(
            "pgx_activityLog",
            JSON.stringify(activityLog)
        );

    } catch (error) {

        console.error(
            "PGX Save Error:",
            error
        );

    }

}


/* =========================================================
   إنشاء الأجهزة
========================================================= */

function createDevices() {

    const container =
        document.getElementById("devices");

    if (!container) return;

    container.innerHTML = "";


    devices.forEach((device, index) => {

        container.innerHTML += `

        <div class="device">

            <h3>${device.name}</h3>

            <p id="status${index}">
                🟢 متاح
            </p>

            <p id="time${index}">
                00:00:00
            </p>

            <p id="playMoney${index}">
                🎮 اللعب: 0 جنيه
            </p>

            <p id="drinkMoney${index}">
                🥤 المشروبات: 0 جنيه
            </p>

            <p id="money${index}">
                <b>💰 الإجمالي: 0 جنيه</b>
            </p>

            <button
                id="startBtn${index}"
                onclick="startDevice(${index})">
                ▶️ ابدأ جلسة
            </button>

            <button
                id="stopBtn${index}"
                onclick="stopDevice(${index})"
                style="
                    display:none;
                    background:#ef4444;
                    color:white;
                ">
                ⏹️ إيقاف الجلسة
            </button>

        </div>

        `;

    });

}


/* =========================================================
   تحديث دخل اليوم
========================================================= */

function updateMoneyDisplay() {

    const element =
        document.getElementById("todayMoney");

    if (!element) return;

    element.innerHTML =
        money(todayMoney) +
        " جنيه";

}


/* =========================================================
   عداد الأجهزة
========================================================= */

function updateCounters() {

    let psBusy = 0;
    let pcBusy = 0;


    devices.forEach((device, index) => {

        const timer =
            timers[index];

        if (!timer) return;


        if (device.type === "PS") {
            psBusy++;
        } else {
            pcBusy++;
        }

    });


    const ps =
        document.getElementById("psCount");

    const pc =
        document.getElementById("pcCount");


    if (ps) {
        ps.innerHTML =
            psBusy + " / 3";
    }


    if (pc) {
        pc.innerHTML =
            pcBusy + " / 6";
    }

}


/* =========================================================
   بدء جهاز
========================================================= */

function startDevice(index) {

    if (timers[index]) {

        alert(
            "⚠️ الجهاز يعمل بالفعل"
        );

        return;

    }


    if (!shift.open) {

        if (
            !confirm(
                "⚠️ لا يوجد شيفت مفتوح.\n\nهل تريد تشغيل الجهاز رغم ذلك؟"
            )
        ) {
            return;
        }

    }


    currentDevice = index;


    const popup =
        document.getElementById("popup");


    if (popup) {
        popup.style.display = "flex";
    }

}


/* =========================================================
   إغلاق نافذة الوقت
========================================================= */

function closePopup() {

    const popup =
        document.getElementById("popup");

    if (popup) {
        popup.style.display = "none";
    }

    currentDevice = -1;

}


/* =========================================================
   تشغيل وقت محدد
========================================================= */

function chooseTime(hours) {

    if (currentDevice === -1) {
        return;
    }


    const index =
        currentDevice;


    closePopup();


    openMode[index] = false;

    sessionStartedAt[index] =
        Date.now();


    const totalSeconds =
        Math.round(
            Number(hours) * 3600
        );


    elapsedSeconds[index] =
        totalSeconds;


    setDeviceBusy(
        index,
        "🔴 مشغول"
    );


    let remaining =
        totalSeconds;


    timers[index] =
        setInterval(() => {

            remaining--;

            elapsedSeconds[index] =
                Math.max(
                    remaining,
                    0
                );


            updateDeviceTime(
                index,
                remaining
            );


            const playedSeconds =
                totalSeconds -
                Math.max(
                    remaining,
                    0
                );


            const price =
                (
                    playedSeconds /
                    3600
                ) *
                devices[index].price;


            gameMoney[index] =
                Math.max(
                    0,
                    price
                );


            updateDeviceMoney(index);


            saveData();


            if (remaining <= 0) {

                clearInterval(
                    timers[index]
                );

                timers[index] = null;


                finishSession(
                    index,
                    "⏰ انتهى الوقت"
                );

            }

        }, 1000);


    playStartSound();


    addLog(
        "بدء جلسة",
        devices[index].name +
        " - " +
        formatSeconds(totalSeconds)
    );

}


/* =========================================================
   وقت مخصص بالدقائق
========================================================= */

function customTime() {

    if (currentDevice === -1) {

        alert(
            "⚠️ اختر جهازًا أولًا"
        );

        return;

    }


    const value =
        prompt(
            "⏱️ اكتب مدة اللعب بالدقائق:\n\n" +
            "مثال:\n" +
            "40 = 40 دقيقة\n" +
            "50 = 50 دقيقة\n" +
            "75 = ساعة و15 دقيقة\n" +
            "105 = ساعة و45 دقيقة"
        );


    if (value === null) return;


    const minutes =
        Number(value);


    if (
        !Number.isFinite(minutes) ||
        minutes <= 0
    ) {

        alert(
            "❌ اكتب عدد دقائق صحيح"
        );

        return;

    }


    chooseTime(
        minutes / 60
    );

}


/* =========================================================
   OPEN
========================================================= */

function chooseOpen() {

    if (currentDevice === -1) {
        return;
    }


    const index =
        currentDevice;


    closePopup();


    openMode[index] = true;

    sessionStartedAt[index] =
        Date.now();

    elapsedSeconds[index] = 0;


    setDeviceBusy(
        index,
        "🔴 OPEN"
    );


    timers[index] =
        setInterval(() => {

            elapsedSeconds[index]++;


            updateDeviceTime(
                index,
                elapsedSeconds[index]
            );


            gameMoney[index] =
                (
                    elapsedSeconds[index] /
                    3600
                ) *
                devices[index].price;


            updateDeviceMoney(index);

            saveData();

        }, 1000);


    playStartSound();


    addLog(
        "بدء جلسة OPEN",
        devices[index].name
    );

}


/* =========================================================
   جعل الجهاز مشغول
========================================================= */

function setDeviceBusy(
    index,
    statusText
) {

    const status =
        document.getElementById(
            "status" + index
        );

    const start =
        document.getElementById(
            "startBtn" + index
        );

    const stop =
        document.getElementById(
            "stopBtn" + index
        );


    if (status) {
        status.innerHTML =
            statusText;
    }


    if (start) {
        start.style.display =
            "none";
    }


    if (stop) {
        stop.style.display =
            "block";
    }


    updateCounters();

}


/* =========================================================
   تحديث الوقت
========================================================= */

function updateDeviceTime(
    index,
    seconds
) {

    seconds =
        Math.max(
            0,
            Math.floor(seconds)
        );


    const element =
        document.getElementById(
            "time" + index
        );


    if (!element) return;


    element.innerHTML =
        formatSeconds(seconds);

}


/* =========================================================
   تنسيق الوقت
========================================================= */

function formatSeconds(seconds) {

    seconds =
        Math.max(
            0,
            Math.floor(seconds)
        );


    const h =
        Math.floor(
            seconds / 3600
        );


    const m =
        Math.floor(
            (seconds % 3600) / 60
        );


    const s =
        seconds % 60;


    return (
        String(h).padStart(2, "0") +
        ":" +
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0")
    );

}


/* =========================================================
   المشروبات
========================================================= */

function getDrinksTotal(index) {

    let total = 0;


    if (!orders[index]) {
        return 0;
    }


    orders[index].forEach(item => {

        total +=
            Number(item.price) || 0;

    });


    return total;

}


/* =========================================================
   تحديث فلوس الجهاز
========================================================= */

function updateDeviceMoney(index) {

    const play =
        Number(
            gameMoney[index]
        ) || 0;


    const drinks =
        getDrinksTotal(index);


    const total =
        play + drinks;


    const playElement =
        document.getElementById(
            "playMoney" + index
        );


    const drinkElement =
        document.getElementById(
            "drinkMoney" + index
        );


    const moneyElement =
        document.getElementById(
            "money" + index
        );


    if (playElement) {

        playElement.innerHTML =
            "🎮 اللعب: " +
            money(play) +
            " جنيه";

    }


    if (drinkElement) {

        drinkElement.innerHTML =
            "🥤 المشروبات: " +
            money(drinks) +
            " جنيه";

    }


    if (moneyElement) {

        moneyElement.innerHTML =
            "<b>💰 الإجمالي: " +
            money(total) +
            " جنيه</b>";

    }

}


/* =========================================================
   إيقاف جلسة
========================================================= */

function stopDevice(index) {

    if (
        index === undefined ||
        index === null
    ) {
        return;
    }


    if (!timers[index]) {
        return;
    }


    clearInterval(
        timers[index]
    );


    timers[index] = null;


    finishSession(
        index,
        "⏹️ تم إيقاف الجلسة يدويًا"
    );

}


/* =========================================================
   إنهاء الجلسة
========================================================= */

function finishSession(
    index,
    reason
) {

    const playMoney =
        Number(
            gameMoney[index]
        ) || 0;


    const drinksTotal =
        getDrinksTotal(index);


    const total =
        playMoney +
        drinksTotal;


    const time =
        document.getElementById(
            "time" + index
        )?.innerHTML ||
        "00:00:00";


    const secondsPlayed =
        Number(
            elapsedSeconds[index]
        ) || 0;


    /* السجل */

    history.push({

        id: Date.now(),

        device:
            devices[index].name,

        time: time,

        seconds:
            secondsPlayed,

        gameMoney:
            Number(
                playMoney.toFixed(2)
            ),

        drinkMoney:
            Number(
                drinksTotal.toFixed(2)
            ),

        money:
            Number(
                total.toFixed(2)
            ),

        date:
            nowText(),

        reason:
            reason

    });


    /* دخل اليوم */

    todayGameMoney +=
        playMoney;


    todayDrinkMoney +=
        drinksTotal;


    todayMoney =
        todayGameMoney +
        todayDrinkMoney -
        todayExpenses;


    /* إحصائيات */

    dailyStats.sessions++;


    dailyStats.totalPlaySeconds +=
        secondsPlayed;


    if (!dailyStats.deviceMoney) {
        dailyStats.deviceMoney = {};
    }


    if (!dailyStats.deviceSessions) {
        dailyStats.deviceSessions = {};
    }


    const deviceName =
        devices[index].name;


    dailyStats.deviceMoney[
        deviceName
    ] =
        (
            dailyStats.deviceMoney[
                deviceName
            ] || 0
        ) +
        total;


    dailyStats.deviceSessions[
        deviceName
    ] =
        (
            dailyStats.deviceSessions[
                deviceName
            ] || 0
        ) + 1;


    /* الشيفت */

    if (shift.open) {

        shift.sessions++;

        shift.gameRevenue +=
            playMoney;

        shift.drinksRevenue +=
            drinksTotal;

        shift.profit +=
            getOrdersProfit(index);


        if (!shift.devices[index]) {

            shift.devices[index] = {

                name:
                    devices[index].name,

                revenue: 0,

                sessions: 0

            };

        }


        shift.devices[index].revenue +=
            total;


        shift.devices[index].sessions++;

    }


    playEndSound();


    addLog(
        "انتهاء جلسة",
        devices[index].name +
        " - " +
        reason +
        " - " +
        money(total) +
        " جنيه"
    );


    alert(
        "🎮 " +
        devices[index].name +

        "\n\n⏱ الوقت: " +
        time +

        "\n\n🎮 اللعب: " +
        money(playMoney) +
        " جنيه" +

        "\n🥤 المشروبات: " +
        money(drinksTotal) +
        " جنيه" +

        "\n\n💰 الإجمالي: " +
        money(total) +
        " جنيه"
    );


    /* تنظيف */

    orders[index] = [];

    gameMoney[index] = 0;

    elapsedSeconds[index] = 0;

    openMode[index] = false;

    sessionStartedAt[index] = null;


    const status =
        document.getElementById(
            "status" + index
        );


    const timeElement =
        document.getElementById(
            "time" + index
        );


    const playElement =
        document.getElementById(
            "playMoney" + index
        );


    const drinkElement =
        document.getElementById(
            "drinkMoney" + index
        );


    const moneyElement =
        document.getElementById(
            "money" + index
        );


    const startButton =
        document.getElementById(
            "startBtn" + index
        );


    const stopButton =
        document.getElementById(
            "stopBtn" + index
        );


    if (status) {
        status.innerHTML =
            "🟢 متاح";
    }


    if (timeElement) {
        timeElement.innerHTML =
            "00:00:00";
    }


    if (playElement) {
        playElement.innerHTML =
            "🎮 اللعب: 0 جنيه";
    }


    if (drinkElement) {
        drinkElement.innerHTML =
            "🥤 المشروبات: 0 جنيه";
    }


    if (moneyElement) {
        moneyElement.innerHTML =
            "<b>💰 الإجمالي: 0 جنيه</b>";
    }


    if (startButton) {
        startButton.style.display =
            "block";
    }


    if (stopButton) {
        stopButton.style.display =
            "none";
    }


    currentDevice = -1;


    updateCounters();

    updateMoneyDisplay();

    saveData();

}


/* =========================================================
   حساب ربح الطلبات
========================================================= */

function getOrdersProfit(index) {

    let total = 0;


    if (!orders[index]) {
        return 0;
    }


    orders[index].forEach(item => {

        total +=
            Number(item.profit) || 0;

    });


    return total;

}


/* =========================================================
   بيع مشروب
========================================================= */

function openDrinks() {

    let value =
        prompt(
            "📺 اختر رقم الجهاز:\n\n" +
            "1 = PS1\n" +
            "2 = PS2\n" +
            "3 = PS3\n" +
            "4 = PC1\n" +
            "5 = PC2\n" +
            "6 = PC3\n" +
            "7 = PC4\n" +
            "8 = PC5\n" +
            "9 = PC6"
        );


    if (value === null) {
        return;
    }


    const device =
        Number(value) - 1;


    if (
        device < 0 ||
        device >= devices.length
    ) {

        alert(
            "❌ رقم جهاز غير صحيح"
        );

        return;

    }


    currentDevice =
        device;


    let menu =
        "🥤 قائمة المشروبات\n\n";


    inventory.forEach(
        (item, index) => {

            menu +=
                (index + 1) +
                " - " +
                item.name +
                "\n" +
                "💵 " +
                item.sellPrice +
                " جنيه" +
                "\n📦 المخزون: " +
                item.stock +
                "\n\n";

        }
    );


    const choice =
        prompt(menu);


    if (choice === null) {
        return;
    }


    const itemIndex =
        Number(choice) - 1;


    if (
        itemIndex < 0 ||
        itemIndex >= inventory.length
    ) {

        alert(
            "❌ اختيار غير صحيح"
        );

        return;

    }


    const item =
        inventory[itemIndex];


    if (item.stock <= 0) {

        alert(
            "⚠️ المنتج غير موجود في المخزون"
        );

        return;

    }


    let quantity =
        Number(
            prompt(
                "الكمية؟",
                "1"
            )
        );


    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        alert(
            "❌ كمية غير صحيحة"
        );

        return;

    }


    quantity =
        Math.floor(quantity);


    if (
        quantity >
        item.stock
    ) {

        alert(
            "❌ الكمية غير متاحة"
        );

        return;

    }


    const revenue =
        item.sellPrice *
        quantity;


    const profit =
        (
            item.sellPrice -
            item.buyPrice
        ) *
        quantity;


    orders[device].push({

        name:
            item.name +
            " × " +
            quantity,

        price:
            revenue,

        profit:
            profit,

        buyCost:
            item.buyPrice *
            quantity

    });


    item.stock -=
        quantity;


    item.sold +=
        quantity;


    item.revenue +=
        revenue;


    item.profit +=
        profit;


    todayDrinkMoney +=
        revenue;


    todayProfit +=
        profit;


    todayMoney =
        todayGameMoney +
        todayDrinkMoney -
        todayExpenses;


    updateDeviceMoney(device);

    updateMoneyDisplay();


    if (
        item.stock <= 3
    ) {

        playWarningSound();

    }


    addLog(
        "بيع مشروبات",
        item.name +
        " × " +
        quantity +
        " - ربح " +
        money(profit) +
        " جنيه"
    );


    saveData();


    alert(
        "✅ تمت إضافة الطلب\n\n" +

        item.name +

        "\nالكمية: " +
        quantity +

        "\n💵 المبيعات: " +
        money(revenue) +
        " جنيه" +

        "\n📈 الربح: " +
        money(profit) +
        " جنيه" +

        "\n📦 المتبقي: " +
        item.stock
    );

}


/* =========================================================
   المخزن
========================================================= */

function inventoryPanel() {

    let text =
        "📦 مخزن PGX\n\n";


    inventory.forEach(
        (item, index) => {

            text +=
                "━━━━━━━━━━━━\n" +

                (index + 1) +
                ") " +
                item.name +

                "\n💰 شراء: " +
                money(item.buyPrice) +

                "\n💵 بيع: " +
                money(item.sellPrice) +

                "\n📦 المخزون: " +
                item.stock +

                "\n📤 المباع: " +
                item.sold +

                "\n💰 المبيعات: " +
                money(item.revenue) +

                "\n📈 الربح: " +
                money(item.profit) +

                "\n";

        }
    );


    text +=
        "\n\n1 - إضافة مخزون" +
        "\n2 - تعديل منتج" +
        "\n3 - إضافة منتج" +
        "\n4 - حذف منتج" +
        "\n5 - تقرير أرباح المخزن";


    const choice =
        prompt(text);


    switch (choice) {

        case "1":
            addStock();
            break;

        case "2":
            editInventoryItem();
            break;

        case "3":
            addInventoryItem();
            break;

        case "4":
            deleteInventoryItem();
            break;

        case "5":
            inventoryReport();
            break;

    }

}


/* =========================================================
   إضافة مخزون
========================================================= */

function addStock() {

    const number =
        Number(
            prompt(
                "رقم المنتج"
            )
        ) - 1;


    if (
        number < 0 ||
        number >= inventory.length
    ) {

        alert(
            "❌ رقم غير صحيح"
        );

        return;

    }


    const quantity =
        Number(
            prompt(
                "عدد القطع التي تريد إضافتها"
            )
        );


    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {

        return;

    }


    inventory[number].stock +=
        Math.floor(quantity);


    addLog(
        "إضافة مخزون",
        inventory[number].name +
        " × " +
        quantity
    );


    saveData();


    alert(
        "✅ تم تحديث المخزون"
    );

}


/* =========================================================
   تعديل منتج
========================================================= */

function editInventoryItem() {

    const number =
        Number(
            prompt(
                "رقم المنتج"
            )
        ) - 1;


    if (
        number < 0 ||
        number >= inventory.length
    ) {

        alert(
            "❌ رقم غير صحيح"
        );

        return;

    }


    const item =
        inventory[number];


    const name =
        prompt(
            "اسم المنتج",
            item.name
        );


    if (name === null) {
        return;
    }


    const buy =
        Number(
            prompt(
                "سعر الشراء بالجملة",
                item.buyPrice
            )
        );


    const sell =
        Number(
            prompt(
                "سعر البيع للزبون",
                item.sellPrice
            )
        );


    if (
        !Number.isFinite(buy) ||
        !Number.isFinite(sell) ||
        buy < 0 ||
        sell < 0
    ) {

        alert(
            "❌ أسعار غير صحيحة"
        );

        return;

    }


    item.name =
        name.trim() ||
        item.name;


    item.buyPrice =
        buy;


    item.sellPrice =
        sell;


    addLog(
        "تعديل منتج",
        item.name
    );


    saveData();


    alert(
        "✅ تم تعديل المنتج"
    );

}


/* =========================================================
   إضافة منتج
========================================================= */

function addInventoryItem() {

    const name =
        prompt(
            "اسم المنتج"
        );


    if (!name) {
        return;
    }


    const buy =
        Number(
            prompt(
                "سعر الشراء"
            )
        );


    const sell =
        Number(
            prompt(
                "سعر البيع"
            )
        );


    const stock =
        Number(
            prompt(
                "المخزون الحالي",
                "0"
            )
        );


    if (
        !Number.isFinite(buy) ||
        !Number.isFinite(sell)
    ) {

        alert(
            "❌ أسعار غير صحيحة"
        );

        return;

    }


    inventory.push({

        name:
            name.trim(),

        buyPrice:
            buy,

        sellPrice:
            sell,

        stock:
            Math.max(
                0,
                Math.floor(
                    stock || 0
                )
            ),

        sold: 0,

        revenue: 0,

        profit: 0

    });


    addLog(
        "إضافة منتج",
        name
    );


    saveData();


    alert(
        "✅ تمت إضافة المنتج"
    );

}


/* =========================================================
   حذف منتج
========================================================= */

function deleteInventoryItem() {

    const number =
        Number(
            prompt(
                "رقم المنتج الذي تريد حذفه"
            )
        ) - 1;


    if (
        number < 0 ||
        number >= inventory.length
    ) {

        alert(
            "❌ رقم غير صحيح"
        );

        return;

    }


    const item =
        inventory[number];


    if (
        !confirm(
            "⚠️ حذف " +
            item.name +
            "؟"
        )
    ) {
        return;
    }


    inventory.splice(
        number,
        1
    );


    addLog(
        "حذف منتج",
        item.name
    );


    saveData();


    alert(
        "✅ تم حذف المنتج"
    );

}


/* =========================================================
   تقرير المخزن
========================================================= */

function inventoryReport() {

    let revenue = 0;
    let profit = 0;
    let cost = 0;


    inventory.forEach(item => {

        revenue +=
            Number(item.revenue) || 0;

        profit +=
            Number(item.profit) || 0;

        cost +=
            (
                Number(item.buyPrice) || 0
            ) *
            (
                Number(item.sold) || 0
            );

    });


    alert(
        "📦 تقرير المخزن\n\n" +

        "💵 إجمالي المبيعات: " +
        money(revenue) +
        " جنيه\n\n" +

        "💸 تكلفة البضاعة: " +
        money(cost) +
        " جنيه\n\n" +

        "📈 إجمالي الربح: " +
        money(profit) +
        " جنيه"
    );

}


/* =========================================================
   الموظفون
========================================================= */

function employeesPanel() {

    let text =
        "👨‍💼 الموظفون\n\n";


    if (
        employees.length === 0
    ) {

        text +=
            "لا يوجد موظفون.\n\n";

    }


    employees.forEach(
        (employee, index) => {

            text +=
                (index + 1) +
                " - " +
                employee.name +
                "\n";

        }
    );


    text +=
        "\n1 - إضافة موظف" +
        "\n2 - حذف موظف";


    const choice =
        prompt(text);


    if (choice === "1") {

        const name =
            prompt(
                "اسم الموظف"
            );


        if (!name) {
            return;
        }


        employees.push({

            id:
                Date.now(),

            name:
                name.trim(),

            created:
                nowText()

        });


        addLog(
            "إضافة موظف",
            name
        );


        saveData();


        alert(
            "✅ تمت إضافة الموظف"
        );

    }


    if (choice === "2") {

        const number =
            Number(
                prompt(
                    "رقم الموظف"
                )
            ) - 1;


        if (
            number < 0 ||
            number >= employees.length
        ) {

            alert(
                "❌ رقم غير صحيح"
            );

            return;

        }


        const employee =
            employees[number];


        if (
            !confirm(
                "حذف الموظف " +
                employee.name +
                "؟"
            )
        ) {
            return;
        }


        employees.splice(
            number,
            1
        );


        addLog(
            "حذف موظف",
            employee.name
        );


        saveData();


        alert(
            "✅ تم حذف الموظف"
        );

    }

}


/* =========================================================
   فتح الشيفت
========================================================= */

function openShift() {

    if (shift.open) {

        alert(
            "⚠️ الشيفت مفتوح بالفعل"
        );

        return;

    }


    let employeeName = "";


    if (
        employees.length > 0
    ) {

        let list =
            "👨‍💼 اختر الموظف:\n\n";


        employees.forEach(
            (employee, index) => {

                list +=
                    (index + 1) +
                    " - " +
                    employee.name +
                    "\n";

            }
        );


        const choice =
            Number(
                prompt(list)
            ) - 1;


        if (
            choice >= 0 &&
            choice < employees.length
        ) {

            employeeName =
                employees[choice].name;

        }

    } else {

        employeeName =
            prompt(
                "اسم الموظف"
            ) || "";

    }


    const startingCash =
        Number(
            prompt(
                "💵 الكاش الموجود في بداية الشيفت",
                "0"
            )
        ) || 0;


    shift = {

        open: true,

        id:
            Date.now(),

        startTime:
            new Date().toISOString(),

        employee:
            employeeName,

        startingCash:
            startingCash,

        startTodayMoney:
            todayMoney,

        sessions: 0,

        gameRevenue: 0,

        drinksRevenue: 0,

        profit: 0,

        expenses: 0,

        devices: {}

    };


    devices.forEach(
        (device, index) => {

            shift.devices[index] = {

                name:
                    device.name,

                revenue: 0,

                sessions: 0

            };

        }
    );


    addLog(
        "فتح الشيفت",
        employeeName
    );


    saveData();

    playShiftSound();


    alert(
        "🟢 تم فتح الشيفت\n\n" +

        "👨‍💼 الموظف: " +
        employeeName +

        "\n💵 كاش البداية: " +
        money(startingCash) +
        " جنيه" +

        "\n🕐 " +
        nowText()
    );

}


/* =========================================================
   قفل الشيفت
========================================================= */

function closeShift() {

    if (!shift.open) {

        alert(
            "⚠️ لا يوجد شيفت مفتوح"
        );

        return;

    }


    if (
        !confirm(
            "🔴 هل تريد قفل الشيفت؟\n\n" +
            "سيتم حفظ تقرير الشيفت بالكامل."
        )
    ) {
        return;
    }


    const endTime =
        new Date();


    const startTime =
        new Date(
            shift.startTime
        );


    const duration =
        endTime -
        startTime;


    const shiftIncome =
        todayMoney -
        shift.startTodayMoney;


    const report = {

        id:
            shift.id,

        employee:
            shift.employee,

        startTime:
            shift.startTime,

        endTime:
            endTime.toISOString(),

        duration:
            duration,

        totalMoney:
            Math.max(
                0,
                shiftIncome
            ),

        sessions:
            shift.sessions,

        gameRevenue:
            shift.gameRevenue,

        drinksRevenue:
            shift.drinksRevenue,

        profit:
            shift.profit,

        expenses:
            shift.expenses,

        devices:
            shift.devices

    };


    shiftReports.push(
        report
    );


    shift = {

        open: false,

        id: null,

        startTime: null,

        employee: "",

        startingCash: 0,

        startTodayMoney: 0,

        sessions: 0,

        gameRevenue: 0,

        drinksRevenue: 0,

        profit: 0,

        expenses: 0,

        devices: {}

    };


    addLog(
        "قفل الشيفت",
        report.employee +
        " - " +
        money(report.totalMoney) +
        " جنيه"
    );


    saveData();

    playShiftSound();


    showShiftReport(
        report
    );

}


/* =========================================================
   تقرير الشيفت
========================================================= */

function showShiftReport(report) {

    let text =
        "📊 تقرير الشيفت\n\n" +

        "👨‍💼 الموظف: " +
        report.employee +

        "\n\n🟢 البداية: " +
        new Date(
            report.startTime
        ).toLocaleString(
            "ar-EG"
        ) +

        "\n🔴 النهاية: " +
        new Date(
            report.endTime
        ).toLocaleString(
            "ar-EG"
        ) +

        "\n\n⏱ مدة الشيفت: " +
        formatDuration(
            report.duration
        ) +

        "\n\n🎮 دخل اللعب: " +
        money(
            report.gameRevenue
        ) +
        " جنيه" +

        "\n🥤 دخل المشروبات: " +
        money(
            report.drinksRevenue
        ) +
        " جنيه" +

        "\n📈 ربح المشروبات: " +
        money(
            report.profit
        ) +
        " جنيه" +

        "\n💸 المصروفات: " +
        money(
            report.expenses
        ) +
        " جنيه" +

        "\n\n💰 إجمالي الدخل: " +
        money(
            report.totalMoney
        ) +
        " جنيه" +

        "\n🎮 عدد الجلسات: " +
        report.sessions +

        "\n\n━━━━━━━━━━━━\n" +

        "🖥️ دخل الأجهزة:\n\n";


    Object.values(
        report.devices || {}
    ).forEach(device => {

        text +=
            device.name +
            "\n💰 " +
            money(
                device.revenue
            ) +
            " جنيه" +
            "\n🎮 جلسات: " +
            device.sessions +
            "\n\n";

    });


    alert(text);

}


/* =========================================================
   تقارير الشيفتات القديمة
========================================================= */

function showShiftReports() {

    if (
        shiftReports.length === 0
    ) {

        alert(
            "📊 لا توجد تقارير محفوظة"
        );

        return;

    }


    let text =
        "📊 تقارير الشيفتات\n\n";


    shiftReports
        .slice()
        .reverse()
        .forEach(
            (report, index) => {

                text +=

                    "━━━━━━━━━━━━━━\n" +

                    "🧾 شيفت #" +
                    (
                        shiftReports.length -
                        index
                    ) +

                    "\n👨‍💼 الموظف: " +
                    report.employee +

                    "\n📅 " +
                    new Date(
                        report.startTime
                    ).toLocaleDateString(
                        "ar-EG"
                    ) +

                    "\n💰 الدخل: " +
                    money(
                        report.totalMoney
                    ) +

                    " جنيه" +

                    "\n🎮 الجلسات: " +
                    report.sessions +

                    "\n⏱ المدة: " +
                    formatDuration(
                        report.duration
                    ) +

                    "\n";

            }
        );


    alert(text);

}


/* =========================================================
   المصروفات
========================================================= */

let expenses = JSON.parse(
    localStorage.getItem(
        "pgx_expenses"
    )
) || [];


function saveExpenses() {

    localStorage.setItem(
        "pgx_expenses",
        JSON.stringify(expenses)
    );

}


function addExpense() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    const title =
        prompt(
            "💸 اسم المصروف\n\nمثال: كهرباء / صيانة / شراء بضاعة"
        );


    if (!title) {
        return;
    }


    const amount =
        Number(
            prompt(
                "💰 قيمة المصروف"
            )
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "❌ قيمة غير صحيحة"
        );

        return;

    }


    const expense = {

        id:
            Date.now(),

        title:
            title.trim(),

        amount:
            amount,

        date:
            nowText()

    };


    expenses.push(
        expense
    );


    todayExpenses +=
        amount;


    todayMoney =
        todayGameMoney +
        todayDrinkMoney -
        todayExpenses;


    if (shift.open) {

        shift.expenses +=
            amount;

    }


    addLog(
        "إضافة مصروف",
        title +
        " - " +
        money(amount) +
        " جنيه"
    );


    saveExpenses();
    saveData();


    updateMoneyDisplay();


    alert(
        "✅ تم تسجيل المصروف\n\n" +
        title +
        "\n💰 " +
        money(amount) +
        " جنيه"
    );

}


/* =========================================================
   تقرير المصروفات
========================================================= */

function expensesReport() {

    if (
        expenses.length === 0
    ) {

        alert(
            "💸 لا توجد مصروفات مسجلة"
        );

        return;

    }


    let total = 0;


    let text =
        "💸 مصروفات اليوم\n\n";


    expenses
        .slice()
        .reverse()
        .forEach(
            (item, index) => {

                total +=
                    Number(
                        item.amount
                    ) || 0;


                text +=
                    (index + 1) +
                    ") " +
                    item.title +

                    "\n💰 " +
                    money(
                        item.amount
                    ) +

                    " جنيه" +

                    "\n📅 " +
                    item.date +

                    "\n\n";

            }
        );


    text +=
        "━━━━━━━━━━━━\n" +
        "💰 الإجمالي: " +
        money(total) +
        " جنيه";


    alert(text);

}


/* =========================================================
   سجل الجلسات
========================================================= */

function showHistory() {

    if (
        history.length === 0
    ) {

        alert(
            "📋 لا توجد جلسات"
        );

        return;

    }


    let text =
        "📋 سجل الجلسات\n\n";


    history
        .slice()
        .reverse()
        .slice(0, 100)
        .forEach(
            (item, index) => {

                text +=

                    "━━━━━━━━━━━━\n" +

                    (index + 1) +
                    ") " +
                    item.device +

                    "\n⏱ " +
                    item.time +

                    "\n🎮 اللعب: " +
                    money(
                        item.gameMoney
                    ) +

                    "\n🥤 المشروبات: " +
                    money(
                        item.drinkMoney
                    ) +

                    "\n💰 الإجمالي: " +
                    money(
                        item.money
                    ) +

                    "\n📅 " +
                    item.date +

                    "\n📝 " +
                    item.reason +

                    "\n";

            }
        );


    alert(text);

}


/* =========================================================
   الأجهزة المشغولة
========================================================= */

function showRunningDevices() {

    let text =
        "📺 الأجهزة المشغولة\n\n";


    let found = false;


    devices.forEach(
        (device, index) => {

            if (!timers[index]) {
                return;
            }


            found = true;


            text +=

                "━━━━━━━━━━━━\n" +

                device.name +

                "\n⏱ " +
                (
                    document.getElementById(
                        "time" + index
                    )?.innerHTML ||
                    "00:00:00"
                ) +

                "\n🎮 اللعب: " +
                money(
                    gameMoney[index]
                ) +

                "\n🥤 المشروبات: " +
                money(
                    getDrinksTotal(index)
                ) +

                "\n💰 الإجمالي: " +
                money(
                    gameMoney[index] +
                    getDrinksTotal(index)
                ) +

                "\n";

        }
    );


    if (!found) {

        alert(
            "🟢 لا توجد أجهزة مشغولة"
        );

        return;

    }


    alert(text);

}


/* =========================================================
   النظرة السريعة
========================================================= */

function quickOverview() {

    let busyPS = 0;
    let busyPC = 0;


    devices.forEach(
        (device, index) => {

            if (!timers[index]) {
                return;
            }


            if (
                device.type === "PS"
            ) {
                busyPS++;
            } else {
                busyPC++;
            }

        }
    );


    let bestDevice =
        null;

    let bestMoney = 0;


    Object.entries(
        dailyStats.deviceMoney || {}
    ).forEach(
        ([name, value]) => {

            if (
                Number(value) >
                bestMoney
            ) {

                bestMoney =
                    Number(value);

                bestDevice =
                    name;

            }

        }
    );


    const net =
        todayGameMoney +
        todayDrinkMoney -
        todayExpenses;


    alert(

        "📊 PGX — نظرة سريعة\n" +

        "━━━━━━━━━━━━━━━━\n\n" +

        "💰 دخل اللعب: " +
        money(todayGameMoney) +
        " جنيه\n\n" +

        "🥤 دخل المشروبات: " +
        money(todayDrinkMoney) +
        " جنيه\n\n" +

        "💸 المصروفات: " +
        money(todayExpenses) +
        " جنيه\n\n" +

        "📈 صافي اليوم: " +
        money(net) +
        " جنيه\n\n" +

        "🎮 PS مشغول: " +
        busyPS +
        " / 3\n" +

        "🖥️ PC مشغول: " +
        busyPC +
        " / 6\n\n" +

        "📋 الجلسات: " +
        dailyStats.sessions +
        "\n\n" +

        "🏆 أكثر جهاز دخلًا:\n" +
        (
            bestDevice ||
            "لا يوجد"
        ) +

        "\n💰 " +
        money(bestMoney) +
        " جنيه"

    );

}


/* =========================================================
   تغيير سعر الجهاز
========================================================= */

function changePrice() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    const number =
        Number(
            prompt(
                "اختر الجهاز:\n\n" +
                "1 = PS1\n" +
                "2 = PS2\n" +
                "3 = PS3\n" +
                "4 = PC1\n" +
                "5 = PC2\n" +
                "6 = PC3\n" +
                "7 = PC4\n" +
                "8 = PC5\n" +
                "9 = PC6"
            )
        ) - 1;


    if (
        number < 0 ||
        number >= devices.length
    ) {

        alert(
            "❌ رقم غير صحيح"
        );

        return;

    }


    const price =
        Number(
            prompt(
                "💵 سعر الساعة الجديد",
                devices[number].price
            )
        );


    if (
        !Number.isFinite(price) ||
        price <= 0
    ) {

        alert(
            "❌ سعر غير صحيح"
        );

        return;

    }


    devices[number].price =
        price;


    addLog(
        "تغيير سعر جهاز",
        devices[number].name +
        " = " +
        price +
        " جنيه/ساعة"
    );


    saveData();


    alert(
        "✅ تم تغيير السعر"
    );

}


/* =========================================================
   تقرير اليوم
========================================================= */

function createDailyReport() {

    let text =
        "📊 تقرير PGX اليومي\n\n";


    const net =
        todayGameMoney +
        todayDrinkMoney -
        todayExpenses;


    text +=
        "🎮 دخل اللعب: " +
        money(todayGameMoney) +
        " جنيه\n";


    text +=
        "🥤 دخل المشروبات: " +
        money(todayDrinkMoney) +
        " جنيه\n";


    text +=
        "💸 المصروفات: " +
        money(todayExpenses) +
        " جنيه\n";


    text +=
        "📈 ربح المشروبات: " +
        money(todayProfit) +
        " جنيه\n";


    text +=
        "💰 صافي اليوم: " +
        money(net) +
        " جنيه\n";


    text +=
        "📋 الجلسات: " +
        dailyStats.sessions +
        "\n";


    text +=
        "⏱ إجمالي وقت اللعب: " +
        formatDuration(
            dailyStats.totalPlaySeconds *
            1000
        ) +
        "\n\n";


    text +=
        "🖥️ دخل الأجهزة:\n\n";


    let bestDevice =
        null;

    let bestMoney =
        0;


    devices.forEach(
        device => {

            const revenue =
                Number(
                    (
                        dailyStats
                            .deviceMoney ||
                        {}
                    )[device.name] ||
                    0
                );


            const sessions =
                Number(
                    (
                        dailyStats
                            .deviceSessions ||
                        {}
                    )[device.name] ||
                    0
                );


            text +=
                device.name +
                " = " +
                money(revenue) +
                " جنيه" +
                " | جلسات: " +
                sessions +
                "\n";


            if (
                revenue >
                bestMoney
            ) {

                bestMoney =
                    revenue;

                bestDevice =
                    device.name;

            }

        }
    );


    text +=
        "\n🏆 أكثر جهاز دخلًا:\n" +
        (
            bestDevice ||
            "لا يوجد"
        ) +
        "\n" +
        money(bestMoney) +
        " جنيه";


    return text;

}


/* =========================================================
   عرض تقرير اليوم
========================================================= */

function showDailyReport() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    alert(
        createDailyReport()
    );

}


/* =========================================================
   تصفير اليوم
========================================================= */

function resetTodayMoney() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    if (
        !confirm(
            "⚠️ تحذير!\n\n" +
            "سيتم تصفير إحصائيات اليوم.\n" +
            "هل أنت متأكد؟"
        )
    ) {
        return;
    }


    todayMoney = 0;
    todayGameMoney = 0;
    todayDrinkMoney = 0;
    todayProfit = 0;
    todayExpenses = 0;


    dailyStats = {

        sessions: 0,

        deviceMoney: {},

        deviceSessions: {},

        totalPlaySeconds: 0

    };


    expenses = [];


    saveExpenses();

    saveData();


    updateMoneyDisplay();


    addLog(
        "تصفير اليوم",
        "تم تصفير إحصائيات اليوم"
    );


    alert(
        "✅ تم تصفير اليوم بنجاح"
    );

}


/* =========================================================
   الطوارئ
========================================================= */

function emergencyStop() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    if (
        !confirm(
            "🚨 وضع الطوارئ\n\n" +
            "سيتم إيقاف جميع الأجهزة المشغولة فورًا.\n\n" +
            "هل أنت متأكد؟"
        )
    ) {
        return;
    }


    let stopped =
        0;


    devices.forEach(
        (device, index) => {

            if (!timers[index]) {
                return;
            }


            clearInterval(
                timers[index]
            );


            timers[index] = null;


            finishSession(
                index,
                "🚨 إيقاف طوارئ"
            );


            stopped++;

        }
    );


    addLog(
        "طوارئ",
        "تم إيقاف " +
        stopped +
        " أجهزة"
    );


    playEmergencySound();


    alert(
        "🚨 تم تنفيذ إيقاف الطوارئ\n\n" +
        "الأجهزة التي تم إيقافها: " +
        stopped
    );

}


/* =========================================================
   سجل العمليات
========================================================= */

function showActivityLog() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    if (
        activityLog.length === 0
    ) {

        alert(
            "📝 لا يوجد سجل عمليات"
        );

        return;

    }


    let text =
        "📝 سجل عمليات PGX\n\n";


    activityLog
        .slice()
        .reverse()
        .slice(0, 100)
        .forEach(
            (item, index) => {

                text +=

                    (index + 1) +
                    ") " +
                    item.action +

                    "\n" +
                    item.details +

                    "\n📅 " +
                    item.date +

                    "\n\n";

            }
        );


    alert(text);

}


/* =========================================================
   النسخة الاحتياطية
========================================================= */

function backupData() {

    const backup = {

        version:
            "PGX-FINAL-1.0",

        date:
            nowText(),

        devices:
            devices,

        orders:
            orders,

        gameMoney:
            gameMoney,

        history:
            history,

        inventory:
            inventory,

        employees:
            employees,

        todayMoney:
            todayMoney,

        todayGameMoney:
            todayGameMoney,

        todayDrinkMoney:
            todayDrinkMoney,

        todayProfit:
            todayProfit,

        todayExpenses:
            todayExpenses,

        dailyStats:
            dailyStats,

        shift:
            shift,

        shiftReports:
            shiftReports,

        expenses:
            expenses,

        activityLog:
            activityLog

    };


    const data =
        JSON.stringify(
            backup,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "PGX-Backup-" +
        new Date()
            .toISOString()
            .slice(0, 10) +
        ".json";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    setTimeout(
        () => {
            URL.revokeObjectURL(
                url
            );
        },
        1000
    );


    addLog(
        "نسخة احتياطية",
        "تم إنشاء نسخة احتياطية"
    );


    alert(
        "✅ تم إنشاء النسخة الاحتياطية بنجاح"
    );

}


/* =========================================================
   استرجاع النسخة
========================================================= */

function restoreData() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "file";


    input.accept =
        ".json,application/json";


    input.onchange =
        function(event) {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function() {

                    try {

                        const backup =
                            JSON.parse(
                                reader.result
                            );


                        if (
                            !backup ||
                            !backup.version
                        ) {

                            alert(
                                "❌ ملف النسخة غير صحيح"
                            );

                            return;

                        }


                        if (
                            !confirm(
                                "⚠️ سيتم استبدال البيانات الحالية بالنسخة الاحتياطية.\n\nهل تريد المتابعة؟"
                            )
                        ) {

                            return;

                        }


                        orders =
                            backup.orders ||
                            orders;


                        gameMoney =
                            backup.gameMoney ||
                            gameMoney;


                        history =
                            backup.history ||
                            [];


                        inventory =
                            backup.inventory ||
                            inventory;


                        employees =
                            backup.employees ||
                            [];


                        todayMoney =
                            Number(
                                backup.todayMoney
                            ) || 0;


                        todayGameMoney =
                            Number(
                                backup.todayGameMoney
                            ) || 0;


                        todayDrinkMoney =
                            Number(
                                backup.todayDrinkMoney
                            ) || 0;


                        todayProfit =
                            Number(
                                backup.todayProfit
                            ) || 0;


                        todayExpenses =
                            Number(
                                backup.todayExpenses
                            ) || 0;


                        dailyStats =
                            backup.dailyStats ||
                            dailyStats;


                        shift =
                            backup.shift ||
                            shift;


                        shiftReports =
                            backup.shiftReports ||
                            [];


                        expenses =
                            backup.expenses ||
                            [];


                        activityLog =
                            backup.activityLog ||
                            [];


                        normalizeData();


                        saveExpenses();

                        saveData();


                        alert(
                            "✅ تم استرجاع النسخة الاحتياطية بنجاح\n\n" +
                            "📅 النسخة: " +
                            (
                                backup.date ||
                                "غير معروف"
                            )
                        );


                        location.reload();


                    } catch(error) {

                        console.error(
                            error
                        );


                        alert(
                            "❌ تعذر قراءة النسخة الاحتياطية"
                        );

                    }

                };


            reader.readAsText(
                file
            );

        };


    input.click();

}


/* =========================================================
   تصدير تقرير اليوم كنص
========================================================= */

function copyDailyReport() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    const text =
        createDailyReport();


    copyText(
        text,
        "✅ تم نسخ التقرير"
    );

}


/* =========================================================
   نسخ النص
========================================================= */

function copyText(
    text,
    successMessage
) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(text)
            .then(
                () => {

                    alert(
                        successMessage
                    );

                }
            )
            .catch(
                () => {
                    fallbackCopy(text);
                }
            );

    } else {

        fallbackCopy(text);

    }

}


function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.left =
        "-9999px";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        alert(
            "✅ تم النسخ"
        );

    } catch(error) {

        alert(
            "⚠️ تعذر النسخ تلقائيًا"
        );

    }


    document.body.removeChild(
        textarea
    );

}


/* =========================================================
   تقرير الإدارة
========================================================= */

function managementReport() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    let text =
        createDailyReport();


    text +=
        "\n\n📦 حالة المخزون:\n\n";


    inventory.forEach(item => {

        text +=
            item.name +
            " → " +
            item.stock +
            " قطعة\n";

    });


    text +=
        "\n💸 المصروفات:\n" +
        money(todayExpenses) +
        " جنيه";


    alert(text);

}


/* =========================================================
   لوحة الإدارة
========================================================= */

function adminPanel() {

    if (!askPassword()) {

        alert(
            "❌ كلمة السر خطأ"
        );

        return;

    }


    const choice =
        prompt(

            "🔐 لوحة إدارة PGX\n\n" +

            "1 - 💵 تغيير سعر جهاز\n" +

            "2 - 🗑️ تصفير اليوم\n" +

            "3 - 📊 تقرير اليوم\n" +

            "4 - 📦 المخزن\n" +

            "5 - 👨‍💼 الموظفون\n" +

            "6 - 🟢 فتح الشيفت\n" +

            "7 - 🔴 قفل الشيفت\n" +

            "8 - 📋 سجل الجلسات\n" +

            "9 - 📺 الأجهزة المشغولة\n" +

            "10 - ➕ إضافة منتج\n" +

            "11 - 🔊 اختبار الأصوات\n" +

            "12 - 💾 نسخة احتياطية\n" +

            "13 - ♻️ استرجاع نسخة\n" +

            "14 - 💸 إضافة مصروف\n" +

            "15 - 📋 تقرير المصروفات\n" +

            "16 - 📊 تقارير الشيفتات\n" +

            "17 - 📝 سجل العمليات\n" +

            "18 - 🚨 طوارئ\n" +

            "19 - 📋 نسخ تقرير اليوم\n" +

            "20 - 👁️ نظرة سريعة\n\n" +

            "اكتب رقم الخيار:"
        );


    switch(choice) {

        case "1":
            changePrice();
            break;

        case "2":
            resetTodayMoney();
            break;

        case "3":
            showDailyReport();
            break;

        case "4":
            inventoryPanel();
            break;

        case "5":
            employeesPanel();
            break;

        case "6":
            openShift();
            break;

        case "7":
            closeShift();
            break;

        case "8":
            showHistory();
            break;

        case "9":
            showRunningDevices();
            break;

        case "10":
            addInventoryItem();
            break;

        case "11":
            testSounds();
            break;

        case "12":
            backupData();
            break;

        case "13":
            restoreData();
            break;

        case "14":
            addExpense();
            break;

        case "15":
            expensesReport();
            break;

        case "16":
            showShiftReports();
            break;

        case "17":
            showActivityLog();
            break;

        case "18":
            emergencyStop();
            break;

        case "19":
            copyDailyReport();
            break;

        case "20":
            quickOverview();
            break;

    }

}


/* =========================================================
   تنسيق مدة الشيفت
========================================================= */

function formatDuration(
    milliseconds
) {

    let totalSeconds =
        Math.floor(
            milliseconds / 1000
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );


    totalSeconds %=
        86400;


    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    totalSeconds %=
        3600;


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    if (days > 0) {

        return (
            days +
            " يوم " +
            hours +
            " ساعة " +
            minutes +
            " دقيقة"
        );

    }


    return (
        hours +
        " ساعة " +
        minutes +
        " دقيقة"
    );

}


/* =========================================================
   نظام الأصوات
========================================================= */

function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return null;
        }


        audioContext =
            new AudioContext();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    return audioContext;

}


function beep(
    frequency,
    duration,
    type = "sine",
    volume = 0.2
) {

    const ctx =
        getAudioContext();


    if (!ctx) {
        return;
    }


    const oscillator =
        ctx.createOscillator();


    const gain =
        ctx.createGain();


    oscillator.type =
        type;


    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        0.001,
        ctx.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        volume,
        ctx.currentTime + 0.02
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime +
        duration
    );


    oscillator.connect(
        gain
    );


    gain.connect(
        ctx.destination
    );


    oscillator.start();


    oscillator.stop(
        ctx.currentTime +
        duration
    );

}


/* =========================================================
   صوت بداية جلسة
========================================================= */

function playStartSound() {

    beep(
        700,
        0.12,
        "sine"
    );


    setTimeout(
        () => {

            beep(
                1000,
                0.15,
                "sine"
            );

        },
        130
    );

}


/* =========================================================
   صوت انتهاء الجلسة
========================================================= */

function playEndSound() {

    beep(
        800,
        0.18,
        "square"
    );


    setTimeout(
        () => {

            beep(
                600,
                0.18,
                "square"
            );

        },
        220
    );


    setTimeout(
        () => {

            beep(
                800,
                0.35,
                "square"
            );

        },
        440
    );

}


/* =========================================================
   صوت الشيفت
========================================================= */

function playShiftSound() {

    beep(
        500,
        0.12,
        "triangle"
    );


    setTimeout(
        () => {

            beep(
                750,
                0.2,
                "triangle"
            );

        },
        130
    );

}


/* =========================================================
   صوت تحذير المخزون
========================================================= */

function playWarningSound() {

    beep(
        400,
        0.15,
        "triangle"
    );


    setTimeout(
        () => {

            beep(
                300,
                0.2,
                "triangle"
            );

        },
        180
    );

}


/* =========================================================
   صوت الطوارئ
========================================================= */

function playEmergencySound() {

    beep(
        900,
        0.2,
        "sawtooth",
        0.25
    );


    setTimeout(
        () => {

            beep(
                500,
                0.25,
                "sawtooth",
                0.25
            );

        },
        230
    );


    setTimeout(
        () => {

            beep(
                900,
                0.2,
                "sawtooth",
                0.25
            );

        },
        500
    );

}


/* =========================================================
   اختبار الأصوات
========================================================= */

function testSounds() {

    playStartSound();


    setTimeout(
        () => {

            playEndSound();

        },
        900
    );


    setTimeout(
        () => {

            playShiftSound();

        },
        1900
    );


    setTimeout(
        () => {

            playWarningSound();

        },
        2700
    );


    setTimeout(
        () => {

            playEmergencySound();

        },
        3500
    );

}


/* =========================================================
   استرجاع الواجهة
========================================================= */

function restoreInterface() {

    updateMoneyDisplay();

    updateCounters();


    devices.forEach(
        (device, index) => {

            updateDeviceMoney(
                index
            );


            updateDeviceTime(
                index,
                elapsedSeconds[index] ||
                0
            );

        }
    );

}


/* =========================================================
   حفظ يومي تلقائي
========================================================= */

function autoSave() {

    saveData();

    saveExpenses();

}


/* =========================================================
   تشغيل النظام
========================================================= */

loadData();

createDevices();

restoreInterface();

updateMoneyDisplay();

updateCounters();


/* =========================================================
   حفظ تلقائي
========================================================= */

setInterval(
    autoSave,
    5000
);


/* =========================================================
   حفظ قبل الخروج
========================================================= */

window.addEventListener(
    "beforeunload",
    () => {

        autoSave();

    }
);


/* =========================================================
   حفظ عند إخفاء الصفحة
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "hidden"
        ) {

            autoSave();

        }

    }
);


/* =========================================================
   تحديث تلقائي للواجهة
========================================================= */

setInterval(
    () => {

        updateCounters();

        updateMoneyDisplay();

    },
    1000
);