import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { WebSocketService } from '../../core/services/websocket.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatMensaje } from '../../core/models/visita.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatListModule, MatProgressSpinnerModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  inbox = signal<any[]>([]);
  searchResults = signal<any[]>([]);
  messages = signal<ChatMensaje[]>([]);
  connected = signal(false);
  isSearching = signal(false);
  
  messageControl = new FormControl('');
  searchControl = new FormControl('');
  
  currentUserId = signal<number | null>(null);
  selectedVisitaId = signal<number | null>(null);
  selectedPunto = signal<string>('');

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private wsSubscription?: Subscription;
  private searchSubscription?: Subscription;

  constructor(
    private api: ApiService,
    private ws: WebSocketService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {
    this.currentUserId.set(this.auth.currentUser()?.id ?? null);
  }

  ngOnInit(): void {
    this.loadInbox();
    
    this.route.queryParams.subscribe(params => {
      const visitaId = params['visita'] ? parseInt(params['visita'], 10) : null;
      if (visitaId) {
        this.selectChat(visitaId);
      }
    });

    this.searchSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query && query.trim().length >= 2) {
        this.isSearching.set(true);
        this.api.searchChatVisits(query.trim()).subscribe({
          next: (results) => {
            this.searchResults.set(results);
            this.isSearching.set(false);
          },
          error: () => this.isSearching.set(false)
        });
      } else {
        this.searchResults.set([]);
      }
    });
  }

  get activeList() {
    return this.searchControl.value ? this.searchResults() : this.inbox();
  }

  loadInbox(): void {
    this.api.getChatInbox().subscribe({
      next: (data) => {
        this.inbox.set(data);
        const currentVisitaId = this.selectedVisitaId();
        if (currentVisitaId && !data.find(d => d.visita_id === currentVisitaId)) {
          this.inbox.update(inbox => [{
            visita_id: currentVisitaId,
            punto_nombre: this.selectedPunto() || "Nueva Conversación",
            last_message: "Escribe un mensaje para comenzar...",
            fecha_visita: new Date().toISOString()
          }, ...inbox]);
        }
      }
    });
  }

  selectChat(visitaId: number, puntoNombre?: string): void {
    if (this.selectedVisitaId() === visitaId) return;
    
    this.selectedVisitaId.set(visitaId);
    if (puntoNombre) {
      this.selectedPunto.set(puntoNombre);
    } else {
      const chatInfo = this.activeList.find(i => i.visita_id === visitaId);
      if (chatInfo) this.selectedPunto.set(chatInfo.punto_nombre);
      else this.selectedPunto.set('Visita #' + visitaId);
    }

    // Clear search if we were searching
    if (this.searchControl.value) {
      this.searchControl.setValue('', { emitEvent: false });
      this.searchResults.set([]);
      this.loadInbox(); // Reload to ensure the new chat is at the top
    }

    // Disconnect old socket if any
    this.wsSubscription?.unsubscribe();
    this.ws.disconnectAll();
    this.messages.set([]);

    // Load history
    this.api.getMessagesByVisit(visitaId).subscribe({
      next: (history) => {
        this.messages.set(history);
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });

    // Connect to room
    this.wsSubscription = this.ws.connectToChat(visitaId.toString()).subscribe({
      next: (msg) => {
        this.messages.update((ms) => [...ms, msg]);
        this.connected.set(true);
        setTimeout(() => this.scrollToBottom(), 50);
        // Also refresh inbox to bring it to top
        if (!this.searchControl.value) {
          this.loadInbox();
        }
      },
      error: () => { this.connected.set(false); },
    });
  }

  sendMessage(): void {
    const text = this.messageControl.value?.trim();
    const visitaId = this.selectedVisitaId();
    if (!text || !visitaId) return;
    
    const user = this.auth.currentUser();
    this.ws.sendToChat(visitaId.toString(), {
      visita_id: visitaId,
      mensaje: text,
      sender_type: user?.is_client ? 'cliente' : 'usuario',
      sender_id: user?.id,
      sender_nombre: user?.username,
    });
    this.messageControl.reset();
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
    this.searchSubscription?.unsubscribe();
    this.ws.disconnectAll();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch {}
  }
}
