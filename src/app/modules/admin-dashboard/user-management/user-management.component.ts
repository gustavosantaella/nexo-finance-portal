import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, User } from '../../../services/admin.service';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ConfirmModalComponent, LoadingSpinnerComponent],
  template: `
    <div class="flex flex-col gap-10 animate-in fade-in duration-700">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex flex-col gap-1">
          <h2 class="text-4xl font-black text-white tracking-tight">Gestión de Usuarios</h2>
          <p class="text-slate-400 font-medium italic">Control centralizado de cuentas y accesos</p>
        </div>
        
        <!-- Quick Search Bar UI -->
        <div class="relative group max-w-md w-full">
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input type="text" placeholder="Buscar por nombre o email..." 
                 class="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm transition-all shadow-lg shadow-black/20">
        </div>
      </header>

      <!-- Loading State for Initial Fetch -->
      <app-loading-spinner *ngIf="isLoading()" message="Obteniendo lista de usuarios..."></app-loading-spinner>
      
      <!-- Processing Overlay for Actions -->
      <app-loading-spinner *ngIf="isProcessing()" [fullScreen]="true" [message]="processingMessage()"></app-loading-spinner>

      <div *ngIf="!isLoading()" class="relative animate-in slide-in-from-bottom-4 duration-500">
        <app-data-table 
          [columns]="columns" 
          [tableData]="users()" 
          [hasActions]="true"
          [columnTemplates]="templateMap"
          [actionsTemplate]="actionsTemplate">
        </app-data-table>
      </div>

      <!-- Reusable Modal -->
      <app-confirm-modal
        [isOpen]="modalConfig().isOpen"
        [title]="modalConfig().title"
        [message]="modalConfig().message"
        [type]="modalConfig().type"
        [confirmText]="modalConfig().confirmText"
        (confirm)="modalConfig().action()"
        (cancel)="closeModal()">
      </app-confirm-modal>

      <!-- Custom Templates for Cells -->
      <ng-template #userTemplate let-user>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-xs font-black text-indigo-400 border border-indigo-500/30">
            {{ user.full_name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-white tracking-tight">{{ user.full_name }}</span>
            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic">{{ user.email }}</span>
          </div>
        </div>
      </ng-template>

      <ng-template #statusTemplate let-user>
        <div class="flex items-center gap-2">
          <!-- Admin Badge -->
          <span *ngIf="user.is_admin" class="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black rounded-full border border-indigo-500/20 shadow-sm uppercase tracking-tighter">ADMIN</span>
          
          <!-- Status Pill + Dot -->
          <div [class]="user.is_verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'" 
               class="flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm transition-all duration-300">
             <div [class]="user.is_verified ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'" class="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]"></div>
             <span class="text-[9px] font-black uppercase tracking-tight">{{ user.is_verified ? 'Verificado' : 'Pendiente' }}</span>
          </div>
        </div>
      </ng-template>

      <ng-template #dateTemplate let-user>
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center gap-2 text-slate-300">
            <svg class="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <span class="text-xs font-medium">{{ formatDate(user.created_at) }}</span>
          </div>
          <div class="flex items-center gap-1 text-[10px] text-slate-500">
            <span class="font-bold italic opacity-50">#Login:</span>
            <span class="font-medium">{{ formatDate(user.last_sign_in) }}</span>
          </div>
        </div>
      </ng-template>

      <ng-template #actionsTemplate let-user>
        <div class="flex gap-2 justify-end mr-2">
          <button *ngIf="!user.is_verified" (click)="verifyUser(user)" class="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all duration-200 group" title="Verificar Manualmente">
            <svg class="w-5 h-5 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </button>
          <button (click)="toggleAdmin(user)" class="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all duration-200 group" [title]="user.is_admin ? 'Quitar Admin' : 'Hacer Admin'">
            <svg class="w-5 h-5 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </button>
          <button (click)="deactivateUser(user)" class="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all duration-200 group" title="Suspender">
            <svg class="w-5 h-5 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
          </button>
          <button (click)="deleteUser(user)" class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-200 group" title="Borrar">
            <svg class="w-5 h-5 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </ng-template>
    </div>
  `
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('userTemplate') userTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  users = signal<User[]>([]);
  isLoading = signal<boolean>(true);
  isProcessing = signal<boolean>(false);
  processingMessage = signal<string>('');

  columns: TableColumn[] = [
    { key: 'full_name', label: 'Usuario' },
    { key: 'status', label: 'Estado' },
    { key: 'created_at', label: 'Fecha de registro' },
    { key: 'last_sign_in', label: 'Último inicio de sesión' }
  ];

  templateMap: any = {};

  modalConfig = signal<any>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'Confirmar',
    action: () => { }
  });

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.templateMap = {
        'full_name': this.userTemplate,
        'status': this.statusTemplate,
        'created_at': this.dateTemplate
      };
    });
  }

  loadUsers() {
    this.isLoading.set(true);
    console.log('UserManagement: Iniciando carga de usuarios...');
    this.adminService.getUsers().subscribe({
      next: (res) => {
        console.log('UserManagement: Respuesta recibida:', res);
        if (res && res.success) {
          this.users.set([...res.data]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('UserManagement: Error cargando usuarios:', err);
        this.isLoading.set(false);
      }
    });
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Nunca';
    return new Date(dateStr).toLocaleDateString();
  }

  closeModal() {
    this.modalConfig.update(m => ({ ...m, isOpen: false }));
  }

  verifyUser(user: User) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Verificar Usuario',
      message: `¿Estás seguro de que deseas verificar manualmente a ${user.full_name}? Esto le dará acceso inmediato.`,
      type: 'success',
      confirmText: 'Verificar Ahora',
      action: () => {
        this.closeModal();
        this.isProcessing.set(true);
        this.processingMessage.set('Verificando usuario...');
        this.adminService.updateUser(user.id, { is_verified: true }).subscribe({
          next: () => {
            this.loadUsers();
            this.isProcessing.set(false);
          },
          error: () => this.isProcessing.set(false)
        });
      }
    });
  }

  toggleAdmin(user: User) {
    this.isProcessing.set(true);
    this.processingMessage.set('Actualizando permisos...');
    this.adminService.updateUser(user.id, { is_admin: !user.is_admin }).subscribe({
      next: () => {
        this.loadUsers();
        this.isProcessing.set(false);
      },
      error: () => this.isProcessing.set(false)
    });
  }

  deactivateUser(user: User) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Suspender Usuario',
      message: `¿Deseas suspender el acceso de ${user.full_name}?`,
      type: 'danger',
      confirmText: 'Suspender',
      action: () => {
        this.closeModal();
        // Placeholder for real deactivation logic
        alert('Funcionalidad de desactivación para: ' + user.email);
      }
    });
  }

  deleteUser(user: User) {
    this.modalConfig.set({
      isOpen: true,
      title: 'Eliminar Usuario',
      message: `¿ESTÁS ABSOLUTAMENTE SEGURO? Esta acción eliminará permanentemente a ${user.full_name} y todos sus datos no podrán recuperarse.`,
      type: 'danger',
      confirmText: 'Eliminar Permanentemente',
      action: () => {
        this.closeModal();
        this.isProcessing.set(true);
        this.processingMessage.set('Eliminando usuario...');
        this.adminService.deleteUser(user.id).subscribe({
          next: () => {
            this.loadUsers();
            this.isProcessing.set(false);
          },
          error: () => {
            this.isProcessing.set(false);
          }
        });
      }
    });
  }
}
