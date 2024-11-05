import { Component, OnInit } from '@angular/core';
import Configuration from 'openai';
import OpenAI from 'openai';
import { from } from 'rxjs';

interface BotMessage{
  sender: 'user' | 'bot',
  text: string
}
const OPEN_API_KEY = "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";


@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit{
  messages: BotMessage[] = [
    { sender: 'bot', text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?" },
    { sender: 'user', text: "J'aimerais en savoir plus sur vos services." },
    { sender: 'bot', text: "Absolument, nous proposons une gamme de services dans divers domaines. Quel domaine vous intéresse particulièrement ?" },
    { sender: 'user', text: "Je m'intéresse à la conception web." },
    { sender: 'bot', text: "La conception web est un domaine passionnant. Avez-vous des compétences préalables en conception ou programmation ?" },
    { sender: 'user', text: "Oui, j'ai des connaissances en HTML, CSS et JavaScript." },
    { sender: 'bot', text: "C'est génial ! Avec ces compétences, vous êtes bien parti pour explorer la conception web. N'hésitez pas à poser des questions spécifiques si vous en avez." },
  ]
  userMessage: any
  chatbotOpen: boolean = false;


  ngOnInit(): void {
    

        
  }

  sendMessage(){
    const openai = new OpenAI({
      apiKey: OPEN_API_KEY,
      dangerouslyAllowBrowser: true
    });
    from(openai.chat.completions.create({
      messages: [{role: 'user', content: 'Dis salut'}],
      model: 'gpt-3.5-turbo',
    })).subscribe(
      (answer)=>console.log(answer)
    )
  }
  toggleChatbot(){
    this.chatbotOpen = !this.chatbotOpen;
  }
}
