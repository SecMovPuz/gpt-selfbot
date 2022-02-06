try {
  const Discord = require('v11-discord.js')
  const client = new Discord.Client()
  
  const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
  const fs = require('fs')
  
  const training = fs.readFileSync('training.txt', 'utf-8')
  
  const userToken = process.env['DISCORD TOKEN HERE']
  const userApiKey = process.env['API KEY HERE']

  
  let deleteIt = false;
  
  client.on('ready', () => {
    console.log('ready')
  })
  
  client.on('message', async(msg) => {
    if (msg.author.id != "713074112146309130") return
    if (!msg.content.startsWith('-')) return;
  
    const args = msg.content.slice('-'.length).trim().split(' ');
    const command = args.shift().toLowerCase();
  
    let fullMessage = "";
    for(let i = 0; i < args.length; i++){
      fullMessage += args[i]+" "
    }
    fullMessage = fullMessage.trim()
  
    if(command == "ac1"){
      if(deleteIt) msg.delete();
      if(!msg.content.endsWith('.') && !msg.content.endsWith('?') && !msg.content.endsWith('!')) fullMessage = fullMessage+'.'
      let xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://api.openai.com/v1/engines/davinci-codex/completions')
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('Authorization', 'Bearer '+userApiKey)
  
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText);
          let text = response.choices[0].text;
  
          try {
            eval("(async () => {" + text + "})()")
          }catch(e){
            msg.channel.send('error but continuing to run code')
          }
  
        }
      }
  
      xhr.send(JSON.stringify({
        prompt: training+" "+fullMessage+'\n',
        max_tokens: 1500,
        temperature: 0.02,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ['###'],
        top_p: 1
      }))
    }
    if(command == "ac"){
      if(deleteIt) msg.delete()
      if(!msg.content.endsWith('.') && !msg.content.endsWith('?') && !msg.content.endsWith('!')) fullMessage = fullMessage+'.'
      let xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://api.openai.com/v1/engines/davinci-codex/completions')
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('Authorization', 'Bearer '+userApiKey)
  
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
          let response = JSON.parse(xhr.responseText);
          let text = response.choices[0].text;
          console.log(text)
          try {
            eval(text)
          }catch(e){
            msg.channel.send('error but continuing to run code')
          }
        }
      }
  
      xhr.send(JSON.stringify({
        prompt: training+` Execute only in channel ${msg.channel.id}: ${fullMessage}\n`,
        max_tokens: 1500,
        temperature: 0.03,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ['###'],
        top_p: 1
      }))
    }
    if(command == "delete"){
      deleteIt = !deleteIt
    }
    if(command == "evalac"){
      eval(fullMessage)
    }
  })

  client.login(userToken)
}catch(error){
  console.log("error")
}
