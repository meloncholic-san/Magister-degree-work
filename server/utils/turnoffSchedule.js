
const puppeteer = require('puppeteer-extra');
const fs = require('fs');
const path = './server/lastRun.txt';
const { JSDOM } = require('jsdom');

// Додаємо плагіни для Puppeteer
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// Функція для перевірки, чи потрібно виконати парсинг
function shouldRunToday() {
    if (!fs.existsSync(path)) {
        return true; // Якщо файл не існує, потрібно виконати парсинг
    }

    const lastRunDate = new Date(fs.readFileSync(path, 'utf8'));
    const now = new Date();

    // Перевіряємо, чи пройшов більше одного дня від останнього виконання
    return now - lastRunDate >= 24 * 60 * 60 * 1000; // 24 години в мілісекундах
}

// Функція для запису часу виконання
function updateLastRunTime() {
    fs.writeFileSync(path, new Date().toISOString(), 'utf8');
}

// Функція для парсингу сайту
async function fetchTableFromWebsite() {
    console.log("Starting browser...");
    const browser = await puppeteer.launch({ headless: false });
    console.log("Browser started.");

    const page = await browser.newPage();
    console.log("Navigating to the page...");
    await page.goto("https://www.dtek-kem.com.ua/ua/shutdowns", { waitUntil: 'domcontentloaded' });
    console.log("Page loaded.");

    try {
        await page.waitForSelector('#street', { timeout: 10000 });
        console.log('Street input found.');
    } catch (error) {
        console.error('Element #street not found:', error);
        await browser.close();
        return;
    }

    console.log('Entering street data...');
    await page.type('#street', 'вул. Яблонської');
    console.log('Street data entered.');

    const streetName = await page.evaluate(() => {
        return document.querySelector('#street')?.value || null;
    });

    if (streetName === 'вул. Антоновича') {
        console.log('Street name entered correctly.');
    } else {
        console.log('Street name entered incorrectly or not found.');
    }

    console.log('Pressing Enter key...');
    await page.keyboard.press('Enter');
    console.log('Enter key pressed.');

    try {
        await page.waitForSelector("#house_num:not([disabled])", { timeout: 10000 });
        await page.type("#house_num", "1");
        await page.keyboard.press("Enter");

        await page.waitForSelector("#tableRenderElem table", { timeout: 10000 });

        const tableHTML = await page.evaluate(() => {
            return document.querySelector("#tableRenderElem table").outerHTML;
        });

        // Парсинг елемента #showCurOutage
        const outageInfo = await page.evaluate(() => {
            const element = document.querySelector("#showCurOutage");
            if (element) {
                const textContent = element.querySelector("p")?.textContent.trim();
                if (textContent.includes("в даний момент відсутня електроенергія")) {
                    return {
                        status: "В даний момент відсутня електроенергія",
                        reason: element.querySelector("strong")?.textContent.trim(),
                        startTime: element.querySelector("strong:nth-of-type(2)")?.textContent.trim(),
                        estimatedRecovery: element.querySelector("strong:nth-of-type(3)")?.textContent.trim(),
                        updateTime: element.querySelector("._update_info")?.nextSibling?.textContent.trim()
                    };
                } else {
                    return {
                        status: "Світло за нашою адресою є",
                        updateTime: element.querySelector("._update_info")?.nextSibling?.textContent.trim()
                    };
                }
            }
            return null;
        });

        console.log("Table HTML and outage info extracted.");

        await browser.close();

        // Передаємо таблицю та інформацію про відключення для обробки
        const timesForAdditionalQueries = processTable(tableHTML, outageInfo);

        // Запускаємо додаткові запити через пів години після початку кожного відключення
        for (const time of timesForAdditionalQueries) {
            const delay = time - Date.now();
            if (delay > 0) {
                console.log(`Scheduling additional query for ${new Date(time).toLocaleTimeString()}`);
                setTimeout(fetchTableFromWebsite, delay);
            }
        }
    } catch (error) {
        console.error("Error during parsing:", error);
        await browser.close();
    }
}

function processTable(htmlString, outageInfo) {
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    const daysOfWeek = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];
    const todayIndex = new Date().getDay();
    const todayName = daysOfWeek[todayIndex];

    const rows = document.querySelectorAll("tbody tr");
    let jsonData = {
        outageInfo: outageInfo || {}
    };

    const additionalQueryTimes = [];
    let lastScheduledTime = null; // Для отслеживания времени последнего обнаруженного scheduled

    rows.forEach((row) => {
        const day = row.querySelector("td div")?.textContent.trim();

        if (day === todayName) {
            console.log(`Сьогодні: ${day}`);

            const cells = row.querySelectorAll("td.cell-scheduled, td.cell-scheduled-maybe, td.cell-non-scheduled");

            jsonData[day] = [];

            cells.forEach((cell, index) => {
                const timeSlot = `${index.toString().padStart(2, "0")}:00 - ${(index + 1).toString().padStart(2, "0")}:00`;
                const status = cell.className.replace("cell-", "");

                jsonData[day].push({ timeSlot, status });

                if (status === "scheduled") {
                    const timeSlotStart = new Date();
                    timeSlotStart.setHours(index, 30, 0, 0);
                    if (lastScheduledTime === null || timeSlotStart.getTime() >= lastScheduledTime + 6 * 60 * 60 * 1000) {
                        additionalQueryTimes.push(timeSlotStart.getTime());
                        lastScheduledTime = timeSlotStart.getTime();
                    }
                } else if (status === "non-scheduled") {
                    // Завершение группы scheduled
                    isInScheduledGroup = false;
                }
            });
        }
    });

    // Записуємо дані у файл
    const jsonFilePath = "./server/schedule.json";
    fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error("Помилка при записі JSON у файл:", err);
        } else {
            console.log(`Дані успішно записані у файл: ${jsonFilePath}`);
        }
    });

    return additionalQueryTimes;
}


// Функція для запуску щоденно о 00:00
function scheduleDailyTask() {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setDate(now.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);

    const timeToMidnight = nextMidnight - now;
    console.log(`Час до опівночі: ${timeToMidnight / 1000} секунд`);

    if (shouldRunToday()) {
        // Запускаємо парсинг одразу, якщо `lastRun.txt` відсутній
        fetchTableFromWebsite().then(() => {
            updateLastRunTime(); // Оновлюємо час виконання
            setTimeout(scheduleDailyTask, timeToMidnight); // Встановлюємо таймер на наступний запуск о півночі
        });
    } else {
        setTimeout(scheduleDailyTask, timeToMidnight); // Встановлюємо таймер на наступний запуск о півночі
    }
}

// // Запускаємо процес
// scheduleDailyTask();
module.exports = { scheduleDailyTask };