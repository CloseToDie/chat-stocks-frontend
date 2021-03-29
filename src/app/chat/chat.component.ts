import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ChatService} from './shared/chat.service';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounce, debounceTime, take, takeUntil} from 'rxjs/operators';
import {ChatClient} from './shared/chat-client.model';
import {ChatMessage} from './shared/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messageFc = new FormControl('');
  nickNameFc = new FormControl('');
  messages: ChatMessage[] = [];
  clientsTyping: ChatClient[] = [];
  unsubscribe$ = new Subject();
  nickname: string | undefined;
  clients$: Observable<ChatClient[]> | undefined;
  constructor(private chatService: ChatService) { }

  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;

  // tslint:disable-next-line:typedef
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.clients$ = this.chatService.listenForClients();
    this.messageFc.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(500)
      )
      .subscribe((value) => {
        this.chatService.sendTyping(value.length > 0);
      });
    this.chatService.listenForMessages()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(message => {
        this.messages.push(message);
      });
    this.chatService.getAllMessages()
      .pipe(
        take(1)
      )
      .subscribe(messages => {
        this.messages = messages;
      });
    this.chatService.listenForClientTyping()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe((chatClient) => {
        if (chatClient.typing && !this.clientsTyping.find((c) => c.id === chatClient.id)) {
          this.clientsTyping.push(chatClient);
        } else {
          this.clientsTyping = this.clientsTyping.filter((c) => c.id !== chatClient.id);
        }
      });
    this.chatService.connect();
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.chatService.disconnect();
  }

  sendMessage(): void {
    if (this.messageFc.value) {
      this.chatService.sendMessage(this.messageFc.value);
      this.messageFc.patchValue('');
    }
  }

  sendNickName(): void {
    if (this.nickNameFc.value) {
      this.nickname = this.nickNameFc.value;
      this.chatService.sendNickName(this.nickNameFc.value);
    }
  }

  scrollToBottom(): void {
    try {
      // @ts-ignore
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
