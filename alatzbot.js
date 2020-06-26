const token = 'NTkyMDkzMjMyODQyODAxMTY4.XRkbag.Ofn8BccRCHoZU2fnLba_vv_MWAQ' // change it to your discord application's token
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '-'
const puppeteer = require('puppeteer');
const ffmpeg = require('ffmpeg');

const dirLocation = 'C:\\Users\\Noam\\Documents\\GitHub\\My-Discord-Bot'

client.login(token);



shtockArr = [
    dirLocation + '\\sound_effects\\shtokeyal.ogg',
    //dirLocation + '\\sound_effects\\shtokerez.ogg', // erez dosent sound well
    dirLocation + '\\sound_effects\\shtokzaguri.ogg'
]

helloArr = [
    dirLocation + '\\sound_effects\\hello\\hello1.ogg',
    dirLocation + '\\sound_effects\\hello\\hello2.ogg',
    dirLocation + '\\sound_effects\\hello\\hello3.ogg',
    dirLocation + '\\sound_effects\\hello\\hello4.ogg'
]

const activities_list = [
    "דוסים אונליין", 
    "באולינג כיסאות",
    "מסירות עם כסא", 
    "סקריבל",
    "שיחת נזיפה",
    "-help"
    ];


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


client.on('ready', () => {
    console.log('Online.');
    setInterval(() => {
        const index = getRndInteger(0, activities_list.length); // generates a random number between 1 and the length of the activities array list (in this case 5).
        if(index === 4){ // need 'Listening To'
            client.user.setActivity(activities_list[index], "LISTENING");    
        }
        client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 30000); // Runs this every <= seconds.
});

client.on('message', async message => {
    // if(message.member.id !== 333667279369797632) return;

    // ma? shtok
    if(message.content === 'מה'){
        if(!message.guild) return; // my not work
        if(message.member.voiceChannel){ // if he is in a voice channel
            message.member.voiceChannel.join()
                .then(async (connection) => {
                    const index = getRndInteger(0, shtockArr.length - 1);
                    const dispatchr = connection.playFile(shtockArr[index], {volume : 0.60});
                    dispatchr.on('end',async () =>{
                        if(index === 1){ // erez
                            await sleep(1000);
                        }
                        message.member.voiceChannel.leave();
                    });
                })
                .catch(console.log);
        }
        else{
            message.reply('אתה לא בשיחה');
        }
    }

    // tamir reaction

    if(message.content.includes('תמיר')){
        message.react('518197466328203266');
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // commands..

    if(command === 'help'){
        helpEmbed = {
            color: 0x99ccff,
            title: ':) היי חברים מה קורה אני יוגב ואני האלצניק החדש פה',
            fields: [
                {
                    name: 'send',
                    value: 'מספים מישהו בוואצאפ\nSyntax: -send ContactName Times Content\nעד 55 הודעות במכה',
                },
                {
                    name: 'צרצר',
                    value: 'קולות של צרצר, למקרה שמישהו מספר בדיחה גרועה'
                },
                {
                    name:'מה',
                    value: 'זאת לא פקודה, כל פעם שתכתוב מה אני אכנס להגיד לך שתוק'
                },
                {
                    name:'הלו',
                    value:'נכנס להגיד הלו, למקרה שמישהו שואל שאלות קיטבג'
                },
                {
                    name:'חירום',
                    value:'אין לי איך להסביר פשוט תנסה'
                },
                {
                    name:'בווה',
                    value:'..די ברור לפי השם'
                },
                {
                    name:'תמיר',
                    value:'אני עושה ריאקט תמיר לכל הודעה שמכילה תמיר'
                }
            ],
        };
        message.channel.send({embed: helpEmbed });
    }

    if (command === 'send') { // spam someone's whatsapp
        if(!args[0] || !args[1] || !args[2]){
            message.reply("Invalid syntax!\n-send [contact name] [times] [message content]");
            return;
        }
        const times = parseInt(args[1]);
		if(times > 55){
			message.channel.send('יותר מדי פעמים');
			return;
		}
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
        await page.goto('https://web.whatsapp.com/');
        await sleep(1000);
        await page.screenshot({ path: 'barcode.jpeg' });
        message.reply("Scan this (you have only 15 seconds): ", { files: ["./barcode.jpeg"] })
        const searchBar = await page.waitForXPath("/html/body/div[1]/div/div/div[3]/div/div[1]/div/label/div/div[2]");
        searchBar.type(args[0]);
        await sleep(100);
        searchBar.press('Enter');
        const messageBar = await page.waitForXPath("//*[@id='main']/footer/div[1]/div[2]/div/div[2]");
        for (let index = 0; index < times; index++) {
            messageBar.type(args[2]);
            await sleep(200);
            messageBar.press('Enter');
            await sleep(100);
        }
		message.reply('!סיימתי');
        browser.close();
    }


    if(command === 'צרצר'){ // play cricket sound
        if(message.member.voiceChannel){ // if he is in a voice channel
            message.member.voiceChannel.join()
                .then(async (connection) => {
                    const dispatchr = connection.playFile(dirLocation + '\\sound_effects\\ckicket\\Cricket_Sound.mp3', {volume : 0.25});
                    dispatchr.on('end',async () =>{
                        message.member.voiceChannel.leave();
                    });
                })
                .catch(console.log);
        }
        else{
            message.reply('אתה לא בשיחה');
        }
    }

    if(command === 'הלו'){
        if(!message.guild) return; // my not work
        if(message.member.voiceChannel){ // if he is in a voice channel
            message.member.voiceChannel.join()
                .then(async (connection) => {
                    const dispatchr = connection.playFile(helloArr[getRndInteger(0, helloArr.length - 1)], {volume : 0.60});
                    dispatchr.on('end',async () =>{
                        await sleep(1000);
                        message.member.voiceChannel.leave();
                    });
                })
                .catch(console.log);
        }
        else{
            message.reply('אתה לא בשיחה');
        }
    }

    if(command === 'חירום'){
        if(message.member.voiceChannel){ // if he is in a voice channel
            message.member.voiceChannel.join()
                .then(async (connection) => {
                    const dispatchr = connection.playFile(dirLocation + '\\sound_effects\\emergency\\zagu.ogg', {volume : 0.50});
                    dispatchr.on('end',async () =>{
                        await sleep(1000);
                        message.member.voiceChannel.leave();
                    });
                })
                .catch(console.log);
        }
        else{
            message.reply('אתה לא בשיחה');
        }
    }

    if(command === 'בווה'){
        if(message.member.voiceChannel){ // if he is in a voice channel
            message.member.voiceChannel.join()
                .then(async (connection) => {
                    const dispatchr = connection.playFile(dirLocation + '\\sound_effects\\bwe\\zaguBwe.ogg', {volume : 0.50});
                    dispatchr.on('end',async () =>{
                        await sleep(1000);
                        message.member.voiceChannel.leave();
                    });
                })
                .catch(console.log);
        }
        else{
            message.reply('אתה לא בשיחה');
        }
    }
})
