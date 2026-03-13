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
    <div class="flex flex-col gap-6">
      <header>
        <h2 class="text-3xl font-bold text-slate-100">Gestión de Usuarios</h2>
        <p class="text-slate-400">Administra los accesos y estados de los usuarios</p>
      </header>

      <!-- Loading State for Initial Fetch -->
      <app-loading-spinner *ngIf="isLoading()" message="Obteniendo lista de usuarios..."></app-loading-spinner>
      
      <!-- Processing Overlay for Actions -->
      <app-loading-spinner *ngIf="isProcessing()" [fullScreen]="true" [message]="processingMessage()"></app-loading-spinner>

      <app-data-table 
        *ngIf="!isLoading()"
        [columns]="columns" 
        [tableData]="users()" 
        [hasActions]="true"
        [columnTemplates]="templateMap"
        [actionsTemplate]="actionsTemplate">
      </app-data-table>

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
        <div class="flex flex-col">
          <span class="font-bold text-slate-100">{{ user.full_name }}</span>
          <span class="text-xs text-slate-400 font-medium">{{ user.email }}</span>
        </div>
      </ng-template>

      <ng-template #statusTemplate let-user>
        <div class="flex flex-wrap gap-2">
          <span *ngIf="user.is_admin" class="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[9px] font-black rounded border border-indigo-500/30 uppercase tracking-tighter">ADMIN</span>
          <span [class]="user.is_verified ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'" class="px-2 py-0.5 text-[9px] font-black rounded border uppercase tracking-tighter">
            {{ user.is_verified ? 'VERIFICADO' : 'PENDIENTE' }}
          </span>
        </div>
      </ng-template>

      <ng-template #dateTemplate let-user>
        <div class="flex flex-col">
          <span class="text-sm text-slate-300">{{ formatDate(user.created_at) }}</span>
          <span class="text-[10px] text-slate-500 italic">Login: {{ formatDate(user.last_sign_in) }}</span>
        </div>
      </ng-template>

      <ng-template #actionsTemplate let-user>
        <div class="flex gap-4 justify-end">
          <button *ngIf="!user.is_verified" (click)="verifyUser(user)" class="text-slate-500 hover:text-emerald-400 transition" title="Verificar Manualmente">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </button>
          <button (click)="toggleAdmin(user)" class="text-slate-500 hover:text-indigo-400 transition" [title]="user.is_admin ? 'Quitar Admin' : 'Hacer Admin'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </button>
          <button (click)="deactivateUser(user)" class="text-slate-500 hover:text-rose-400 transition" title="Suspender">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
          </button>
          <button (click)="deleteUser(user)" class="text-slate-500 hover:text-rose-600 transition" title="Borrar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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
