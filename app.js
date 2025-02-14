const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function runTrafficGenerator(url, loops) {
    const concurrency = 5; 
    const totalBatches = Math.ceil(loops / concurrency);
    
    for (let batch = 0; batch < totalBatches; batch++) {
        const promises = [];
        const currentLoops = Math.min(concurrency, loops - (batch * concurrency));
        
        for (let i = 0; i < currentLoops; i++) {
            promises.push((async () => {
                try {
                    const browser = await puppeteer.launch({ headless: true });
                    const browserPage = await browser.newPage();
                
                    await browserPage.goto(url, { waitUntil: 'networkidle2' });
                    
                 
                    await browserPage.mouse.move(
                        Math.random() * 800,
                        Math.random() * 600
                    );
                    await browserPage.mouse.click(
                        Math.random() * 800,
                        Math.random() * 600
                    );
                    
                    const visitNumber = (batch * concurrency) + i + 1;
                    console.log(`Visit ${visitNumber} completed`);
                    
                    await browser.close();
                } catch (error) {
                    console.error('Error in browser instance:', error);
                }
            })());

        }
        
        await Promise.all(promises);
    }
}

rl.question('Enter the URL: ', (url) => {
    rl.question('Enter number of visits: ', (loops) => {
        const numLoops = parseInt(loops);
        if (isNaN(numLoops) || numLoops <= 0) {
            console.log('Please enter a valid number of visits');
            process.exit(1);
        }
        
        runTrafficGenerator(url, numLoops)
            .then(() => {
                console.log(' generation completed');
                rl.close();
            })
            .catch(err => {
                console.error('Error:', err);
                rl.close();
            });
    });
});
