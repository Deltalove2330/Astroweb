import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatMensaje } from '../../core/models/visita.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatListModule,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  messages = signal<ChatMensaje[]>([]);
  connected = signal(false);
  messageControl = new FormControl('');
  currentUserId = signal<number | null>(null);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private wsSubscription?: Subscription;
  private room = 'general';

  constructor(
    private api: ApiService,
    private ws: WebSocketService,
    private auth: AuthService,
  ) {
    this.currentUserId.set(this.auth.currentUser()?.id ?? null);
  }

  ngOnInit(): void {
    this.wsSubscription = this.ws.connectToChat(this.room).subscribe({
      next: (msg) => {
        this.messages.update((ms) => [...ms, msg]);
        this.connected.set(true);
        setTimeout(() => this.scrollToBottom(), 50);
      },
      error: () => { this.connected.set(false); },
    });
  }

  sendMessage(): void {
    const text = this.messageControl.value?.trim();
    if (!text) return;
    const user = this.auth.currentUser();
    this.ws.sendToChat(this.room, {
      mensaje: text,
      sender_type: 'user',
      sender_id: user?.id,
      sender_nombre: user?.username,
    });
    this.messageControl.reset();
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
    this.ws.disconnectAll();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch {}
  }
}
